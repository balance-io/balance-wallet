import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import ButtonPressAnimation from "./ButtonPressAnimation";
import { Row } from "../layout";
import { colors, padding } from "../../styles";

const Button = styled(TouchableOpacity)`
  border-bottom-width: ${({ border }) => (border ? 1 : 0)};
  border-bottom-color: ${colors.lightGrey};
`;

const RowContainer = styled(Row).attrs({
  align: "center",
  justify: "start"
})`
  align-self: stretch;
  ${padding(20, 0)};
`;

const ButtonRow = ({ children, border, onPress, ...props }) => (
  <Button border={border} onPress={onPress} {...props}>
    <RowContainer>{children}</RowContainer>
  </Button>
);

ButtonRow.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func.isRequired
};

export default ButtonRow;
