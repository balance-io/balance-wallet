import { filter } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { StatusBar, TouchableOpacity, Text, View } from 'react-native';
import { compose, defaultProps, withHandlers, withProps } from 'recompact';
import styled from 'styled-components/primitives';
import { TokenExpandedState, UniqueTokenExpandedState } from '../components/expanded-state';
import { Centered } from '../components/layout';
import { withAccountAssets } from '../hoc';
import { padding, position } from '../styles';
import { deviceUtils } from '../utils';

console.disableYellowBox = true;

const BackgroundButton = styled(TouchableOpacity)`
  ${position.cover}
  background-color: transparent;
  z-index: 0;
`;

const Container = styled(Centered).attrs({ direction: 'column' })`
  ${({ containerPadding }) => padding(containerPadding)};
  background-color: transparent;
  height: 100%;
`;

const ExpandedAssetScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>Hello</Text>
    </View>
  );
};

ExpandedAssetScreen.propTypes = {
  asset: PropTypes.object,
  containerPadding: PropTypes.number.isRequired,
  onPressBackground: PropTypes.func,
  panelWidth: PropTypes.number,
  type: PropTypes.oneOf(['token', 'unique_token']),
};

export default ExpandedAssetScreen;

