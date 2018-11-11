import React, { Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import ChannelList from './ChannelList';
import ContextFilter from './ContextFilter';
import styles from './ContextPanel.css';

const borderStyle = {  };
const ContextPanel = ({ channels, joinChannel }) => (
  <div className={styles.sidebar} style={{"backgroundColor": "#4d394b", "height": "100%", "padding": "16px", borderRight: '1px solid ghostwhite'}} >
    <h3 style={{"marginTop": "0px", "color": "white"}}>Status</h3>
    <ContextFilter name="Channels" joinChannel={joinChannel} />
    <ChannelList channels={channels} />
  </div>
);

export default ContextPanel;
