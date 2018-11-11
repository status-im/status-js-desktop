// @flow
import React, { Component } from 'react';
import StatusJS from 'status-js-api';
import { isNil } from 'lodash';
import Grid from '@material-ui/core/Grid';
import routes from '../constants/routes';
import ChatRoom from './ChatRoom';
import ContextPanel from './ContextPanel';
import { User } from '../utils/actors';
import { ChatContext } from '../context';

let typingNotificationsTimestamp = {};

const DEFAULT_CHANNEL = "mytest";
const status = new StatusJS();
status.connect("ws://localhost:8546");

// let userPubKey = await status.getPublicKey();

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  state = {
    messages: { [DEFAULT_CHANNEL]: [] },
    users: {},
    channels: {
      [DEFAULT_CHANNEL]: { users: {} }
    },
    currentChannel: DEFAULT_CHANNEL,
    usersTyping: { [DEFAULT_CHANNEL]: [] }
  };

  componentDidMount() {
    const { currentChannel } = this.state;
    this.joinChannel(currentChannel);

    setInterval(() => {
      console.dir("setInterval!");
      const { currentChannel, users } = this.state;
      console.dir("channel: " + currentChannel);
      status.sendJsonMessage(currentChannel, {type: "ping"});

      let currentTime = (new Date().getTime());
      for (let pubkey in users) {
        let user = users[pubkey];
        if (currentTime - user.lastSeen > 10*1000) {
          user.online = false;
          this.setState(prevState => ({
            users: {
               ...prevState.users,
               [pubkey]: user
            }
          }))
        }
      }
    }, 5 * 1000);
  }

  setActiveChannel = channelName => {
    this.setState({ currentChannel: channelName,  });
  }

  joinChannel = channelName => {
    const { channels } = this.state;
    status.joinChat(channelName, () => {
      this.setState({
        currentChannel: channelName,
        channels: { ...channels, [channelName]: { users: {} } }
      })
      console.log(`joined channel ${channelName}`);
      status.onMessage(channelName, (err, data) => {
        const msg = JSON.parse(data.payload)[1][0];

        if (JSON.parse(data.payload)[1][1] === 'content/json') {
          return this.handleProtocolMessages(channelName, data);
        } else {
          //channels.addMessage(DEFAULT_CHANNEL, msg, data.data.sig, data.username)
        }
        const message = { username: data.username, message: msg, pubkey: data.data.sig, data };
        this.setState((prevState) => {
          const existing = prevState.messages[channelName];
          return {
            messages: {
              ...prevState.messages,
              [channelName]: existing ? [ ...existing, message ] : [ message ]
            }
          }
        })
      });
    });
  }

  sendMessage = message => {
    const { currentChannel } = this.state;
    status.sendMessage(currentChannel, message);
  }

  addUserToChannel = (channelName, user) => {
    const { channels } = this.state;
    const channel = { ...channels[channelName] };
    channel.users[user.pubkey] = user;
    this.setState({ channels: { ...channels, [channelName]: channel }});
  }

  getChannel = channelName => {
    const { channels } = this.state;
    return channels.find(c => c.name === channelName);
  }

  handleProtocolMessages = (channelName, data) => {
    const msg = JSON.parse(JSON.parse(data.payload)[1][0]);
    const fromUser = data.data.sig;

    if (msg.type === 'ping') {
      const user = this.addOrUpdateUserKey(fromUser, data.username);
      this.addUserToChannel(channelName, user);
    }

    if (msg.type === 'typing') {
      this.setState(prevState => ({
        usersTyping: {
          ...prevState.usersTyping,
          [channelName]: {
            [fromUser]: (new Date().getTime())
          }
        }
      }))
    }
  }

  addOrUpdateUserKey = (pubkey, username) => {
    const user = new User(pubkey, username);
    user.lastSeen = (new Date().getTime());
    user.online = true;
    this.setState(prevState => ({
      users: {
        ...prevState.users,
        [pubkey]: user
      }
    }))
    return user;
  }

  whoIsTyping() {
    const { users, usersTyping, currentChannel } = this.state;
    let currentTime = (new Date().getTime());

    let userList = [], typingInChannel = usersTyping[currentChannel];
    for (let pubkey in typingInChannel) {
      let lastTyped = typingInChannel[pubkey];

      if (!users[pubkey]) continue;
      if (currentTime - lastTyped > 3*1000 || currentTime < lastTyped) continue;
      //if (pubkey === userPubKey) continue; // ignore self
      userList.push(users[pubkey].username)
    }

    if (userList.length === 0) return "";

    return userList.join(', ') + " is typing";
  }

  typingEvent() {
    const { currentChannel } = this.state;
    let now = (new Date().getTime());

    if (!typingNotificationsTimestamp[currentChannel]) {
      typingNotificationsTimestamp[currentChannel] = { lastEvent: 0 }
    }
    if (typingNotificationsTimestamp[currentChannel].lastEvent === 0 || now - typingNotificationsTimestamp[currentChannel].lastEvent > 3*1000) {;
      typingNotificationsTimestamp[currentChannel].lastEvent = now;
      status.sendJsonMessage(currentChannel, {type: "typing"});
    }
  }

  render() {
    const { messages, channels, currentChannel, users } = this.state;
    const channelUsers = channels[currentChannel].users;
    const { setActiveChannel } = this;
    const chatContext = { setActiveChannel, currentChannel, users, channels };

    return (
      <ChatContext.Provider value={chatContext}>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            {!isNil(channels) && <ContextPanel
                                   channels={channels}
                                   joinChannel={this.joinChannel} />}
          </Grid>
          <Grid item xs={9}>
            <ChatRoom
              messages={messages}
              sendMessage={this.sendMessage}
              currentChannel={currentChannel}
              usersTyping={this.whoIsTyping()}
              typingEvent={this.typingEvent.bind(this)}
              channelUsers={channelUsers}
              allUsers={this.state.users}
            />
          </Grid>
        </Grid>
      </ChatContext.Provider>
    );
  }
}
