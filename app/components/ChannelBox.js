// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { ChatContext } from '../context';

const ChannelBox = ({ channelName, message }) => (
  <ChatContext.Consumer>
    {({ setActiveChannel, currentChannel }) =>
    <ListItem onClick={() => setActiveChannel(channelName)} selected={currentChannel == channelName}>
      <Avatar>
        {channelName}
      </Avatar>
      <ListItemText primary={channelName} secondary={message} />
    </ListItem>
    }
  </ChatContext.Consumer>
);

export default ChannelBox;
