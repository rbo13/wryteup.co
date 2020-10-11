import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// import {FullpageSpinner} from './components/FullpageSpinner';
// import PrimarySearchAppBar from './components/AppBar';
import {AuthenticatedApp} from './authenticated-app';
import {UnauthenticatedApp} from './unauthenticated-app';
import {useAuth} from './context/auth-context';

const useStyles = makeStyles((theme) => ({
  main: {
    marginBottom: theme.spacing(2),
  },
}));

// const AuthenticatedApp = React.lazy(() =>
//   import (/* webpackPrefetch: true*/ './authenticated-app'),
// );
// const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  const classes = useStyles();
  const {user} = useAuth();
  // const {authenticated} = React.useContext(GlobalContext);
  return (
    <Container
      component="main"
      className={classes.main}
      maxWidth="sm"
    >
      { user ? <AuthenticatedApp /> : <UnauthenticatedApp /> }
    </Container>
  );

  // return (
  //   <div>
  //     {/* <PrimarySearchAppBar /> */}
  //     <Container component="main" className={classes.main} maxWidth="sm">
  //       { user ? <AuthenticatedApp /> : <UnauthenticatedApp /> }

  //       {/* { authenticated ? */}
  //       {/*   <AuthenticatedApp /> : */}
  //       {/*   <UnauthenticatedApp /> */}
  //       {/* } */}
  //     </Container>
  //   </div>
  // );
}

export default App;
