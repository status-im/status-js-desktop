import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Formik } from 'formik';
import { func } from 'prop-types';

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '50%' };
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
        setupKeyringController(password)
        resetForm();
      }}
    >
      {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
      }) => (
        <form onSubmit={handleSubmit} style={containerStyle}>
          <TextField
            id="password"
            type="password"
            name="password"
            label="Enter your password"
            variant="outlined"
            fullWidth
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.password && touched.password && errors.password}
        </form>
      )}
    </Formik>
  </Grid>
)

Login.propTypes = {
  setupKeyringController: func.isRequired
}

export default Login;
