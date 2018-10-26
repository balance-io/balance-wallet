import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import createSwipeNavigator from '../navigation/navigators/createSwipeNavigator';
import sheetTransition from '../navigation/transitions/sheet';
import ActivityScreen from './ActivityScreen';
import IntroScreen from './IntroScreen';
import LoadingScreen from './LoadingScreen';
import QRScannerScreenWithData from './QRScannerScreenWithData';
import WebViewScreen from './WebViewScreen';
import SendQRScannerScreenWithData from './SendQRScannerScreenWithData';
import SendScreenWithData from './SendScreenWithData';
import SettingsScreenWithData from './SettingsScreenWithData';
import TransactionConfirmationScreenWithData from './TransactionConfirmationScreenWithData';
import WalletScreen from './WalletScreen';
import { deviceUtils } from '../utils';

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

const AppStack = createStackNavigator({
  ActivityScreen: {
    navigationOptions: {
      effect: 'sheet',
      gestureResponseDistance: {
        vertical: deviceUtils.dimensions.height / 2,
      },
    },
  },
  ConfirmTransaction: TransactionConfirmationScreenWithData,
  SendScreen: {
    navigationOptions: {
      effect: 'sheet',
      gestureResponseDistance: {
        vertical: 150,
      },
    },
    screen: SendScreenWithData,
  },
  SendQRScannerScreen: SendQRScannerScreenWithData,
  SwipeLayout: SwipeStack,
  IntroScreen: {
    navigationOptions: {
      effect: 'sheet',
      gestureResponseDistance: {
        vertical: deviceUtils.dimensions.height / 2,
      },
    },
    screen: IntroScreen,
  }
}, {
  headerMode: 'none',
  initialRouteName: 'SwipeLayout',
  mode: 'modal',
  transitionConfig: sheetTransition,
});

const IntroStack = createStackNavigator({
  IntroScreen,
}, {
  headerMode: 'none',
  mode: 'card', // Horizontal gestures
});

export default createSwitchNavigator(
  {
    App: AppStack,
    Loading: LoadingScreen,
    WebView: WebViewScreen,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Loading',
    mode: 'modal',
  }
);
