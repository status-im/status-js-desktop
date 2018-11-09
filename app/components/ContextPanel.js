import React, { Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import ChannelList from './ChannelList';
import ContextFilter from './ContextFilter';

const ContextPanel = ({ channels, joinChannel }) => (
  <Fragment>
    <ContextFilter joinChannel={joinChannel} />
    <Divider />
    <ChannelList channels={channels} />
  </Fragment>
);

export default ContextPanel;
