import PropTypes from 'prop-types';
import React from 'react';
import { Modal, WebView } from 'react-native';
import { pure } from 'recompact';
import { deviceUtils } from '../utils';

const WebViewScreen = ({ navigation }) => (
  <Modal visible={true}>
    <WebView
      source={{ uri: navigation.getParam('uri', 'https://balance.io') }}
      style={deviceUtils.dimensions}
    />
  </Modal>
);

WebViewScreen.propTypes = {
  navigation: PropTypes.object,
};

export default pure(WebViewScreen);
