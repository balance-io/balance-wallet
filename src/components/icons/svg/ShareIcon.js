import PropTypes from "prop-types";
import React from "react";
import { Path } from "svgs";
import { colors } from "../../../styles";
import Svg from "../Svg";

const ShareIcon = ({ color, ...props }) => (
  <Svg height="18" width="12" viewBox="0 0 12 18" {...props}>
    <Path
      d="M12 8.833v6.669a2.003 2.003 0 0 1-2 2H2a2.003 2.003 0 0 1-2-2V8.833c.001-1.104.896-2 2-2h1.333a.667.667 0 0 1 0 1.333H2a.667.667 0 0 0-.667.667v6.669c0 .368.299.666.667.667h8a.668.668 0 0 0 .667-.667V8.833A.668.668 0 0 0 10 8.166H8.667a.667.667 0 0 1 0-1.333H10a2.003 2.003 0 0 1 2 2zM6 12.17a.667.667 0 0 1-.667-.667V4.839H3.668a.342.342 0 0 1-.273-.541L5.725.973a.332.332 0 0 1 .546 0l2.33 3.325a.342.342 0 0 1-.273.54H6.667v6.664a.667.667 0 0 1-.667.667z"
      fillRule="nonzero"
      fill={color}
    />
  </Svg>
);

ShareIcon.propTypes = {
  color: PropTypes.string
};

ShareIcon.defaultProps = {
  color: colors.black
};

export default ShareIcon;
