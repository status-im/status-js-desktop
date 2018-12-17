// @flow
import React, { Fragment, PureComponent } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import YouTube from 'react-youtube';
import Linkify from 'react-linkify';
import SpotifyPlayer from 'react-spotify-player';
import { Emoji } from 'emoji-mart';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/styles/prism';
import { Matcher } from '@areknawo/rex'
import SyntaxLookup from '../utils/syntaxLookup';
import { getFile } from '../utils/ipfs';

const ipfsMatcher = new Matcher().begin().find('/ipfs/');

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
  let ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
  return ID;
}

function isImage(text) {
  return text.indexOf("http") >= 0 && (text.indexOf('.jpg') || text.indexOf('.gif'));
}

// TODO: this needs to be reviewed. best to return as a css background-image instead
function displayImage(text) {

  let reg = new RegExp(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/);
  let imageUrl = reg.exec(text);
  if (!imageUrl) return (<span></span>);
  return (<img src={imageUrl[0]} style={{maxWidth: '90%'}} />)
}

// TODO use regex for code parsing / detection. Add new line detection for shift+enter
const MessageRender = ({ message }) => {
  const emojis = [];
  let match;
  const regex1 = RegExp(/:[\-a-zA-Z_+0-9]+:/g);
  while ((match = regex1.exec(message)) !== null) {
    emojis.push(<Emoji emoji={match[0]} size={16} />);
  }

  const parts = message.split(regex1);
  parts.forEach((part, i) => {
    parts[i] = <span className="match" key={i}>{part}{emojis[i]}</span>;
  });

  return (message[2] === "`" && SyntaxLookup[message.slice(0,2)]
    ? <SyntaxHighlighter language={SyntaxLookup[message.slice(0,2)]} style={atomDark}>{message.slice(3)}</SyntaxHighlighter>
    : <Linkify><span style={{ wordWrap: 'break-word', whiteSpace: 'pre-line' }}>{parts}</span></Linkify>)
};

class ChatBox extends PureComponent {

  state = {
    imgUrl: null
  };

  componentDidMount() {
    const { message } = this.props;
    if (ipfsMatcher.test(message)) this.getImageFromIpfs();
  }

  getImageFromIpfs = async () => {
    const { ipfs, message } = this.props;
    const files = await getFile(ipfs, message);
    const { content } = files[0];
    const arrayBufferView = new Uint8Array(content);
    const blob = new Blob([ arrayBufferView ], { type: "image/jpeg" });
    const imgUrl = URL.createObjectURL(blob);
    this.setState({ imgUrl });
  };

  render() {
    const { username, message, pubkey } = this.props;
    const { imgUrl } = this.state;
    return (
      <Fragment>
        <ListItem>
          <Avatar>
            <ListItemAvatar>
              <Avatar>
                {pubkey && <Jazzicon diameter={40} seed={jsNumberForAddress(pubkey)}/>}
              </Avatar>
            </ListItemAvatar>
          </Avatar>
          <ListItemText primary={`${username}`} secondary={<MessageRender message={message}/>}/>
        </ListItem>
        {hasYoutubeLink(message) &&
        <ListItem>
          <YouTube
            videoId={getYoutubeId(message)}
            opts={{ height: '390', width: '640', playerVars: { autoplay: 0 } }}
          />
        </ListItem>
        }
        {isSpotifyLink(message) &&
        <ListItem>
          <SpotifyPlayer
            uri={message}
            size={{ 'width': 300, 'height': 300 }}
            view='list'
            theme='black'
          />
        </ListItem>
        }
        {!!imgUrl && <img src={imgUrl} alt='ipfs' style={{maxWidth: '90%'}} />}
        {isImage(message) && displayImage(message)}
      </Fragment>
    );
  };
}

export default ChatBox;
