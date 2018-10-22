import { withSafeTimeout } from '@hocs/safe-timers';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Animated,
  Clipboard,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  Share,
} from 'react-native';
import { compose, onlyUpdateForKeys, withHandlers, withState } from 'recompact';
import styled from 'styled-components';
import { AssetList } from '../components/asset-list';
import { UniqueTokenRow } from '../components/unique-token';
import Avatar from '../components/Avatar';
import { BalanceCoinRow } from '../components/coin-row';
import {
  ActivityHeaderButton,
  Header,
  HeaderButton,
} from '../components/header';
import { FlexItem, Page, Column, Row } from '../components/layout';
import {
  ActivityHeaderButton,
  Header,
  HeaderButton
} from "../components/header";
import { FlexItem, Page } from "../components/layout";
import {
  areAssetsEqualToInitialAccountAssetsState,
  buildUniqueTokenList,
  groupAssetsByMarketValue,
  sortAssetsByNativeAmount,
} from '../helpers/assets';
import {
  withAccountAddress,
  withAccountAssets,
  withHideSplashScreen,
  withRequestsInit,
} from '../hoc';
import { Text, TruncatedAddress } from 'components/text';
import Icon from 'components/icons/Icon';
import { position, colors } from '../styles';
import SettingsOverlay from './SettingsOverlay';

const SCREEN_HEIGHT = Dimensions.get('window').height - 120;

// ======================================================================
// Styles
// ======================================================================

const HeaderColumn = styled(Column)`
  align-items: center;
  justify-content: center;
  margin-top: 5;
  margin-bottom: 5;
`;

const Address = styled(TruncatedAddress).attrs({
  size: 'big',
  weight: 'bold',
  truncationLength: 4,
})`
  margin-top: 10;
  margin-bottom: 5;
`;

const AvatarImage = styled(Image)`
  height: 65px;
  width: 65px;
  border-radius: 32;
`;

const AvatarContainer = styled(View)`
  shadow-color: #3a3a4f;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.14;
  shadow-radius: 10;
`;

const AvatarHero = ({ source }) => (
  <AvatarContainer>
    <AvatarImage source={source} />
  </AvatarContainer>
);

const ProfileActionContainer = styled(Row)`
  align-items: center;
`;
const ProfileActionText = styled(Text).attrs({
  color: colors.appleBlue,
  size: 'medium',
  weight: 'semibold',
})`
  margin-left: 5;
  margin-right: 16;
`;

const ProfileAction = ({ icon, children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <ProfileActionContainer>
      <Icon name={icon} color={colors.appleBlue} />
      <ProfileActionText>{children}</ProfileActionText>
    </ProfileActionContainer>
  </TouchableOpacity>
);

// ======================================================================
// Component
// ======================================================================

const BalanceRenderItem = renderItemProps => (
  <BalanceCoinRow {...renderItemProps} />
);
const UniqueTokenRenderItem = renderItemProps => (
  <UniqueTokenRow {...renderItemProps} />
);
const filterEmptyAssetSections = sections =>
  sections.filter(({ totalItems }) => totalItems);

class WalletScreen extends React.PureComponent {
  state = {
    settingsVisible: false,
    overlayOpacity: new Animated.Value(0),
    modalYPosition: new Animated.Value(SCREEN_HEIGHT),
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

  onPressCopy = () => {
    Clipboard.setString(this.props.accountAddress);
  };

  onPressShare = () => {
    Share.share({
      message: this.props.accountAddress,
      title: 'My account address',
    });
  };

  render() {
    const {
      assets,
      assetsCount,
      assetsTotalUSD,
      dispatch,
      fetching,
      navigation,
      onHideSplashScreen,
      onPressProfile,
      onPressWalletConnect,
      onRefreshList,
      onToggleShowShitcoins,
      showShitcoins,
      uniqueTokens,
    } = this.props;

    const sections = {
      balances: {
        data: sortAssetsByNativeAmount(assets, showShitcoins),
        renderItem: BalanceRenderItem,
        title: 'Balances',
        totalItems: get(assetsTotalUSD, 'amount') ? assetsCount : 0,
        totalValue: get(assetsTotalUSD, 'display', ''),
      },
      collectibles: {
        data: buildUniqueTokenList(uniqueTokens),
        renderItem: UniqueTokenRenderItem,
        title: 'Collectibles',
        totalItems: uniqueTokens.length,
        totalValue: '',
      },
    };

    const assetsByMarketValue = groupAssetsByMarketValue(assets);
    const totalShitcoins = get(assetsByMarketValue, 'noValue', []).length;
    if (totalShitcoins) {
      sections.balances.contextMenuOptions = {
        cancelButtonIndex: 1,
        destructiveButtonIndex: showShitcoins ? 0 : 99, // 99 is an arbitrarily high number used to disable the 'destructiveButton' option
        onPress: onToggleShowShitcoins,
        options: [
          `${showShitcoins ? 'Hide' : 'Show'} assets with no price data`,
          'Cancel',
        ],
      };
    }

    // allow navigation to any Settings section via navigation.params
    const settingsSection = navigation.getParam('settingsSection', 'Settings');

    return (
      <Page component={FlexItem} style={position.sizeAsObject('100%')}>
        <Header justify="space-between">
          <HeaderButton onPress={this.showSettingsOverlay}>
            <Icon name="gear" />
          </HeaderButton>
          <ActivityHeaderButton />
        </Header>

        <HeaderColumn>
          <AvatarHero
            source={{
              uri:
                'https://sguru.org/wp-content/uploads/2017/06/cool-anonymous-profile-pictures-1699946_orig.jpg',
            }}
          />
          <Address address={this.props.accountAddress} />

          <Row>
            <ProfileAction onPress={this.onPressCopy} icon="copy">
              Copy Address
            </ProfileAction>
            <ProfileAction onPress={this.onPressShare} icon="share">
              Share
            </ProfileAction>
          </Row>
        </HeaderColumn>

        <AssetList
          fetchData={onRefreshList}
          onPressWalletConnect={onPressWalletConnect}
          onSectionsLoaded={onHideSplashScreen}
          sections={filterEmptyAssetSections([
            sections.balances,
            sections.collectibles,
          ])}
          showShitcoins={showShitcoins}
        />
        <SettingsOverlay
          overlayOpacity={this.state.overlayOpacity}
          modalYPosition={this.state.modalYPosition}
          section={settingsSection}
          visible={this.state.settingsVisible}
          onPressClose={this.hideSettingsOverlay}
        />
      </Page>
    );
  }
}

WalletScreen.propTypes = {
  assets: PropTypes.array,
  assetsCount: PropTypes.number,
  assetsTotalUSD: PropTypes.shape({
    amount: PropTypes.string,
    display: PropTypes.string,
  }),
  didLoadAssetList: PropTypes.bool,
  fetching: PropTypes.bool.isRequired,
  fetchingUniqueTokens: PropTypes.bool.isRequired,
  onHideSplashScreen: PropTypes.func,
  onPressProfile: PropTypes.func.isRequired,
  onPressWalletConnect: PropTypes.func.isRequired,
  onRefreshList: PropTypes.func.isRequired,
  onSectionsLoaded: PropTypes.func,
  onToggleShowShitcoins: PropTypes.func,
  showShitcoins: PropTypes.bool,
  uniqueTokens: PropTypes.array.isRequired,
};

export default compose(
  withAccountAddress,
  withAccountAssets,
  withHideSplashScreen,
  withRequestsInit,
  withSafeTimeout,
  withState('showShitcoins', 'toggleShowShitcoins', true),
  withHandlers({
    onPressWalletConnect: ({ navigation }) => () =>
      navigation.navigate('QRScannerScreen'),
    onRefreshList: ({
      accountAddress,
      accountUpdateAccountAddress,
      setSafeTimeout,
      transactionsToApproveInit,
    }) => () => {
      accountUpdateAccountAddress(accountAddress, 'BALANCEWALLET');
      transactionsToApproveInit();
      // hack: use timeout so that it looks like loading is happening
      // accountUpdateAccountAddress does not return a promise
      return new Promise(resolve => setSafeTimeout(resolve, 2000));
    },
    onToggleShowShitcoins: ({
      showShitcoins,
      toggleShowShitcoins,
    }) => index => {
      if (index === 0) {
        toggleShowShitcoins(!showShitcoins);
      }
    },
  }),
  onlyUpdateForKeys(['isScreenActive', ...Object.keys(WalletScreen.propTypes)])
)(WalletScreen);
