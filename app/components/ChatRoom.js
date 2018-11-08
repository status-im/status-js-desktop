// @flow
import React, { Fragment } from 'react';
import List from '@material-ui/core/List';
import ChatBox from './ChatBox.js';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const listStyle = { overflow: 'scroll', height: '90%' };
const ChatRoom = ({ messages }) => (
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
      <Button variant="contained" >
        Send Message
      </Button>
    </Grid>
  </div>
);

export default ChatRoom;
