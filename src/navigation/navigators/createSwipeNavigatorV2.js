import { map } from 'lodash';
import PropTypes from 'prop-types';
import React, { createElement, Component } from 'react';
import { createNavigator, StackRouter } from 'react-navigation';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { ScreenContainer, Screen } from 'react-native-screens';
import Animated from 'react-native-reanimated';
import { deviceUtils } from '../../utils';

const {
  event,
  Value,
  cond,
  eq,
  set,
  add,
  sub,
  Clock,
  multiply,
  lessThan,
  clockRunning,
  startClock,
  stopClock,
  spring,
} = Animated;

function runSpring(clock, value, velocity, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    damping: 100,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

export default function createSwipeNavigator(screens, options) {
  const router = StackRouter(screens, options);
  const routeOrder = options.order || map(screens, ({ name }) => name);

  class NavigationView extends Component {
    static propTypes = {
      descriptors: PropTypes.object,
      navigation: PropTypes.object,
      navigationConfig: PropTypes.object,
      screenProps: PropTypes.object,
    };

    dragX = new Value(0);
    dragVX = new Value(0);
    prevDragX = new Value(0);
    transX = new Value(0);
    clock = new Clock();

    gestureState = new Value(-1);

    onGestureEvent = event([
      {
        nativeEvent: {
          velocityX: this.dragVX,
          translationX: this.dragX,
          state: this.gestureState,
        },
      },
    ]);

    snapPoint = cond(
      lessThan(add(this.transX, multiply(0.2, this.dragVX)), 0),
      -0.1,
      0.1,
    );

    _transX = cond(
      eq(this.gestureState, State.ACTIVE),
      [
        stopClock(this.clock),
        set(this.transX, add(this.transX, sub(this.dragX, this.prevDragX))),
        set(this.prevDragX, this.dragX),
        this.transX,
      ],
      [
        set(this.prevDragX, 0),
        set(
          this.transX,
          runSpring(this.clock, this.transX, this.dragVX, this.snapPoint),
        ),
      ],
    );

    renderScreens() {
      const { navigation } = this.props;

      return map(screens, (screen) => {
        const routeIndex = routeOrder.indexOf(screen.name);

        const screenStyle = {
          position: 'absolute',
          left: routeIndex * deviceUtils.dimensions.width,
          height: deviceUtils.dimensions.height,
          width: deviceUtils.dimensions.width,
        };

        const style = {
          height: deviceUtils.dimensions.height,
          width: deviceUtils.dimensions.width,
        };

        return (
          <Screen key={screen.name} active={1} style={screenStyle}>
            {createElement(screen.screen, { style, navigation })}
          </Screen>
        );
      });
    }

    render() {
      const style = {
        width: deviceUtils.dimensions.width * routeOrder.length,
        height: deviceUtils.dimensions.height,
      };

      const animatedStyle = {
        ...style,
        transform: [{ translateX: this._transX }],
      };

      return (
        <PanGestureHandler maxPointers={1} onGestureEvent={this.onGestureEvent} onHandlerStateChange={this.onGestureEvent}>
          <Animated.View style={animatedStyle}>
            <ScreenContainer style={style}>
              {this.renderScreens()}
            </ScreenContainer>
          </Animated.View>
        </PanGestureHandler>
      );
    }
  }

  return createNavigator(NavigationView, router, options);
}
