import { Box, Form, TextInput } from 'grommet'
import React from 'react'
import { Search } from 'grommet-icons';

export default function HeaderForm() {
  return (
    <Box
      direction='row'
      alignSelf='center'
      justify='center'
    >
      <Form
        onSubmit={ ({ value }) => console.log(value.query) }
        onChange={ ({ query }) => console.log(query) }
      >
        <TextInput
          id="query"
          name="query"
          icon={<Search />}
        />
      </Form>
    </Box>
  )
}
