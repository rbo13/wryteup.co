import { Box } from 'grommet'
import PropTypes from "prop-types";
import React from 'react'

export default function Section({ children, width, ...rest }) {
  return (
    <Box
      align='center'
      pad='large'
      {...rest}
    >
      <Box
        width={width}
      >
        {children}
      </Box>
    </Box>
  )
}

Section.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string
};

Section.defaultProps = {
  width: "xlarge"
};
