import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import { func } from 'prop-types';
import { isNull } from 'lodash';
import StatusJSLogo from '../images/statusjs-logo';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  height: '100vh',
  width: '50%'
};
const Login = ({ setupKeyringController, keyStore, wipeKeyStore, connect }) => (
  <Grid
    container
    justify="center"
    alignItems="center"
    direction="column"
    style={{ height: '100%' }}
  >
    <Formik
      initialValues={{ password: '', seed: '' }}
  onSubmit={(values, { resetForm, setFieldError }) => {
    const { password, seed } = values;
        setupKeyringController(password, seed)
          .catch(err => {
            setFieldError("password", err.message)
          });
        resetForm();
      }}
    >
      {({
         values,
         errors,
         handleChange,
         handleBlur,
         handleSubmit
      }) => (
        <form onSubmit={handleSubmit} style={containerStyle}>
          <StatusJSLogo />
          {isNull(keyStore) && <TextField
                                 id="seed"
                                 type="text"
                                 name="seed"
                                 rows="4"
                                 multiline
                                 label="Enter your 12 word mnemonic"
                                 variant="outlined"
                                 fullWidth
                                 value={values.seed}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
          />}
          <TextField
            id="password"
            type="password"
            name="password"
            label={isNull(keyStore) ? "Set your password" : "Enter your password to login"}
            variant="outlined"
            fullWidth
            error={errors.password}
            helperText={errors.password}
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <Button size="large" variant="outlined" color="primary" onClick={() => connect()}>
            USE A ONE TIME RANDOM ACCOUNT
          </Button>
          {!isNull(keyStore) && <Button size="large" variant="outlined" color="secondary" onClick={wipeKeyStore}>
            RESET ACCOUNT
          </Button>}
        </form>
      )}
    </Formik>
  </Grid>
);

Login.propTypes = {
  setupKeyringController: func.isRequired,
  wipeKeyStore: func.isRequired,
  connect: func.isRequired
};

export default Login;
