// @flow
import React, { Fragment, PureComponent, createRef } from 'react';
import { Formik } from 'formik';
import autoscroll from 'autoscroll-react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dropzone from 'react-dropzone';
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

function onDrop(acceptedFiles, rejectedFiles) {
  console.log({acceptedFiles});
}

const keyDownHandler = (e, typingEvent, setValue, value) => {
  if(e.shiftKey && e.keyCode === 13) {
	  e.preventDefault()
    const cursor = e.target.selectionStart
    const newValue = `${value.slice(0, cursor)}\n${value.slice(cursor)}`;
    setValue('chatInput', newValue);
  }
  else if (e.keyCode === 13) {
    e.preventDefault();
    const form = ChatRoomForm.current;
    form.dispatchEvent(new Event("submit"));
  }
  typingEvent(e)
}

const AutoScrollList = autoscroll(List);
const formStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', flexBasis: '10%' };
const listStyle = { overflow: 'scroll', flexBasis: '76%' };
const ChatRoomForm = createRef();
const ChatRoom = ({ messages, sendMessage, currentChannel, usersTyping, typingEvent, channelUsers, allUsers }) => (
  <div style={{ height: '100vh' }}>
    <Dropzone
      onDrop={onDrop}
      disableClick
      style={{ position: 'relative', height: '100%' }}
      activeStyle={{ backgroundColor: 'grey', outline: '5px dashed lightgrey', alignSelf: 'center', outlineOffset: '-10px' }}>
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
             handleSubmit,
             setFieldValue
          }) => (
            <div>
              <form onSubmit={handleSubmit} style={formStyle} ref={ChatRoomForm}>
                <TextField
                  id="chatInput"
                  multiline
                  style={{ width: 'auto', flexGrow: '0.95', margin: '2px 0 0 0' }}
                  label="Type a message..."
                  type="text"
                  name="chatInput"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  onKeyDown={(e) => keyDownHandler(e, typingEvent, setFieldValue, values.chatInput)}
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
    </Dropzone>
  </div>
);

export default ChatRoom;
