import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import createSwipeNavigator from "../navigators/createSwipeNavigator";
import ActivityScreen from "./ActivityScreen";
import IntroScreen from "./IntroScreen";
import LoadingScreen from "./LoadingScreen";
import QRScannerScreenWithData from "./QRScannerScreenWithData";
import SendScreen from "./SendScreen";
import TransactionConfirmationScreenWithData from "./TransactionConfirmationScreenWithData";
import WalletScreen from "./WalletScreen";
import WebViewScreen from "./WebViewScreen";
import Navigation from "../navigation";

const SwipeStack = createSwipeNavigator(
  {
    WalletScreen: {
      name: "WalletScreen",
      screen: WalletScreen,
      statusBarColor: "dark-content"
    },
    QRScannerScreen: {
      name: "QRScannerScreen",
      screen: QRScannerScreenWithData,
      statusBarColor: "light-content"
    }
  },
  {
    headerMode: "none",
    initialRouteName: "WalletScreen",
    mode: "modal",
    onSwipeStart: () => Navigation.pauseNavigationActions(),
    onSwipeEnd: navigation => Navigation.resumeNavigationActions(navigation)
  }
);

const AppStack = createStackNavigator(
  {
    ActivityScreen: {
      navigationOptions: {
        gesturesEnabled: false
      },
      screen: ActivityScreen
    },
    ConfirmTransaction: TransactionConfirmationScreenWithData,
    SendScreen,
    SwipeLayout: SwipeStack
  },
  {
    headerMode: "none",
    initialRouteName: "SwipeLayout",
    mode: "modal"
  }
);

const IntroStack = createStackNavigator(
  {
    IntroScreen
  },
  {
    headerMode: "none",
    mode: "card" // Horizontal gestures
  }
);

export default createSwitchNavigator(
  {
    App: AppStack,
    Intro: IntroStack,
    Loading: LoadingScreen,
    WebView: WebViewScreen
  },
  {
    headerMode: "none",
    initialRouteName: "Loading",
    mode: "modal"
  }
);
