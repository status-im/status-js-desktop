// @flow
import React, { Fragment } from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ChatBox from './ChatBox.js';


const messageSend = (send, value) => {
  send(value);
  value = "";
};
const listStyle = { overflow: 'scroll', height: '85%' };
const ChatRoom = ({ messages, sendMessage }) => (
  <div style={{ height: '100vh' }}>
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      style={{ height: '100%' }}
    >
      <List style={listStyle}>
        {messages.map((message, idx) => (
          <Fragment key={idx + message.message}>
            <ChatBox {...message} />
            <li>
              <Divider inset />
            </li>
          </Fragment>
        ))}
      </List>
      <Divider />
        <TextField
          id="outlined-search"
          label="Type a message..."
          type="text"
          margin="normal"
          variant="outlined"
          fullWidth
          onBlur={(e) => { messageSend(sendMessage, e.target.value) }}
        />
    </Grid>
  </div>
);

export default ChatRoom;
