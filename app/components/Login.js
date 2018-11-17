import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import { func } from 'prop-types';
import { isNull } from 'lodash';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  height: '100vh',
  width: '50%'
};
const Login = ({ setupKeyringController, keyStore, wipeKeyStore }) => (
  <Grid
    container
    justify="center"
    alignItems="center"
    direction="column"
    style={{ height: '100%' }}
  >
    <Formik
      initialValues={{ password: '', seed: '' }}
      onSubmit={(values, { resetForm }) => {
        const { password, seed } = values;
        setupKeyringController(password, seed);
        resetForm();
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
        <form onSubmit={handleSubmit} style={containerStyle}>
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
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.password && touched.password && errors.password}
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
  wipeKeyStore: func.isRequired
};

export default Login;
