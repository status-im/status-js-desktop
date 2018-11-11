// @flow
import React, { Fragment } from 'react';
import List from '@material-ui/core/List';
import ChannelBox from './ChannelBox';
import { isContactCode } from '../utils/parsers';


const ChannelBoxes = ({ channels }) => (
  <div style={{ marginBottom: '50%' }}>
    {channels.map((channel) => (
      <Fragment key={channel}>
        <ChannelBox channelName={channel} />
      </Fragment>
    ))}
  </div>

)
const ChannelList = ({ channels }) => {
  const channelList = Object.keys(channels)
  const onlyChannels = channelList.filter((i) => !isContactCode(i));
  const directMessages = channelList.filter(isContactCode);

  return (
    <List>
      <ChannelBoxes channels={onlyChannels} />
      <span style={{ color: 'lightgray' }}>Direct Messages</span>
      <ChannelBoxes channels={directMessages} />
    </List>
  )
}

export default ChannelList;
