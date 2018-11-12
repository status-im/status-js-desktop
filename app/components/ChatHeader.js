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
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { ChatContext } from '../context';

class ChatHeader extends PureComponent {

  state = {
    displayChannelStats: false
  }

  handleClose = () => {
    this.setState({ displayChannelStats: false });
  }

  handleOpen = () => {
    this.setState({ displayChannelStats: true });
  }

  render() {
    const { currentChannel } = this.props;
    const { displayChannelStats } = this.state;
    return (
      <ChatContext.Consumer>
        {({ channels }) =>
          <div>
            {channels[currentChannel].users && <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={displayChannelStats}>
              <DialogTitle>{`Users Online in #${currentChannel}`}</DialogTitle>
              <div>
                <List>
                  {Object.keys(channels[currentChannel].users).map(user => (
                    <ListItem button key={channels[currentChannel].users[user].pubkey}>
                      <ListItemAvatar>
                        <Avatar>
                          <Jazzicon diameter={40} seed={jsNumberForAddress(channels[currentChannel].users[user].pubkey)} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={channels[currentChannel].users[user].username} secondary={`Last seen on ${new Date(channels[currentChannel].users[user].lastSeen)}`}/>
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
                <PersonIcon style={{ color: grey[500] }} onClick={this.handleOpen}/><div style={{ color: grey[500] }}>{Object.keys(channels[currentChannel].users).length}</div>
              </div>
            </CardContent>
          </div>
        }
      </ChatContext.Consumer>
    )
  }
}

export default ChatHeader;
