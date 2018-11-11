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
import { isContactCode } from '../utils/parsers';

const typingNotificationsTimestamp = {};

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
  }

  setActiveChannel = channelName => {
    this.setState({ currentChannel: channelName,  });
  }

  joinConversation = contact => {
    const { joinChannel, addDirectMessage } = this;
    if (isContactCode(contact)) {
      addDirectMessage(contact)
    } else {
      joinChannel(contact)
    }
  }

  addDirectMessage = contactCode => {
    status.addContact(contactCode, () => {
      this.addConversationEntry(contactCode);
      this.createOnUserMessageHandler(contactCode);
    })
  }

  addConversationEntry = code => {
    const { channels } = this.state;
    this.setState({
      currentChannel: code,
      channels: {
        ...channels,
        [code]: { users: {} }
      }
    })
  }

  joinChannel = channelName => {
    status.joinChat(channelName, () => {
      this.addConversationEntry(channelName);
      console.log(`joined channel ${channelName}`);
      status.onMessage(channelName, (err, data) => {
        const msg = JSON.parse(data.payload)[1][0];

        if (JSON.parse(data.payload)[1][1] === 'content/json') {
          return this.handleProtocolMessages(channelName, data);
        }
        const message = { username: data.username, message: msg, data };
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

  createOnUserMessageHandler = contactCode => {
    status.onUserMessage((err, data) => {
      const payload = JSON.parse(data.payload);
      const msg = payload[1][0];
      //const sender = data.sig;

      const message = { username: data.username, message: msg, data };
      this.setState((prevState) => {
        const existing = prevState.messages[contactCode];
        return {
          messages: {
            ...prevState.messages,
            [contactCode]: existing ? [ ...existing, message ] : [ message ]
          }
        }
      })
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
    const { setActiveChannel } = this;
    const chatContext = { setActiveChannel, currentChannel, users, channels };
    return (
      <ChatContext.Provider value={chatContext}>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            {!isNil(channels) && <ContextPanel
                                   channels={channels}
                                   joinConversation={this.joinConversation} />}
          </Grid>
          <Grid item xs={9}>
            <ChatRoom
              messages={messages}
              sendMessage={this.sendMessage}
              currentChannel={currentChannel}
              usersTyping={this.whoIsTyping()}
              typingEvent={this.typingEvent.bind(this)}
            />
          </Grid>
        </Grid>
      </ChatContext.Provider>
    );
  }
}
