import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';

import {ProfileDetail} from '../screens/ProfileDetail';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Profile = () => {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
    >
      <Container
        maxWidth="lg"
      >
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={12}
            md={12}
            xs={12}
          >
            <ProfileDetail />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};


export {Profile};
