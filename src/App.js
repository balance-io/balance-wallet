import { get, isEmpty } from 'lodash';
import CodePush from 'react-native-code-push';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  accountInitializeState,
  accountUpdateAccountAddress,
  commonStorage,
} from 'balance-common';
import { AlertIOS, AppRegistry, AppState, View } from 'react-native';
import { compose, withProps } from 'recompact';
import Routes from './screens/Routes';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import styled from 'styled-components';
import { NavigationActions } from 'react-navigation';
import { withWalletConnectConnections } from './hoc';
import {
  addTransactionToApprove,
  addTransactionsToApprove,
  transactionIfExists,
  transactionsToApproveInit,
} from './redux/transactionsToApprove';
import {
  walletConnectInitAllConnectors,
  walletConnectGetAllTransactions,
  walletConnectGetTransaction,
} from './model/walletconnect';
import store from './redux/store';
import { walletInit } from './model/wallet';
import Navigation from './navigation';
import OfflineBadge from '~/components/OfflineBadge';

const Container = styled(View)`
  flex: 1;
`;

class App extends Component {
  state = {
    appState: AppState.currentState,
  };

  static propTypes = {
    accountInitializeState: PropTypes.func,
    accountUpdateAccountAddress: PropTypes.func,
    addTransactionsToApprove: PropTypes.func,
    addTransactionToApprove: PropTypes.func,
    getValidWalletConnectors: PropTypes.func,
    setWalletConnectors: PropTypes.func,
    transactionIfExists: PropTypes.func,
    transactionsToApproveInit: PropTypes.func,
    walletConnectors: PropTypes.arrayOf(PropTypes.object),
  }

  navigatorRef = null

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log('received fcmToken', fcmToken);
          commonStorage.saveLocal('balanceWalletFcmToken', { data: fcmToken });
        } else {
          console.log('no fcm token yet');
        }
      })
      .catch(error => {
        console.log('error getting fcm token');
      });

    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(fcmToken => {
        console.log('received refreshed fcm token', fcmToken);
        commonStorage.saveLocal('balanceWalletFcmToken', { data: fcmToken });
      });

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log('on notification received while app in foreground');
        const navState = get(this.navigatorRef, 'state.nav');
        const route = Navigation.getActiveRouteName(navState);
        const { callId, sessionId } = notification.data;
        if (route === 'ConfirmTransaction') {
          this.fetchAndAddTransaction(callId, sessionId).then(transaction => {
            const localNotification = new firebase.notifications.Notification()
              .setTitle(notification.title)
              .setBody(notification.body)
              .setData(notification.data);

            firebase.notifications().displayNotification(localNotification);
          });
        } else {
          this.onPushNotificationOpened(callId, sessionId);
        }
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        console.log('on notification manually opened');
        const { callId, sessionId } = notificationOpen.notification.data;
        this.onPushNotificationOpened(callId, sessionId);
      });

    this.props.accountInitializeState();
    this.handleWalletConfig();
  }

  handleWalletConfig = async seedPhrase => {
    try {
      console.log('seedPhrase', seedPhrase)
      const walletAddress = await walletInit(seedPhrase);

      console.log('wallet address is', walletAddress);
      this.props.accountUpdateAccountAddress(walletAddress, 'BALANCEWALLET');
      this.props.transactionsToApproveInit();

      const allConnectors = await walletConnectInitAllConnectors();
      if (allConnectors) {
        this.props.setWalletConnectors(allConnectors);
      }

      const notificationOpen = await firebase
        .notifications()
        .getInitialNotification();
      if (!notificationOpen) {
        this.fetchAllTransactionsFromWalletConnectSessions();
      }

      return walletAddress;
    } catch (error) {
      console.log('WALLET ERROR', error);
    }
  };

  handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.fetchAllTransactionsFromWalletConnectSessions();
    }
    this.setState({ appState: nextAppState });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListender();
    this.onTokenRefreshListener();
  }

  handleNavigatorRef = navigatorRef => {
    this.navigatorRef = navigatorRef;
  };

  handleOpenConfirmTransactionModal = transactionDetails => {
    if (!this.navigatorRef) return;

    const action = NavigationActions.navigate({
      routeName: 'ConfirmTransaction',
      params: { transactionDetails },
    });

    Navigation.handleAction(this.navigatorRef, action);
  };

  fetchAllTransactionsFromWalletConnectSessions = async () => {
    const allConnectors = this.props.getValidWalletConnectors();
    if (!isEmpty(allConnectors)) {
      const allTransactions = await walletConnectGetAllTransactions(
        allConnectors
      );
      if (!isEmpty(allTransactions)) {
        this.props.addTransactionsToApprove(allTransactions);
      }
    }
  };

  onPushNotificationOpened = async (callId, sessionId) => {
    const existingTransaction = this.props.transactionIfExists(callId);
    if (existingTransaction) {
      this.handleOpenConfirmTransactionModal(existingTransaction);
    } else {
      const transaction = await this.fetchAndAddTransaction(callId, sessionId);
      if (transaction) {
        this.handleOpenConfirmTransactionModal(transaction);
      } else {
        AlertIOS.alert('The requested transaction could not be found.');
      }
    }
  };

  fetchAndAddTransaction = async (callId, sessionId) => {
    const walletConnector = this.props.walletConnectors.find(({ _sessionId }) => (_sessionId === sessionId));
    const transactionDetails = await walletConnectGetTransaction(callId, walletConnector);
    if (!transactionDetails) return null;

    const { callData, dappName } = transactionDetails;
    return this.props.addTransactionToApprove(
      sessionId,
      callId,
      callData,
      dappName
    );
  };

  render = () => (
    <Provider store={store}>
      <Container>
        <OfflineBadge />
        <Routes
          ref={this.handleNavigatorRef}
          screenProps={{
            handleWalletConfig: this.handleWalletConfig,
          }}
        />
      </Container>
    </Provider>
  );
}

const AppWithRedux = compose(
  withProps({ store }),
  withWalletConnectConnections,
  connect(
    null,
    {
      addTransactionToApprove,
      addTransactionsToApprove,
      accountInitializeState,
      accountUpdateAccountAddress,
      transactionIfExists,
      transactionsToApproveInit,
    }
  )
)(App);

const AppWithCodePush = CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
})(AppWithRedux);

AppRegistry.registerComponent('BalanceWallet', () => AppWithCodePush);
