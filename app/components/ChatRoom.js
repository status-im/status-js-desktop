// @flow
import React, { Fragment } from 'react';
import { Formik } from 'formik';
import autoscroll from 'autoscroll-react';
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

let AutoScrollList = autoscroll(List);

const formStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', flexBasis: '10%' };
const listStyle = { overflow: 'scroll', flexBasis: '76%' };
const ChatRoom = ({ messages, sendMessage, currentChannel, usersTyping, typingEvent }) => (
  <div style={{ height: '100vh' }}>
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      style={{ height: '100%' }}
    >
      <ChatHeader currentChannel={currentChannel}/>
      <Divider />
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
  </div>
);

export default ChatRoom;
