import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import { func } from 'prop-types';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  height: '100vh',
  width: '50%'
};
const Login = ({ setupKeyringController }) => (
  <Grid
    container
    justify="center"
    alignItems="center"
    direction="column"
    style={{ height: '100%' }}
  >
    <Formik
      initialValues={{ password: '' }}
      onSubmit={(values, { resetForm }) => {
        const { password } = values;
        setupKeyringController(password);
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
          <TextField
            id="password"
            type="password"
            name="password"
            label="Enter your password to login"
            variant="outlined"
            fullWidth
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.password && touched.password && errors.password}
          <Button size="large" variant="outlined" color="secondary">
            RESET ACCOUNT
          </Button>
        </form>
      )}
    </Formik>
  </Grid>
);

Login.propTypes = {
  setupKeyringController: func.isRequired
};

export default Login;
