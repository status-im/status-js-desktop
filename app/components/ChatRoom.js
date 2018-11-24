// @flow
import React, { Fragment, Component, PureComponent, createRef } from 'react';
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
import Button from '@material-ui/core/Button';
import Dropzone from 'react-dropzone';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Picker } from 'emoji-mart';
import InsertEmoticon from '@material-ui/icons/InsertEmoticon'
import AddCircle from '@material-ui/icons/AddCircle'

import ChatBox, { Emoji } from './ChatBox';
import ChatHeader from './ChatHeader';
import Userlist from './Userlist';
import { uploadFileAndSend } from '../utils/ipfs';

import 'emoji-mart/css/emoji-mart.css';

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
class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmojis: false
    };
  }

  toggleEmojis(e) {
    e.preventDefault();
    this.setState(({showEmojis: !this.state.showEmojis}));
  }

  uploadFileDialog() {
   this.fileInput.click();
  }

  fileChangedHandler(event) {
    const file = event.target.files[0];
    console.dir("handling file upload");
    uploadFileAndSend(this.ipfs, file, this.sendMessage);
  }

  addEmoji(emoji, chatInput, setValue) {
    console.log(emoji);
    setValue('chatInput', `${chatInput}:${emoji.id}:`);
    this.setState(({showEmojis: false}), () => {
      this.nameInput.labelNode.focus();
    });
    // <Emoji emoji=":santa::skin-tone-3:" size={16} />
  }

  render() {
    const { messages, sendMessage, currentChannel, usersTyping, typingEvent, channelUsers, allUsers, ipfs } = this.props;
    this.sendMessage = sendMessage;
    this.ipfs = ipfs;

    const sortedUsers = Object.keys(channelUsers).sort((x,y) => {
      let currentTime = (new Date().getTime());
      let x_is_online = ((currentTime - allUsers[x].lastSeen) > 10*1000) ? 1 : -1;
      let y_is_online = ((currentTime - allUsers[y].lastSeen) > 10*1000) ? 1 : -1;

      let diff = x_is_online - y_is_online;
      if (diff != 0) { return diff }
      if (x.username < y.username) { return -1 }
      if (x.username > y.username) { return 1 }
      return 0;
    })

    const {showEmojis} = this.state;
    return (
      <div style={{ width: '100%', flexWrap: 'nowrap', display: 'flex', boxSizing: 'border-box' }} >
        <input
          type="file"
          ref={(input) => { this.fileInput = input; }}
          onChange={this.fileChangedHandler.bind(this)}
          style={{display: 'none'}}
        />
        <Grid xs={12} item>
          <Dropzone
            onDrop={(a, r) => {
              onDrop(a, r, ipfs, sendMessage);
            }}
            disableClick
            style={{ position: 'relative', height: '100%' }}
            activeStyle={{
              backgroundColor: 'grey',
              outline: '5px dashed lightgrey',
              alignSelf: 'center',
              outlineOffset: '-10px'
            }}>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="stretch"
              style={{ height: '100%' }}
            >
              <ChatHeader currentChannel={currentChannel}/>
              <Divider/>
              <Grid container wrap="nowrap">
                <Grid xs={9} item style={{ overflowY: 'scroll' }}>
                  <AutoScrollList style={{ height: '75vh', overflow: 'scroll' }}>
                    {messages[currentChannel] && messages[currentChannel].map((message) => (
                      <Fragment key={message.data.payload}>
                        <ChatBox {...message} ipfs={ipfs}/>
                        <li>
                          <Divider/>
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
                      <div className="chat-input">
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
                          {showEmojis && <Picker onSelect={(emoji) => this.addEmoji(emoji, values.chatInput, setFieldValue)}
                                           style={{ position: 'absolute', bottom: '80px', right: '20px' }}/>}
                          <Button onClick={(e) => this.toggleEmojis(e)}>Smile</Button>
                          {errors.chatInput && touched.chatInput && errors.chatInput}
                        </form>
                        <WhoIsTyping
                          currentChannel={currentChannel}
                          usersTyping={usersTyping}
                          users={allUsers}/>
                      </div>
                    )}
                  </Formik>
                </Grid>
                <Grid xs={3} item style={{ overflow: 'auto', borderLeftStyle: 'groove', minHeight: '100vh' }}><Userlist /></Grid>
              </Grid>
            </Grid>
          </Dropzone>
        </Grid>
        {false && <Grid xs={4} item style={{ overflow: 'auto' }}>
<List>
              {sortedUsers.map(user => (
                <ListItem button key={user}>
                  <span className="dot" style={{
                    'height': '10px',
                    'width': '11px',
                    'background-color': (((new Date().getTime()) - allUsers[user].lastSeen) > 10*1000 ? 'lightgrey' : 'lightgreen'),
                    'border-radius': '50%',
                    'margin-right': '10px'
                  }}/>
                  <ListItemAvatar>
                    <Avatar>
                      <Jazzicon diameter={40} seed={jsNumberForAddress(user)}/>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={allUsers[user].username}/>
                </ListItem>
              ))}
            </List>
          </Grid>}
      </div>
    )
  }
}

export default ChatRoom;
