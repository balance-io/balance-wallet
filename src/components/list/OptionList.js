import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Row } from "components/layout";
import Icon from "components/icons/Icon";
import { colors, padding } from "styles";

// ======================================================================
// OptionListItem
// ======================================================================

const ItemAction = styled(TouchableOpacity)`
  border-bottom-width: ${({ border }) => (border ? 1 : 0)};
  border-bottom-color: ${colors.lightGrey};
`;
const ItemContainer = styled(Row).attrs({
  align: "center",
  justify: "start"
})`
  align-self: stretch;
  ${padding(20, 0)};
`;
const SelectedIcon = styled(Icon).attrs({
  name: "checkmarkCircled",
  color: colors.appleBlue
})`
  margin-left: auto;
  margin-right: 5;
`;

export const OptionListItem = ({
  border,
  children,
  selected,
  onPress,
  ...props
}) => (
  <ItemAction border={border} onPress={onPress} {...props}>
    <ItemContainer>
      {children}
      {selected && <SelectedIcon />}
    </ItemContainer>
  </ItemAction>
);

OptionListItem.propTypes = {
  border: PropTypes.bool,
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool,
  onPress: PropTypes.func.isRequired
};

// ======================================================================
// OptionList
// ======================================================================

const List = styled(ScrollView)`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
`;

const OptionList = ({ children, ...props }) => (
  <List {...props}>{children}</List>
);

OptionList.propTypes = {
  children: PropTypes.node.isRequired
};

export default OptionList;
