import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Formik } from 'formik';

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: '0 30% 0 30%' };
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
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const { password } = values;
        setupKeyringController(password)
        resetForm();
        setSubmitting(false);
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

export default Login;
