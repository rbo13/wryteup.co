import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormField,
  Heading,
  TextInput
} from 'grommet';

const Signup = () => {
  return (
    <Card responsive='true' height='medium' width='medium'>
      <CardHeader align='center' pad='small'>
        <Heading
          size='small'
          textAlign='center'
          alignSelf='center'
        >
          Signup for free
        </Heading>
      </CardHeader>
      <CardBody pad='xsmall'>
        <form>
          <FormField
            htmlFor='email'
            label="Email"
          >
            <TextInput
              id='email'
              name='email'
              type='email'
              placeholder='john@example.com'
            />
          </FormField>
          <FormField
            margin={{ top: '16px' }}
            htmlFor='password'
            label="Password"
          >
            <TextInput
              id='password'
              name='password'
              type='password'
              placeholder='******'
            />
          </FormField>
          <FormField
            margin={{ top: '16px' }}
            htmlFor='confirmPassword'
            label="Confirm Password"
          >
            <TextInput
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='******'
            />
          </FormField>
          <Button
            margin={{ top: '24px' }}
            alignSelf='center'
            primary
            label='Sign up'
            type='submit'
            fill='horizontal'
          />
        </form>
      </CardBody>
      <CardFooter
        pad={{ horizontal: 'small' }}
        background='light-2'
      >
        Test
      </CardFooter>
    </Card>
  );
}

export { Signup }
