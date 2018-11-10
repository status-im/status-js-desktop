// @flow
import React, { Fragment } from 'react';
import { Formik } from 'formik';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ChatBox from './ChatBox';


const formStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center' };
const listStyle = { overflow: 'scroll', height: '78%' };
const ChatRoom = ({ messages, sendMessage, currentChannel }) => (
  <div style={{ height: '100vh' }}>
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      style={{ height: '100%' }}
    >
      <div>
        <CardContent>
          <Typography variant="h5" component="h2">
            {`#${currentChannel}`}
          </Typography>
        </CardContent>
      </div>
      <Divider />
      <List style={listStyle}>
        {messages[currentChannel] && messages[currentChannel].map((message, idx) => (
          <Fragment key={idx + message.message}>
            <ChatBox {...message} />
            <li>
              <Divider />
            </li>
          </Fragment>
        ))}
      </List>
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
              onBlur={handleBlur}
              value={values.chatInput || ''}
            />
            {errors.chatInput && touched.chatInput && errors.chatInput}
          </form>
        )}
      </Formik>
    </Grid>
  </div>
);

export default ChatRoom;
