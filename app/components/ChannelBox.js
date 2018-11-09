// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const ChannelBox = ({ channelName, message }) => (
  <ListItem>
    <Avatar>
      {channelName}
    </Avatar>
    <ListItemText primary={channelName} secondary={message} />
  </ListItem>
);

export default ChannelBox;
