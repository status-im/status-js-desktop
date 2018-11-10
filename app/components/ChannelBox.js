// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { ChatContext } from '../context';

const ChannelBox = ({ channelName, message }) => (
  <ChatContext.Consumer>
    {({ setActiveChannel, currentChannel }) =>
    <ListItem onClick={() => setActiveChannel(channelName)} selected={currentChannel == channelName} style={{"cursor": "pointer", "padding": "0px 2px"}}>
      <ListItemText primary={<span style={{"color": "white"}}><span style={{"padding-right": "5px", "color": "grey"}}>#</span>{channelName}</span>} secondary={message}  />
    </ListItem>
    }
  </ChatContext.Consumer>
);

export default ChannelBox;
