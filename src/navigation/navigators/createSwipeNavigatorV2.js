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
  and,
  divide,
  debug,
  abs,
  round,
  greaterThan,
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
    nextIndex = new Value(1);

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

    nextIndex = cond(
      greaterThan(this.nextIndex, (routeOrder.length - 1)),
      set(this.nextIndex, sub(this.nextIndex, 1)),
      cond(
        lessThan(this.dragX, 0),
        set(this.nextIndex, add(this.nextIndex, 1)),
        set(this.nextIndex, sub(this.nextIndex, 1)),
      ),
    );

    snapPoint = cond(
      greaterThan(this.nextIndex, (routeOrder.length - 1)),
      [
        debug('reanimated.nextIndex', this.nextIndex),
        multiply(-deviceUtils.dimensions.width, sub(this.nextIndex, 1)),
      ],
      [
        debug('reanimated.nextIndex', this.nextIndex),
        multiply(-deviceUtils.dimensions.width, this.nextIndex),
      ],
    );

    _transX = cond(
      and(
        lessThan(this.dragX, 0),
        lessThan(this.transX, -deviceUtils.dimensions.width * (routeOrder.length - 1)),
      ),
      -deviceUtils.dimensions.width * (routeOrder.length - 1),
      cond(
        eq(this.gestureState, State.ACTIVE),
        [
          debug('reanimated.dragX', this.dragX),
          debug('reanimated.transX', this.transX),
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
      ),
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
