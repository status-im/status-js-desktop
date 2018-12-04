import React, { PureComponent } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import FiberManualRecordOutlined from '@material-ui/icons/FiberManualRecordOutlined';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import green from '@material-ui/core/colors/green';
import Tooltip from '@material-ui/core/Tooltip';
import { ChatContext } from '../context';

const online = green['500'];
const offline = blueGrey['500'];
const scrolling = { height: '100vh', overflow: 'scroll' };

const sortUsers = (channelUsers, allUsers) => Object.keys(channelUsers).sort((x,y) => {
  const currentTime = (new Date().getTime());
  const xIsOnline = ((currentTime - allUsers[x].lastSeen) > 10*1000) ? 1 : -1;
  const yIsOnline = ((currentTime - allUsers[y].lastSeen) > 10*1000) ? 1 : -1;

  if (xIsOnline > yIsOnline) return 1;
  if (xIsOnline < yIsOnline) return -1;
  if (x.username < y.username) return -1;
  if (x.username > y.username) return 1;
  return 0;
});


class Userlist extends PureComponent {

  componentDidMount() {
    this.heartBeat();
  }

  componentWillUnmount() {
    clearInterval(this.heartBeatId);
  }

  heartBeat() {
    this.heartBeatId = setInterval(() => { this.forceUpdate() }, 5000)
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({ channels, currentChannel, users }) => {
           const channelUsers = channels[currentChannel].users;
           const usersList = sortUsers(channelUsers, users);
           const currentTime = new Date().getTime();
           const userOffline = user => currentTime - user.lastSeen > 10*1000
           return (
             <div style={scrolling}>
               <List style={scrolling}>
                 {usersList.map(user => (
                   <ListItem button key={channelUsers[user].pubkey} style={{ display: 'flex', paddingLeft: '5px' }}>
                     <div style={{ display: 'flex' }}>
                       {userOffline(channelUsers[user]) ? <FiberManualRecordOutlined style={{ color: offline, margin: 'auto' }} /> : <FiberManualRecord style={{ color: online, margin: 'auto' }} />}
                       <ListItemAvatar>
                         <Avatar>
                           <Jazzicon diameter={40} seed={jsNumberForAddress(channelUsers[user].pubkey)} />
                         </Avatar>
                       </ListItemAvatar>
                     </div>
                     <Tooltip title={`Last seen on ${new Date(channelUsers[user].lastSeen)}`} placement="top-start">
                       <ListItemText primary={channelUsers[user].username} />
                     </Tooltip>
                   </ListItem>
                 ))}
               </List>
             </div>
           )
        }
        }
      </ChatContext.Consumer>
    )
  }
}

export default Userlist;
