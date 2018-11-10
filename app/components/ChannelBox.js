// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const ChannelBox = ({ channelName, message }) => (
  <ListItem style={{"cursor": "pointer", "padding": "0px 2px"}}>
    <ListItemText primary={<span style={{"color": "white"}}><span style={{"padding-right": "5px"}}>#</span>{channelName}</span>} secondary={message}  />
  </ListItem>
);

export default ChannelBox;
