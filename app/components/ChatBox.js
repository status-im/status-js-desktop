// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';

const ChatBox = ({ username, message }) => (
  <ListItem>
    <Avatar>
      <WorkIcon />
    </Avatar>
    <ListItemText primary={`${username}`} secondary={message} />
  </ListItem>
);

export default ChatBox;
