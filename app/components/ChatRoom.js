// @flow
import React, { Fragment } from 'react';
import List from '@material-ui/core/List';
import ChatBox from './ChatBox.js';
import Divider from '@material-ui/core/Divider';

const ChatRoom = ({ messages }) => (
  <div>
    <List>
      {messages.map((message, idx) => (
        <Fragment key={idx + message.message}>
          <ChatBox {...message} />
          <li>
            <Divider inset />
          </li>
        </Fragment>
      ))}
    </List>
  </div>
);

export default ChatRoom;
