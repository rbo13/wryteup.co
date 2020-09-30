import React from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  ResponsiveContext,
} from 'grommet';
import { Notification } from 'grommet-icons';

/*
colors:
  Rich Black = #04080F
  Glaucous = #507DBC
  Baby Blue Eyes = #A1C6EA
  Beau Blue = #BBD1EA
  Gainsboro = #DAE3E5
*/

const theme = {
  global: {
    colors: {
      brand: '#04080F',
    },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '18px',
    },
  },
};

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='small'
    style={{ zIndex: '1' }}
    {...props}
  />
);

function App() {
  const [showSidebar, setShowSidebar] = React.useState(false)

  return (
    <Grommet theme={theme} full>
      <ResponsiveContext.Consumer>
        {size => (
          <Box fill>
            <AppBar>
              <Heading level='3' margin='none'>wryteup</Heading>
              <Button
                icon={<Notification />}
                onClick={() => setShowSidebar(!showSidebar)}
              />
            </AppBar>
            <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
              <Box flex align='center' justify='center'>
                <main>
                  Main body
                </main>
              </Box>
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
