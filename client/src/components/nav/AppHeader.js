import React from 'react';
import { Anchor, Box, Text, ResponsiveContext } from 'grommet'
import HeaderItems from './HeaderItems';
import HeaderForm from './HeaderForm';

export default function AppHeader() {
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Box
          direction='row'
          justify='between'
          alignSelf='center'
          gap='medium'
          pad={{ top: 'large', horizontal: 'xlarge' }}
        >
          <Anchor
            alignSelf='center'
            label={
              size !== 'xsmall' &&
              size !== 'small' ? <Text size='large'>wryteup</Text> : null
            }
          >
          </Anchor>
          <HeaderForm />
          <HeaderItems />
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
}