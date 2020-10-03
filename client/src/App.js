import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PrimarySearchAppBar from './components/AppBar';
import {AuthenticatedApp} from './authenticated-app';
import {UnauthenticatedApp} from './unauthenticated-app';
import {GlobalContext} from './context';

const useStyles = makeStyles((theme) => ({
  main: {
    marginBottom: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const {authenticated} = React.useContext(GlobalContext);

  return (
    <div>
      <PrimarySearchAppBar />
      <Container component="main" className={classes.main} maxWidth="sm">
        {/* TODO:: set up app routes here */}
        { authenticated ?
          <AuthenticatedApp /> :
          <UnauthenticatedApp />
        }
      </Container>
    </div>
  );
}

export default App;
