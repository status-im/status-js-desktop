// @flow
import React, { Fragment } from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChannelBox from './ChannelBox';

const ChannelList = ({ channels }) => (
  <List>
    {Object.keys(channels).map((channel) => (
      <Fragment key={channel}>
        <ChannelBox channelName={channel} />
        <li>
          <Divider />
        </li>
      </Fragment>
    ))}
  </List>
)

export default ChannelList;
