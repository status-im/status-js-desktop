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
        {({ users }) =>
          <div>
            {users && <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={displayChannelStats}>
              <DialogTitle>{`Users Online in #${currentChannel}`}</DialogTitle>
              <div>
                <List>
                  {Object.keys(users).map(user => (
                     <ListItem button key={users[user].pubkey}>
                       <ListItemAvatar>
                         <Avatar>
                           <PersonIcon />
                         </Avatar>
                       </ListItemAvatar>
                       <ListItemText primary={users[user].username} secondary={`Last seen on ${new Date(users[user].lastSeen)}`}/>
                     </ListItem>
                  ))}
                </List>
              </div>
            </Dialog>}
            <CardContent style={{ flexBasis: '10%', paddingBottom: '0px' }}>
              <Typography variant="h5" component="h2">
                {`#${currentChannel}`}
              </Typography>
              <PersonIcon style={{ color: grey[500] }} onClick={this.handleOpen} />
            </CardContent>
          </div>
        }
      </ChatContext.Consumer>
    )
  }
}

export default ChatHeader;
