import React, { PureComponent } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import PersonIcon from '@material-ui/icons/PersonOutline';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import CheckCircle from '@material-ui/icons/CheckCircle';
import OfflineBolt from '@material-ui/icons/OfflineBolt';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import Tooltip from '@material-ui/core/Tooltip';
import { ChatContext } from '../context';

class Userlist extends PureComponent {

  state = {
    displayChannelStats: false
  }

  componentDidMount() {
    this.heartBeat();
  }

  componentWillUnmount() {
    clearInterval(this.heartBeatId);
  }

  handleClose = () => {
    this.setState({ displayChannelStats: false });
  }

  handleOpen = () => {
    this.setState({ displayChannelStats: true });
  }

  heartBeat() {
    this.heartBeatId = setInterval(() => { this.forceUpdate() }, 5000)
  }

  render() {
    const { displayChannelStats } = this.state;
    return (
      <ChatContext.Consumer>
        {({ channels, currentChannel }) => {
           const channelUsers = channels[currentChannel].users;
           const usersList = Object.keys(channelUsers);
           const currentTime = new Date().getTime();
           const userOffline = user => currentTime - user.lastSeen > 10*1000
           return (
             <div>
               <List>
                 {usersList.map(user => (
                   <ListItem button key={channelUsers[user].pubkey} style={{ display: 'flex', paddingLeft: '5px' }}>
                     <div style={{ display: 'flex' }}>
                       {userOffline(channelUsers[user]) ? <OfflineBolt style={{ color: 'red', margin: 'auto' }} /> : <CheckCircle style={{ color: 'green', margin: 'auto' }} />}
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
