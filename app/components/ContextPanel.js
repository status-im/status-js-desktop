import React, { Fragment } from 'react';
import ChannelList from './ChannelList';
import ContextFilter from './ContextFilter';
import styles from './ContextPanel.css';

const ContextPanel = ({ channels, joinConversation }) => (
  <div className={styles.sidebar} style={{"backgroundColor": "#4d394b", "height": "100%", "padding": "16px", borderRight: '1px solid ghostwhite'}} >
    <h3 style={{"marginTop": "0px", "color": "white"}}>Status</h3>
    <ContextFilter name="Channels" joinConversation={joinConversation} />
    <ChannelList channels={channels} />
  </div>
);

export default ContextPanel;
