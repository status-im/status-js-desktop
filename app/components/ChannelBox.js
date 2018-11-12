// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ChatContext } from '../context';

const ChannelBox = ({ channelName, message }) => (
  <ChatContext.Consumer>
    {({ setActiveChannel, currentChannel, channels }) =>
      <ListItem onClick={() => setActiveChannel(channelName)} selected={currentChannel == channelName} style={{"cursor": "pointer", "padding": "0px 2px"}}>
        <ListItemText primary={
          <span style={{"color": "white"}}>
            {channels[channelName].username ? `${channels[channelName].username}` : `#${channelName}`}
          </span>
        } secondary={message}  />
      </ListItem>
    }
  </ChatContext.Consumer>
);

export default ChannelBox;
