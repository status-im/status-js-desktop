import React, { Fragment } from 'react';
import { Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

class ContextFilter extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    const { joinConversation, name } = this.props;
    return (
      <Fragment>
        <span onClick={this.handleClickOpen} style={{"color": "#CAC4C9", "cursor": "pointer"}}>
          <span style={{"width": "90%", "display": "inline-block", "verticalAlign": "top"}}>{name}</span>
          <span className="material-icons MuiIcon-root-4 Icons-icon-2" style={{"display": "inline-block", "position": "relative", "width": "21px"}} aria-hidden="true">add_circle2</span>
        </span>
        <Formik
          initialValues={{ channel: '' }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
              const { channel } = values;
              joinConversation(channel);
              resetForm();
              setSubmitting(false);
              this.handleClose();
          }}
        >
          {({
             values,
             errors,
             touched,
             handleChange,
             handleBlur,
             handleSubmit
          }) => (
            <Dialog
              open={open}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
              >
              <DialogTitle id="form-dialog-title">Join Conversation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Enter the Channel, Contact Code or Username you would like to join
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                  <TextField
                    autoFocus
                    id="channel"
                    name="channel"
                    variant="outlined"
                    margin="dense"
                    label="Channel"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.channel || ''}
                  />
                  {errors.channel && touched.channel && errors.channel}
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSubmit} color="primary">
                  Join
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Formik>
      </Fragment>
    );
  }
}

export default ContextFilter;
