// @flow
import React, { Fragment, PureComponent, createRef } from 'react';
import { Formik } from 'formik';
import autoscroll from 'autoscroll-react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dropzone from 'react-dropzone';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import ChatBox from './ChatBox';
import ChatHeader from './ChatHeader';
import { uploadFileAndSend } from '../utils/ipfs';


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
        {!userList.length ? "" : `${userList.join(',')} is typing`}
      </div>
    )
  }
}

function onDrop(acceptedFiles, rejectedFiles, ipfs, sendMessage) {
  const file = acceptedFiles[0];
  uploadFileAndSend(ipfs, file, sendMessage);
}

const keyDownHandler = (e, typingEvent, setValue, value) => {
  if(e.shiftKey && e.keyCode === 13) {
	  e.preventDefault();
    const cursor = e.target.selectionStart;
    const newValue = `${value.slice(0, cursor)}\n${value.slice(cursor)}`;
    setValue('chatInput', newValue);
  }
  else if (e.keyCode === 13) {
    e.preventDefault();
    const form = ChatRoomForm.current;
    form.dispatchEvent(new Event("submit"));
  }
  typingEvent(e)
};

const AutoScrollList = autoscroll(List);
const formStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', flexBasis: '10%' };
const listStyle = { overflowY: 'auto', flexBasis: '76%', position: 'absolute', top: '72px', left: 0, right: 0, bottom: '67px' };
const ChatRoomForm = createRef();
const ChatRoom = ({ messages, sendMessage, currentChannel, usersTyping, typingEvent, channelUsers, allUsers, ipfs }) => (
  <Grid container style={{ height: '100vh'}}>
    <Grid xs={8} item >
      <Dropzone
        onDrop={(a, r) => { onDrop(a,r,ipfs,sendMessage) } }
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
                <ChatBox {...message} ipfs={ipfs} />
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
              <div className="chat-input" style={{position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 10}}>
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
    </Grid>
    <Grid xs={4} item style={{overflow: 'auto'}}>
      <List>
        {Object.keys(channelUsers).map(user => (
          <ListItem button key={user}>
            <span className="dot" style={{"height": "10px", "width": "11px", "background-color": (allUsers[user].online ? "lightgreen" : "lightgrey"), "border-radius": "50%", "margin-right": "10px"}}/>
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
);

export default ChatRoom;
