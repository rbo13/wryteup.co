import React from 'react';

const FullPageError = ({error}) => {
  return (
    <React.Fragment>
      <p>Uh ohh... Something went wrong.</p>
      <pre>{error.message}</pre>
    </React.Fragment>
  );
};


export {FullPageError};
