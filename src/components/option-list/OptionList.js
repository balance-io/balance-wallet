import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Row } from '~/components/layout';
import Icon from '~/components/icons/Icon';
import { colors, padding } from '~/styles';

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
  children: PropTypes.node.isRequired,
};

export default OptionList;
