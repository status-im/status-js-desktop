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
import { getKeyData, createVault, restoreVault } from '../utils/keyManagement';

const mnemonic = "example exile argue silk regular smile grass bomb merge arm assist farm";

const typingNotificationsTimestamp = {};

const DEFAULT_CHANNEL = "mytest";
const URL = "ws://localhost:8546";
const status = new StatusJS();

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
    this.setupKeyringController();
  }

  connect = async (account) => {
    this.keyringController.exportAccount(account)
        .then(key => { status.connect(URL, `0x${key}`) })
        .then(() => { this.onConnect() })
  }

  onConnect = () => {
    const { currentChannel } = this.state;
    this.joinChannel(currentChannel);
    this.pingChannel();
    this.createOnUserMessageHandler();
  }

  pingChannel = () => {
    const { currentChannel } = this.state;
    setInterval(() => {
      status.sendJsonMessage(currentChannel, {type: "ping"});
    }, 5 * 1000)
  }

  setupKeyringController = async () => {
    const keyStore = getKeyData();
    if (!keyStore) {
      this.keyringController = await createVault('test', mnemonic);
    } else {
      this.keyringController = await restoreVault('test');
    }
    const accounts = await this.keyringController.getAccounts();
    this.connect(accounts[0]);
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
    })
  }

  addConversationEntry = (code, changeChannel = true) => {
    const { channels, currentChannel } = this.state;
    this.setState({
      currentChannel: changeChannel ? code : currentChannel,
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

  createOnUserMessageHandler = () => {
    status.onUserMessage((err, res) => {
      if (res) {
        const payload = JSON.parse(res.payload);
        const msg = payload[1][0];
        const sender = res.data.sig;
        const message = { username: res.username, message: msg, data: res };
        this.setState((prevState) => {
          const existing = prevState.messages[sender];
          return {
            messages: {
              ...prevState.messages,
              [sender]: existing ? [ ...existing, message ] : [ message ]
            },
            channels: {
              ...prevState.channels,
              [sender]: { username: res.username, users: {} }
            }
          }
        })
      }
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

  typingEvent = () => {
    const { currentChannel } = this.state;
    const now = (new Date().getTime());

    if (!typingNotificationsTimestamp[currentChannel]) {
      typingNotificationsTimestamp[currentChannel] = { lastEvent: 0 }
    }
    if (typingNotificationsTimestamp[currentChannel].lastEvent === 0 || now - typingNotificationsTimestamp[currentChannel].lastEvent > 3*1000) {;
      typingNotificationsTimestamp[currentChannel].lastEvent = now;
      status.sendJsonMessage(currentChannel, {type: "typing"});
    }
  }

  render() {
    const { messages, channels, currentChannel, users, usersTyping } = this.state;
    const channelUsers = channels[currentChannel].users;
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
              usersTyping={usersTyping}
              typingEvent={this.typingEvent}
              channelUsers={channelUsers}
              allUsers={users}
            />
          </Grid>
        </Grid>
      </ChatContext.Provider>
    );
  }
}
