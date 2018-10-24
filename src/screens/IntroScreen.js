import {
  account,
  accountInitializeState,
  accountUpdateAccountAddress,
  commonStorage,
} from 'balance-common';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';
import React from 'react';
import {
  Clipboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompact';
import styled from 'styled-components';

import { Text, Monospace } from '../components/text';
import Icon from '../components/icons/Icon';
import { Column, Row } from '../components/layout';
import { colors, fonts, padding } from '../styles';
import { walletInit } from '../model/wallet';
import {
  walletConnectGetAllTransactions,
  walletConnectInitAllConnectors,
} from '../model/walletconnect';
import { transactionsToApproveInit } from '../reducers/transactionsToApprove';

const Container = styled(Column).attrs({
  align: 'center',
})`
  display: flex;
  flex: 1;
  flex-direction: column;
  ${padding(16)};
  margin-top: 15;
  background: ${colors.white};
  border-top-left-radius: 12;
  border-top-right-radius: 12;
`;

const Body = styled(Column).attrs({
  align: 'center',
})`
  margin-right: 50;
  margin-left: 50;
  margin-top: auto;
  margin-bottom: auto;
`;

const Input = styled(TextInput).attrs({
  placeholderTextColor: '#C4C6CB',
  multiline: true,
})`
  font-family: ${fonts.family['SFMono']};
  font-weight: ${fonts.weight.semibold};
  font-size: ${fonts.size.large};
  margin-bottom: 20;
  text-align: center;
  line-height: 25;
`;

const HelpText = styled(Text).attrs({
  size: 'medium',
  weight: 'medium',
})`
  text-align: center;
`;

const Footer = styled(KeyboardAvoidingView).attrs({
  behavior: 'padding',
  keyboardVerticalOffset: 95,
})`
  display: flex;
  align-self: stretch;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15;
`;

const HelpButton = styled(TouchableOpacity)`
  padding-left: 8;
  padding-right: 8;
  padding-top: 6;
  padding-bottom: 6;
  border: 1px solid #f6f7f7;
  border-radius: 15px;
`;

const ImportButton = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 8;
  padding-right: 8;
  padding-top: 6;
  padding-bottom: 6;
  background: ${props => (props.disabled ? '#D2D3D7' : colors.appleBlue)};
  border-radius: 15px;
  shadow-color: ${colors.dark};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.14;
  shadow-radius: 10;
`;

const ImportIcon = styled(Icon).attrs({
  name: 'arrowCircled',
  color: colors.white,
  direction: 'right',
  style: { paddingRight: '5' },
})``;

const ImportText = styled(Text).attrs({
  size: 'medium',
  weight: 'bold',
})`
  color: ${colors.white};
  padding-left: ${({ padding }) => (padding ? 5 : 0)};
`;

class IntroScreen extends React.Component {
  state = {
    seedPhrase: '',
  };

  onImportSeedPhrase = () => {
    walletInit(this.state.seedPhrase)
      .then(walletAddress => {
        console.log('wallet address is', walletAddress);
        this.setState({ seedPhrase: walletAddress });
        // this.props.accountUpdateAccountAddress(walletAddress, 'BALANCEWALLET');
        // this.props.transactionsToApproveInit();
        //   walletConnectInitAllConnectors()
        //     .then(allConnectors => {
        //       this.props.setWalletConnectors(allConnectors);
        //       firebase
        //         .notifications()
        //         .getInitialNotification()
        //         .then(notificationOpen => {
        //           if (!notificationOpen) {
        //             this.fetchAllTransactionsFromWalletConnectSessions();
        //           }
        //         });
        //     })
        //     .catch(error => {
        //       console.log('Unable to init all WalletConnect sessions');
        //     });
        //   firebase
        //     .notifications()
        //     .getInitialNotification()
        //     .then(notificationOpen => {
        //       console.log('on initial notification');
        //       if (notificationOpen) {
        //         console.log('on initial notification opened - while app closed');
        //         const {
        //           transactionId,
        //           sessionId,
        //         } = notificationOpen.notification.data;
        //         this.onPushNotificationOpened(transactionId, sessionId);
        //       }
        //     });
        //   /*
        // */
      })
      .catch(error => {
        console.log('failed to init wallet');
        AlertIOS.alert('Error: Failed to initialize wallet.');
      });
  };

  // fetchAllTransactionsFromWalletConnectSessions = async allConnectors => {
  //   if (!isEmpty(allConnectors)) {
  //     const allTransactions = await walletConnectGetAllTransactions(
  //       allConnectors
  //     );
  //     if (!isEmpty(allTransactions)) {
  //       this.props.addTransactionsToApprove(allTransactions);
  //     }
  //   }
  // };

  isSeedPhraseValid = () => {
    const phraseCount = this.state.seedPhrase
      .split(' ')
      .filter(word => word !== '').length;
    return phraseCount >= 12 && phraseCount <= 24;
  };

  onSeedPhraseChange = seedPhrase => {
    this.setState({ seedPhrase });
  };

  onPasteSeedPhrase = () => {
    // this.props.navigation.navigate('SwipeLayout');
    Clipboard.getString()
      .then(this.onSeedPhraseChange)
      .catch(error => {
        console.log(error);
      });
  };

  renderHelp = () => {
    if (this.state.seedPhrase !== '') {
      return null;
    }
    return (
      <HelpText>
        Use your 12 or 24 word seed phrase from an existing wallet.
      </HelpText>
    );
  };

  renderActionButton = () => {
    if (this.state.seedPhrase !== '') {
      return (
        <ImportButton
          disabled={!this.isSeedPhraseValid()}
          onPress={this.onImportSeedPhrase}
        >
          <ImportIcon />
          <ImportText padding>Import</ImportText>
        </ImportButton>
      );
    } else {
      return (
        <ImportButton onPress={this.onPasteSeedPhrase}>
          <ImportText>Paste</ImportText>
        </ImportButton>
      );
    }
  };

  render() {
    return (
      <Container>
        <Text size="large" weight="bold">
          Import
        </Text>

        <Body>
          <Input
            autoFocus
            value={this.state.seedPhrase}
            placeholder={'Type your seed phrase'}
            onChangeText={this.onSeedPhraseChange}
          />
          {this.renderHelp()}
        </Body>

        <Footer>
          <HelpButton onPress={() => {}}>
            <HelpText>Help</HelpText>
          </HelpButton>
          {this.renderActionButton()}
        </Footer>
      </Container>
    );
  }
}

export default withNavigation(IntroScreen);

// export default compose(
//   withNavigation,
//   connect(
//     () => ({}),
//     {
//       transactionsToApproveInit,
//       accountUpdateAccountAddress,
//     }
//   )
// )(IntroScreen);
