import PropTypes from "prop-types";
import React from "react";
import { Path } from "svgs";
import { colors } from "../../../styles";
import Svg from "../Svg";

const ETHIcon = ({ color, ...props }) => (
  <Svg height="23" width="24" viewBox="0 0 23 24" {...props}>
    <Path
      d="M11.5 23.5C5.149 23.5 0 18.35 0 12 0 5.648 5.149.5 11.5.5S23 5.648 23 12c0 6.351-5.149 11.5-11.5 11.5zm0-18.686l-4.313 6.792 4.313 2.552 4.313-2.552L11.5 4.814zm0 10.294l-4.313-2.552 4.313 6.078 4.312-6.078-4.312 2.552z"
      fill={color}
      fillRule="evenodd"
    />
  </Svg>
);

ETHIcon.propTypes = {
  color: PropTypes.string
};

ETHIcon.defaultProps = {
  color: colors.black
};

export default ETHIcon;
