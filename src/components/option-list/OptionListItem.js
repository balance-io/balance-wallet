import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Row } from '~/components/layout';
import Icon from '~/components/icons/Icon';
import { colors, padding } from '~/styles';

// ======================================================================
// OptionListItem
// ======================================================================

const ItemAction = styled(TouchableOpacity)`
  border-bottom-width: ${({ border }) => (border ? 1 : 0)};
  border-bottom-color: ${colors.lightGrey};
`;

const Container = styled(Row).attrs({
  align: 'center',
  justify: 'start',
})`
  ${padding(20, 0)};
  align-self: stretch;
`;

const SelectedIcon = styled(Icon).attrs({
  name: 'checkmarkCircled',
  color: colors.appleBlue,
})`
  margin-right: 5;
`;

const OptionListItem = ({
  border,
  children,
  selected,
  onPress,
  ...props
}) => (
  <ItemAction border={border} onPress={onPress} {...props}>
    <Container>
      {children}
      {selected && <SelectedIcon />}
    </Container>
  </ItemAction>
);

OptionListItem.propTypes = {
  border: PropTypes.bool,
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

export default OptionListItem;
