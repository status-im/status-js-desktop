// @flow
import React, { Fragment } from 'react';
import { Formik } from 'formik';
import autoscroll from 'autoscroll-react';
import Linkify from 'react-linkify';
import PersonIcon from '@material-ui/icons/PersonOutline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import ChatBox from './ChatBox';
import ChatHeader from './ChatHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import Badge from '@material-ui/core/Badge';

let AutoScrollList = autoscroll(List);

const formStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', flexBasis: '10%' };
const listStyle = { overflow: 'scroll', flexBasis: '76%' };
const ChatRoom = ({ messages, sendMessage, currentChannel, usersTyping, typingEvent, channelUsers, allUsers }) => (
  <div style={{ height: '100vh' }}>
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      style={{ height: '100%' }}
    >
      <Grid item>
        <ChatHeader currentChannel={currentChannel}/>
        <Divider />
      </Grid>
      <Grid container item>
        <Grid item xs={9}>
          <AutoScrollList style={listStyle}>
            {messages[currentChannel] && messages[currentChannel].map((message, idx) => (
              <Fragment key={idx + message.message}>
                <ChatBox {...message} />
                <li>
                  <Divider />
                </li>
              </Fragment>
            ))}
          </AutoScrollList>
          <Formik
            initialValues={{ chatInput: '' }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                const { chatInput } = values;
                sendMessage(chatInput);
                resetForm();
                setSubmitting(false);
            }}
          >
            {({
               values,
               errors,
               touched,
               handleChange,
               handleBlur,
               handleSubmit
            }) => (
              <div>
                <form onSubmit={handleSubmit} style={formStyle} >
                  <TextField
                    id="chatInput"
                    style={{ width: 'auto', flexGrow: '0.95', margin: '2px 0 0 0' }}
                    label="Type a message..."
                    type="text"
                    name="chatInput"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    onKeyDown={typingEvent}
                    onBlur={handleBlur}
                    value={values.chatInput || ''}
                  />
                  {errors.chatInput && touched.chatInput && errors.chatInput}
                </form>
                <div>{usersTyping}</div>
              </div>
            )}
          </Formik>
        </Grid>

        <Grid item xs={3}>
          <List>
            {Object.keys(channelUsers).map(user => (
              <ListItem button key={user}>
                <span class="dot" style={{"height": "10px", "width": "11px", "background-color": (allUsers[user].online ? "lightgreen" : "lightgrey"), "border-radius": "50%", "margin-right": "10px"}}></span>
                <ListItemAvatar>
                  <Avatar>
                    <Jazzicon diameter={40} seed={jsNumberForAddress(user)} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={allUsers[user].username} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default ChatRoom;
