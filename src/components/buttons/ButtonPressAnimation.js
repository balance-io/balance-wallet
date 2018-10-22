import { compact } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { animations } from '../../styles';
import { directionPropType } from '../../utils';

const ButtonKeyframes = animations.keyframes.button;

const DefaultAnimatedValues = {
  opacity: 0,
  scale: ButtonKeyframes.from.scale,
  transX: 0,
};

export default class ButtonPressAnimation extends Component {
  static propTypes = {
    activeOpacity: PropTypes.number,
    children: PropTypes.any,
    disabled: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.oneOf([PropTypes.object, PropTypes.number]),
    transformOrigin: directionPropType,
  }

  state = { scaleOffsetX: null }

  opacity = new Animated.Value(DefaultAnimatedValues.opacity)
  scale = new Animated.Value(DefaultAnimatedValues.scale)
  transX = new Animated.Value(DefaultAnimatedValues.transX)

  handleLayout = ({ nativeEvent: { layout } }) => {
    if (this.props.transformOrigin) {
      const width = Math.floor(layout.width);
      const scaleOffsetX = (width - (width * ButtonKeyframes.to.scale)) / 2;
      this.setState({ scaleOffsetX });
    }
  }

  handleStateChange = ({ nativeEvent: { state } }) => {
    const { activeOpacity, onPress, transformOrigin } = this.props;
    const { scaleOffsetX } = this.state;

    const isActive = state === State.BEGAN;

    const animationsArray = [
      // Default spring animation
      animations.buildSpring({
        from: ButtonKeyframes.from.scale,
        isActive,
        to: ButtonKeyframes.to.scale,
        value: this.scale,
      }),
    ];

export default compose(
  withState('isActive', 'setIsActive', false),
  withState('didPress', 'setDidPress', false),
  withHandlers({
    onActiveStateChange: ({ onActiveStateChange, setIsActive }) => isActive => {
      if (onActiveStateChange) onActiveStateChange(isActive);
      setIsActive(isActive);
    },
    onPress: ({ onPress, setDidPress }) => event => {
      if (onPress) onPress(event);
      setDidPress(true);
    },
    onRest: ({ didPress, onRest, setDidPress }) => event => {
      if (didPress) setDidPress(false);
      if (onRest) onRest(event);
    },
  })
)(ButtonPressAnimation);
