// @flow
import React, { Component } from 'react';
import StatusJS from 'status-js-api';
import routes from '../constants/routes';
import ChatRoom from './ChatRoom';

const DEFAULT_CHANNEL = "mytest";
const status = new StatusJS();
status.connect("ws://localhost:8546");

  type Props = {};

  export default class Home extends Component<Props> {
    props: Props;

    state = {
      messages: []
    };

    componentDidMount() {
      status.joinChat(DEFAULT_CHANNEL, () => {
        console.log(`joined channel ${DEFAULT_CHANNEL}`);
        status.onMessage(DEFAULT_CHANNEL, (err, data) => {
          const msg = JSON.parse(data.payload)[1][0];

          if (JSON.parse(data.payload)[1][1] === 'content/json') {
            //handleProtocolMessages(DEFAULT_CHANNEL, data);
          } else {
            //channels.addMessage(DEFAULT_CHANNEL, msg, data.data.sig, data.username)
          }
          const message = { username: data.username, message: msg };
          this.setState((prevState) => {
            return { messages: [ ...prevState.messages, message ], bob: "bob"}
          })
        });
      });
    }

    render() {
      const { messages } = this.state;
      console.log({messages})
      return (
        <div data-tid="container">
          <ChatRoom messages={messages} />
        </div>
      );
  }
}
