import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import createSwipeNavigator from '../navigators/createSwipeNavigator';
import ActivityScreen from './ActivityScreen';
import IntroScreen from './IntroScreen';
import LoadingScreen from './LoadingScreen';
import QRScannerScreenWithData from './QRScannerScreenWithData';
import SendScreen from './SendScreen';
import TransactionConfirmationScreenWithData from './TransactionConfirmationScreenWithData';
import WalletScreen from './WalletScreen';
import WebViewScreen from './WebViewScreen';
import Navigation from '../navigation';
import sheetTransition from '../navigation/transitions/sheet';
import { deviceUtils } from '../utils';

const SwipeStack = createSwipeNavigator(
  {
    WalletScreen: {
      name: 'WalletScreen',
      screen: WalletScreen,
      statusBarColor: 'dark-content',
    },
    QRScannerScreen: {
      name: 'QRScannerScreen',
      screen: QRScannerScreenWithData,
      statusBarColor: 'light-content',
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'WalletScreen',
    mode: 'modal',
    onSwipeStart: () => Navigation.pauseNavigationActions(),
    onSwipeEnd: navigation => Navigation.resumeNavigationActions(navigation),
  }
);

const AppStack = createStackNavigator(
  {
    ActivityScreen: {
      navigationOptions: {
        gesturesEnabled: false,
      },
      screen: ActivityScreen,
    },
    ConfirmTransaction: TransactionConfirmationScreenWithData,
    SendScreen,
    SwipeLayout: SwipeStack,
    IntroScreen: {
      navigationOptions: {
        effect: 'sheet',
        gestureResponseDistance: {
          vertical: deviceUtils.dimensions.height / 2,
        },
      },
      screen: IntroScreen,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'IntroScreen',
    // initialRouteName: 'SwipeLayout',
    mode: 'modal',
    transitionConfig: sheetTransition,
  }
);

const IntroStack = createStackNavigator(
  {
    IntroScreen: {
      navigationOptions: {
        effect: 'sheet',
        gestureResponseDistance: {
          vertical: deviceUtils.dimensions.height / 2,
        },
      },
      screen: IntroScreen,
    },
  },
  {
    headerMode: 'none',
    mode: 'modal', // Horizontal gestures
    transitionConfig: sheetTransition,
  }
);

export default createSwitchNavigator(
  {
    App: AppStack,
    Intro: IntroStack,
    Loading: LoadingScreen,
    WebView: WebViewScreen,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Loading',
    mode: 'modal',
  }
);
