import { withSafeTimeout } from '@hocs/safe-timers';
import { get, isEmpty } from 'lodash';
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

import { AssetList } from '~/components/asset-list';
import { UniqueTokenRow } from '~/components/unique-token';
import { BalanceCoinRow } from '~/components/coin-row';
import {
  ActivityHeaderButton,
  Header,
  ProfileHeaderButton,
} from '~/components/header';
import { FlexItem, Page, Column, Row } from '~/components/layout';
import { FabWrapper, WalletConnectFab, SendFab } from '~/components/fab';
import { Text, TruncatedAddress } from '~/components/text';
import Icon from '~/components/icons/Icon';
import {
  areAssetsEqualToInitialAccountAssetsState,
  buildUniqueTokenList,
  groupAssetsByMarketValue,
  sortAssetsByNativeAmount,
} from '~/helpers/assets';
import {
  withAccountAddress,
  withAccountAssets,
  withHideSplashScreen,
  withRequestsInit,
} from '~/hoc';
import { position, colors } from '~/styles';


// ======================================================================
// Styles
// ======================================================================




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

const WalletScreen = ({
  assets,
  assetsCount,
  assetsTotalUSD,
  dispatch,
  fetching,
  navigation,
  onHideSplashScreen,
  onPressProfile,
  onPressSend,
  onPressWalletConnect,
  isLoading,
  onRefreshList,
  onToggleShowShitcoins,
  showShitcoins,
  uniqueTokens,
}) => {
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

  console.log('⏰️⏰️⏰️⏰️sections', sections);

  const fabItems = [
    <SendFab disable={isEmpty} key="sendFab" onPress={onPressSend} />,
    <WalletConnectFab
      disable={isEmpty}
      key="walletConnectFab"
      onPress={onPressWalletConnect}
    />,
  ];

  return (
    <Page component={FlexItem} style={position.sizeAsObject('100%')}>
      <Header justify="space-between">
        <ProfileHeaderButton navigation={navigation} />
        {(!isEmpty && !isLoading) && (
          <ActivityHeaderButton navigation={navigation}/>
        )}
      </Header>
      <FlexItem>
        <FabWrapper disable={isEmpty || isLoading} items={fabItems}>
          <AssetList
            fetchData={onRefreshList}
            onPressSend={onPressSend}
            onPressWalletConnect={onPressWalletConnect}
            onSectionsLoaded={onHideSplashScreen}
            sections={filterEmptyAssetSections([
              sections.balances,
              sections.collectibles,
            ])}
            showShitcoins={showShitcoins}
          />
        </FabWrapper>
      </FlexItem>
    </Page>
  );
};

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
  onPressSend: PropTypes.func.isRequired,
  onPressWalletConnect: PropTypes.func.isRequired,
  onRefreshList: PropTypes.func.isRequired,
  onSectionsLoaded: PropTypes.func,
  onToggleShowShitcoins: PropTypes.func,
  showShitcoins: PropTypes.bool,
  toggleSwiping: PropTypes.func,
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
    onPressSend: ({ navigation }) => () => navigation.navigate('SendScreen'),
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
  onlyUpdateForKeys(['isScreenActive', ...Object.keys(WalletScreen.propTypes)]),
)(WalletScreen);
