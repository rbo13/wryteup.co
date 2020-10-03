import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PrimarySearchAppBar from './components/AppBar';
import {Footer} from './components/Footer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PrimarySearchAppBar />
      <Container component="main" className={classes.main} maxWidth="sm">
        {/* TODO:: set up app routes here */}
      </Container>
      <Footer />
    </div>
  );
}

export default App;
