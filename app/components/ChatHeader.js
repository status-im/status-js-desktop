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
import Info from '@material-ui/icons/Info';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { ChatContext } from '../context';

class ChatHeader extends PureComponent {

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
    const { currentChannel, toggleSidebar } = this.props;
    const { displayChannelStats } = this.state;
    return (
      <ChatContext.Consumer>
      {({ channels }) => {
        const channelUsers = channels[currentChannel].users;
        const usersList = Object.keys(channelUsers);
        const currentTime = new Date().getTime();
        const userOffline = user => currentTime - user.lastSeen > 10*1000
        return (
          <div>
            {channels[currentChannel].users && <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={displayChannelStats}>
              <DialogTitle>{`Users Online in #${currentChannel}`}</DialogTitle>
              <div>
                <List>
                  {usersList.map(user => (
                    <ListItem button key={channelUsers[user].pubkey}>
                      {userOffline(channelUsers[user]) ? <OfflineBolt style={{ color: 'red' }} /> : <CheckCircle style={{ color: 'green' }} />}
                      <ListItemAvatar>
                        <Avatar>
                          <Jazzicon diameter={40} seed={jsNumberForAddress(channelUsers[user].pubkey)} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={channelUsers[user].username} secondary={`Last seen on ${new Date(channelUsers[user].lastSeen)}`}/>
                    </ListItem>
                  ))}
                </List>
              </div>
            </Dialog>}
            <CardContent style={{ flexBasis: '10%', paddingBottom: '0px' }}>
              <Typography variant="h5" component="h2">
                {channels[currentChannel].username ? `${channels[currentChannel].username}` : `#${currentChannel}`}
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon style={{ color: grey[500] }} onClick={this.handleOpen}/><div style={{ color: grey[500] }}>{usersList.length}</div>
                <span style={{ marginLeft: 'auto' }}>
                  <Info style={{ color: grey[500] }} onClick={toggleSidebar} />
                </span>
              </div>
            </CardContent>
          </div>
        )
      }
      }
      </ChatContext.Consumer>
    )
  }
}

export default ChatHeader;
