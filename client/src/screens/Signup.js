import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useForm} from 'react-hook-form';
// import {signup} from '../services/api_request';
import {useAuth} from '../context/auth-context';
import {useAsync} from '../utils/hooks';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        wryteup
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const navigate = useNavigate();
  const {isLoading, isError, error, run} = useAsync();
  const {signup} = useAuth();
  const {register, handleSubmit, errors, watch} = useForm();
  const password = React.useRef({});
  password.current = watch('password', '');

  const [openAlert, setOpenAlert] = React.useState({
    open: false,
    success: false,
    message: '',
  });

  const {open, success, message} = openAlert;
  const userSignup = (form) => {
    const {email, password} = form;
    run(signup({
      email,
      password,
    }));
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(userSignup)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={errors.email ? true : false}
                inputRef={register({
                  required: 'Email Address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                helperText={
                  errors.email ? errors.email.message : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={errors.password ? true : false}
                inputRef={register({
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must have at least 8 characters',
                  },
                })}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={
                  errors.password ? errors.password.message : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={errors.confirmPassword ? true : false}
                inputRef={register({
                  required: 'Confirm Password is required',
                  minLength: {
                    value: 8,
                    message: 'Confirm Password must have at least 8 characters',
                  },
                  validate: (value) => {
                    return value === password.current ||
                      'The passwords do not match';
                  },
                })}
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                helperText={
                  errors.confirmPassword ? errors.confirmPassword.message : null
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isLoading ? 'Signing up' : 'Signup'}
          </Button>
          {isError ? error : null }
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={() => {
          setOpenAlert({
            open: false,
            success: success,
          });
        }}
      >
        <Alert onClose={() => {
          setOpenAlert({
            open: false,
            success: success,
          });
        }} severity={success ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
