import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Dimensions, InteractionManager } from 'react-native';
import { withAccountAddress } from '../hoc';
import ProfileScreen from './ProfileScreen';


const SCREEN_HEIGHT = Dimensions.get('window').height - 120;

class ProfileScreenWithData extends Component {
  state = {
    settingsVisible: false,
    overlayOpacity: new Animated.Value(0),
    modalYPosition: new Animated.Value(SCREEN_HEIGHT),
  };

  hideSettingsOverlay = () => {
    Animated.parallel([
      Animated.spring(this.state.overlayOpacity, {
        toValue: 0,
        tension: 120,
        friction: 12,
        useNativeDriver: true,
      }).start(),
      Animated.spring(this.state.modalYPosition, {
        toValue: SCREEN_HEIGHT,
        tension: 120,
        friction: 12,
        useNativeDriver: true,
      }).start(() => {
        this.setState({ settingsVisible: false });
      }),
    ]);
    this.props.toggleSwiping(true);
  };

  showSettingsOverlay = () => {
    this.setState({ settingsVisible: true }, () => {
      Animated.parallel([
        Animated.spring(this.state.overlayOpacity, {
          toValue: 1,
          tension: 90,
          friction: 11,
          useNativeDriver: true,
        }).start(),
        Animated.spring(this.state.modalYPosition, {
          toValue: 0,
          tension: 90,
          friction: 11,
          useNativeDriver: true,
        }).start(),
      ]);
    });
    this.props.toggleSwiping(false);
  };

  render = () => (
    <ProfileScreen
      {...this.props}
      {...this.state}
    />
  )
}

export default withAccountAddress(ProfileScreenWithData);
