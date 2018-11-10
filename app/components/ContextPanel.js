import React, { Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import ChannelList from './ChannelList';
import ContextFilter from './ContextFilter';
import styles from './ContextPanel.css';

const ContextPanel = ({ channels, joinChannel }) => (
  <div className={styles.sidebar} style={{"background-color": "#4d394b", "height": "100%", "padding": "16px"}} >
    <h3 style={{"margin-top": "0px", "color": "white"}}>Status</h3>
    <ContextFilter name="Channels" joinChannel={joinChannel} />
    <Divider />
    <ChannelList channels={channels} />
  </div>
);

export default ContextPanel;
