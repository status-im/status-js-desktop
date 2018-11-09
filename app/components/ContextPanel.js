import React, { Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import ChannelList from './ChannelList';
import ContextFilter from './ContextFilter';


const borderStyle = { borderRight: '1px solid ghostwhite' };
const ContextPanel = ({ channels, joinChannel }) => (
  <div style={borderStyle}>
    <ContextFilter joinChannel={joinChannel} />
    <Divider />
    <ChannelList channels={channels} />
  </div>
);

export default ContextPanel;
