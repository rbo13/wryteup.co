import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const UnauthMenu = () => {
  const classes = useStyles();

  return (
    <div className={classes.sectionDesktop}>
      <Grid
        container
        direction="row"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link color="inherit" href="/login" style={{ textDecoration: 'none' }}>
              Login
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

const AuthMenu = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.sectionDesktop}>
      <IconButton aria-label="show 4 new mails" color="inherit">
        <Badge badgeContent={4} color="secondary">
          <MailIcon />
        </Badge>
      </IconButton>
      <IconButton aria-label="show 17 new notifications" color="inherit">
        <Badge badgeContent={17} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={props.menuId}
        aria-haspopup="true"
        onClick={props.handleProfileMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    </div>
  );
};

const AuthMobileMenu = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.sectionMobile}>
      <IconButton
        aria-label="show more"
        aria-controls={props.mobileMenuId}
        aria-haspopup="true"
        onClick={props.handleMobileMenuOpen}
        color="inherit"
      >
        <MoreIcon />
      </IconButton>
    </div>
  );
};

export {
  AuthMenu,
  AuthMobileMenu,
  UnauthMenu,
};
