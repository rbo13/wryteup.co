import React from 'react';
import {useForm} from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  makeStyles,
} from '@material-ui/core';
import {useAuth} from '../context/auth-context';
import {profile} from '../utils/api-client';
import * as auth from '../auth-provider';

const useStyles = makeStyles(() => ({
  root: {},
}));

const ProfileDetail = () => {
  const classes = useStyles();
  const {register, handleSubmit, errors} = useForm();
  const [isProfileSetup, setIsProfileSetup] = React.useState(false);
  const {user} = useAuth();

  React.useEffect(() => {
    if (user !== undefined) {
      if (user.first_name !== undefined || user.last_name !== undefined) {
        if (user.first_name !== '' || user.last_name !== '') {
          setIsProfileSetup(true);
        }
      }
    }

    if (user.user !== undefined) {
      if (user.user.first_name !== '' || user.user.last_name !== '') {
        setIsProfileSetup(true);
      }
    }
  }, []);

  const updateDetails = async (form) => {
    const token = await auth.getToken();
    const {firstName, lastName, birthdate} = form;
    await profile({
      authToken: token,
      payload: {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthdate,
      },
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={classes.root}
      onSubmit={handleSubmit(updateDetails)}
    >
      <Card>
        <CardHeader
          subheader="You can only add your information once."
          title="Account"
        />
        <Divider />

        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                required
                error={errors.firstName ? true : false}
                inputRef={register({
                  required: 'First name is required',
                })}
                fullWidth
                helperText={
                  errors.firstName ? errors.firstName.message :
                    'Please add your first name.'
                }
                value={isProfileSetup ? user.first_name : undefined}
                disabled={isProfileSetup ? isProfileSetup : false}
                label="First name"
                id="firstName"
                name="firstName"
                variant="outlined"
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                required
                fullWidth
                error={errors.lastName ? true : false}
                inputRef={register({
                  required: 'Last name is required',
                })}
                helperText={
                  errors.lastName ? errors.lastName.message :
                    'Please add your last name.'
                }
                value={isProfileSetup ? user.last_name : undefined}
                disabled={isProfileSetup ? isProfileSetup : false}
                label="Last name"
                id="lastName"
                name="lastName"
                variant="outlined"
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                error={errors.birthdate ? true : false}
                inputRef={register({
                  required: 'Your birthday is required',
                })}
                helperText={
                  errors.birthdate ? errors.birthdate.message :
                  'Please add your birthday.'
                }
                defaultValue={
                  isProfileSetup ?
                    new Date(user.birth_date).toISOString().slice(0, 10) :
                    undefined
                }
                label="Birthday"
                type="date"
                id="birthdate"
                name="birthdate"
                disabled={
                  isProfileSetup ? true : false
                }
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-start"
          p={2}
        >
          {isProfileSetup ? null :
            <Button
              type="submit"
              color="primary"
              variant="contained"
            >
              Save details
            </Button>
          }
        </Box>
      </Card>
    </form>
  );
};

export {ProfileDetail};
