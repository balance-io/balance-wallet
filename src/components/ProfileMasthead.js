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
  HeaderButton,
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
import Avatar from '~/assets/avatar.png';

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
  margin-bottom: 5;
`;
const AvatarImage = styled(Image).attrs({
  source: Avatar,
})`
  height: 85px;
  width: 85px;
  border-radius: 32;
`;

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


const ProfileMasthead = ({
  accountAddress,
  onPressCopy,
  onPressShare,
}) => (
  <HeaderColumn>
    <AvatarImage />
    <Address address={accountAddress} />
    <Row>
      <ProfileAction onPress={onPressCopy} icon="copy">
        Copy
      </ProfileAction>
      <ProfileAction onPress={onPressShare} icon="share">
        Share
      </ProfileAction>
    </Row>
  </HeaderColumn>
);

ProfileMasthead.propTypes = {
  accountAddress: PropTypes.string,
  onPressCopy: PropTypes.func,
  onPressShare: PropTypes.func,
};

export default compose(
  withHandlers({
    onPressCopy: ({ accountAddress }) => () => Clipboard.setString(accountAddress),
    onPressShare: ({ accountAddress }) => () =>
      Share.share({
        message: accountAddress,
        title: 'My account address',
      }),
  }),
)(ProfileMasthead);
