import React, { Fragment } from 'react';
import ChannelList from './ChannelList';

const ContextPanel = ({ channels }) => (
  <Fragment>
    <ChannelList channels={channels} />
  </Fragment>
);

export default ContextPanel;
