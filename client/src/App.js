import React from 'react';
import {
  Anchor,
  Box,
  Footer,
  Grommet,
  Text,
} from 'grommet';
import AppHeader from './components/nav/AppHeader'
import Section from './components/Section';
import { Signup } from './components/screens/Signup';

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

function App() {
  return (
    <Grommet theme={theme} full>
      <AppHeader />
      <Box fill>
        <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
          <Box as='main' flex align='center' justify='center'>
            <Signup />
          </Box>
        </Box>
      </Box>
      <Section>
        <Footer
        >
          <Text>Copyright</Text>
          <Anchor label="About" />
        </Footer>
      </Section>
    </Grommet>
  );
}

export default App;
