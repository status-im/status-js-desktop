// @flow
import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import YouTube from 'react-youtube';
import Linkify from 'react-linkify';
import SpotifyPlayer from 'react-spotify-player';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/styles/prism';

// TODO: not exactly bulletproof right now, needs proper regex
function hasYoutubeLink(text) {
  return text.indexOf('http://www.youtube.com') >= 0 || text.indexOf('https://www.youtube.com') >= 0;
}

// TODO: not exactly bulletproof right now, needs proper regex
function isSpotifyLink(text) {
  return text.indexOf('spotify:') >= 0 ;
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

//TODO use regex for code parsing / detection. Add new line detection for shift+enter
const MessageRender = ({ message }) => (
  message[0] === "`" ? <SyntaxHighlighter language='javascript' style={atomDark}>{message.slice(1)}</SyntaxHighlighter> : <Linkify>{message}</Linkify>
)
const ChatBox = ({ username, message, pubkey }) => (
  <Fragment>
    <ListItem>
      <Avatar>
        <ListItemAvatar>
          <Avatar>
            {pubkey && <Jazzicon diameter={40} seed={jsNumberForAddress(pubkey)} />}
          </Avatar>
        </ListItemAvatar>
      </Avatar>
      <ListItemText primary={`${username}`} secondary={<MessageRender message={message} />} />
    </ListItem>
    {hasYoutubeLink(message) &&
     <ListItem>
       <YouTube
         videoId={getYoutubeId(message)}
         opts={{height: '390', width: '640', playerVars: { autoplay: 0 }}}
       />
     </ListItem>
    }
    {isSpotifyLink(message) &&
     <ListItem>
       <SpotifyPlayer
         uri={message}
         size={{'width': 300, 'height': 300}}
         view='list'
         theme='black'
       />
     </ListItem>
    }
  </Fragment>
);

export default ChatBox;
