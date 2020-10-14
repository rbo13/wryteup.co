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

const useStyles = makeStyles(() => ({
  root: {},
}));

const ProfileDetail = () => {
  const classes = useStyles();
  const {register, handleSubmit, errors} = useForm();

  const updateDetails = (form) => {
    console.log(form);
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
          subheader="The information can be edited"
          title="Profile"
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
                label="Birthday"
                type="date"
                id="birthdate"
                name="birthdate"
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
          <Button
            type="submit"
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export {ProfileDetail};
