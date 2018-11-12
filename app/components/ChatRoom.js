// @flow
import React, { Fragment, PureComponent } from 'react';
import { Formik } from 'formik';
import autoscroll from 'autoscroll-react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ChatBox from './ChatBox';
import ChatHeader from './ChatHeader';

class WhoIsTyping extends PureComponent {

  whoIsTyping() {
    const { users, usersTyping, currentChannel } = this.props;
    const currentTime = new Date().getTime();

    const typingInChannel = usersTyping[currentChannel];
    const typingUsers = [];
    for (let pubkey in typingInChannel) {
      const lastTyped = typingInChannel[pubkey];
      if (!users[pubkey]) continue;
      if (currentTime - lastTyped > 3*1000 || currentTime < lastTyped) continue;
      typingUsers.push(users[pubkey].username)
    }
    return typingUsers;
  }

  render() {
    const userList = this.whoIsTyping();
    return (
      <div>
        {!userList.length ? "" : userList.join(',' ) + " is typing"}
      </div>
    )
  }
}


const AutoScrollList = autoscroll(List);
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
      <ChatHeader currentChannel={currentChannel}/>
      <Divider />
      <AutoScrollList style={listStyle}>
        {messages[currentChannel] && messages[currentChannel].map((message) => (
          <Fragment key={message.data.payload}>
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
            <WhoIsTyping
              currentChannel={currentChannel}
              usersTyping={usersTyping}
              users={allUsers} />
          </div>
        )}
      </Formik>
    </Grid>
  </div>
);

export default ChatRoom;
