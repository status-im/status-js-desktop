// @flow
import React, { Fragment } from 'react';
import { Formik } from 'formik';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ChatBox from './ChatBox';


const listStyle = { overflow: 'scroll', height: '85%' };
const ChatRoom = ({ messages, sendMessage }) => (
  <div style={{ height: '100vh' }}>
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      style={{ height: '100%' }}
    >
      <List style={listStyle}>
        {messages.map((message, idx) => (
          <Fragment key={idx + message.message}>
            <ChatBox {...message} />
            <li>
              <Divider inset />
            </li>
          </Fragment>
        ))}
      </List>
      <Divider />
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
          <form onSubmit={handleSubmit}>
            <TextField
              id="chatInput"
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
