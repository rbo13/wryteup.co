import { Anchor, Box } from 'grommet';
import React from 'react';
import { Login, User } from 'grommet-icons';


export default function HeaderItems() {
  return (
    <Box
      alignSelf='center'
      direction='row'
      gap='medium'
      justify='center'
    >
      <Anchor
        a11yTitle='Login'
        href='/login'
        icon={<Login color='brand' size='medium' />}
      />
      <Anchor
        target='_blank'
        a11yTitle='Login'
        href='/login'
        icon={<User color='brand' size='medium' />}
      />
    </Box>
  );
}
