// @flow
import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleSharp';
import YouTube from 'react-youtube';

// TODO: not exactly bulletproof right now, needs proper regex
function hasYoutubeLink(text) {
  return text.indexOf('http://www.youtube.com') >= 0 || text.indexOf('https://www.youtube.com') >= 0;
}

// https://gist.github.com/takien/4077195#
function getYoutubeId(url) {
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
  return ID;
}

const ChatBox = ({ username, message }) => (
  <Fragment>
    <ListItem>
      <Avatar>
        <ChatBubbleOutline />
      </Avatar>
      <ListItemText primary={`${username}`} secondary={message} />
    </ListItem>
    {hasYoutubeLink(message) &&
      <ListItem>
          <YouTube
           videoId={getYoutubeId(message)}
           opts={{height: '390', width: '640', playerVars: { autoplay: 0 }}}
          />
      </ListItem>
    }
  </Fragment>
);

export default ChatBox;
