import { withSafeTimeout } from "@hocs/safe-timers";
import { get } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { compose, onlyUpdateForKeys, withHandlers, withState } from "recompact";
import { AssetList } from "../components/asset-list";
import { UniqueTokenRow } from "../components/unique-token";
import Avatar from "../components/Avatar";
import { BalanceCoinRow } from "../components/coin-row";
import {
  ActivityHeaderButton,
  Header,
  HeaderButton
} from "../components/header";
import { FlexItem, Page } from "../components/layout";
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
  sortAssetsByNativeAmount
} from "../helpers/assets";
import {
  withAccountAddress,
  withAccountAssets,
  withHideSplashScreen,
  withRequestsInit
} from "../hoc";
import { position } from "../styles";
import SettingsOverlay from "./SettingsOverlay";

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
    settingsVisible: true
  };

  showSettingsOverlay = () => {
    this.setState({ settingsVisible: true });
  };

  hideSettingsOverlay = () => {
    this.setState({ settingsVisible: false });
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
      uniqueTokens
    } = this.props;

    const sections = {
      balances: {
        data: sortAssetsByNativeAmount(assets, showShitcoins),
        renderItem: BalanceRenderItem,
        title: "Balances",
        totalItems: get(assetsTotalUSD, "amount") ? assetsCount : 0,
        totalValue: get(assetsTotalUSD, "display", "")
      },
      collectibles: {
        data: buildUniqueTokenList(uniqueTokens),
        renderItem: UniqueTokenRenderItem,
        title: "Collectibles",
        totalItems: uniqueTokens.length,
        totalValue: ""
      }
    };

    const assetsByMarketValue = groupAssetsByMarketValue(assets);
    const totalShitcoins = get(assetsByMarketValue, "noValue", []).length;
    if (totalShitcoins) {
      sections.balances.contextMenuOptions = {
        cancelButtonIndex: 1,
        destructiveButtonIndex: showShitcoins ? 0 : 99, // 99 is an arbitrarily high number used to disable the 'destructiveButton' option
        onPress: onToggleShowShitcoins,
        options: [
          `${showShitcoins ? "Hide" : "Show"} assets with no price data`,
          "Cancel"
        ]
      };
    }

    // allow navigation to any Settings section via navigation.params
    const settingsSection = navigation.getParam("settingsSection", "Backup");

    return (
      <Page component={FlexItem} style={position.sizeAsObject("100%")}>
        <Header justify="space-between">
          <HeaderButton onPress={this.showSettingsOverlay}>
            <Avatar />
          </HeaderButton>
          <ActivityHeaderButton />
        </Header>
        <AssetList
          fetchData={onRefreshList}
          onPressWalletConnect={onPressWalletConnect}
          onSectionsLoaded={onHideSplashScreen}
          sections={filterEmptyAssetSections([
            sections.balances,
            sections.collectibles
          ])}
          showShitcoins={showShitcoins}
        />
        <SettingsOverlay
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
    display: PropTypes.string
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
  uniqueTokens: PropTypes.array.isRequired
};

export default compose(
  withAccountAddress,
  withAccountAssets,
  withHideSplashScreen,
  withRequestsInit,
  withSafeTimeout,
  withState("showShitcoins", "toggleShowShitcoins", true),
  withHandlers({
    onPressWalletConnect: ({ navigation }) => () =>
      navigation.navigate("QRScannerScreen"),
    onRefreshList: ({
      accountAddress,
      accountUpdateAccountAddress,
      setSafeTimeout,
      transactionsToApproveInit
    }) => () => {
      accountUpdateAccountAddress(accountAddress, "BALANCEWALLET");
      transactionsToApproveInit();
      // hack: use timeout so that it looks like loading is happening
      // accountUpdateAccountAddress does not return a promise
      return new Promise(resolve => setSafeTimeout(resolve, 2000));
    },
    onToggleShowShitcoins: ({
      showShitcoins,
      toggleShowShitcoins
    }) => index => {
      if (index === 0) {
        toggleShowShitcoins(!showShitcoins);
      }
    }
  }),
  onlyUpdateForKeys(["isScreenActive", ...Object.keys(WalletScreen.propTypes)])
)(WalletScreen);
