import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import ButtonPressAnimation from "./ButtonPressAnimation";
import { Row } from "../layout";
import { colors, padding } from "../../styles";

const RowContainer = styled(Row).attrs({
  align: "center",
  justify: "start"
})`
  align-self: stretch;
  ${padding(20, 0)};
  border-top-width: 1;
  border-top-color: ${colors.lightGrey};
`;

const ButtonRow = ({ children, onPress, ...props }) => (
  <ButtonPressAnimation onPress={onPress}>
    <RowContainer>{children}</RowContainer>
  </ButtonPressAnimation>
);

export default ButtonRow;
