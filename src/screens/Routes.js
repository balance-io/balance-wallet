import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import createSwipeNavigator from '../navigation/navigators/createSwipeNavigator';
import sheetTransition from '../navigation/transitions/sheet';
import ActivityScreen from './ActivityScreen';
import IntroScreen from './IntroScreen';
import LoadingScreen from './LoadingScreen';
import ProfileScreen from './ProfileScreen';
import QRScannerScreenWithData from './QRScannerScreenWithData';
import WebViewScreen from './WebViewScreen';
import SendQRScannerScreenWithData from './SendQRScannerScreenWithData';
import SendScreenWithData from './SendScreenWithData';
import TransactionConfirmationScreenWithData from './TransactionConfirmationScreenWithData';
import WalletScreen from './WalletScreen';
import { deviceUtils } from '../utils';
import Navigation from '../navigation';


const SwipeStack = createSwipeNavigator(
  {
    ProfileScreen: {
      name: 'ProfileScreen',
      screen: ProfileScreen,
      statusBarColor: 'dark-content',
    },
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
  },
);

const AppStack = createStackNavigator(
  {
    ActivityScreen: {
      screen: ActivityScreen,
      navigationOptions: {
        effect: 'sheet',
        gestureResponseDistance: {
          vertical: deviceUtils.dimensions.height / 2,
        },
      },
    },
    ConfirmTransaction: TransactionConfirmationScreenWithData,
    IntroScreen: {
      screen: IntroScreen,
      navigationOptions: {
        effect: 'sheet',
        gestureResponseDistance: {
          vertical: deviceUtils.dimensions.height / 2,
        },
      },
    },
    SendScreen: {
      screen: SendScreenWithData,
      navigationOptions: {
        effect: 'sheet',
        gestureResponseDistance: {
          vertical: 150,
        },
      },
    },
    SendQRScannerScreen: SendQRScannerScreenWithData,
    SwipeLayout: SwipeStack,
  },
  {
    headerMode: 'none',
    initialRouteName: 'SwipeLayout',
    mode: 'modal',
    transitionConfig: sheetTransition,
  },
);

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
  },
);
