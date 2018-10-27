import lang from 'i18n-js';
import { times } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { withNavigation } from 'react-navigation';
import { compose, omitProps, withHandlers } from 'recompact';
import styled from 'styled-components/primitives';

import { colors, margin, position } from '../../styles';
import { Button } from '../buttons';
import { Centered, Column } from '../layout';
import AssetListHeader from './AssetListHeader';
import AssetListItemSkeleton from './AssetListItemSkeleton';
import Icon from '~/components/icons/Icon';
import Divider from '~/components/Divider';
import { Text } from '~/components/text';

const Container = styled(Column)`
  ${position.size('100%')};
`;

const SkeletonContainer = styled(Column)`
  position: absolute;
  top: 0;
  z-index: -1;
`;

const SkeletonElement = styled(Icon).attrs({ name: 'assetListItemSkeleton' })`
  ${({ index }) => margin(index === 0 ? 15 : 12.5, 19, 12.5, 15)}
  opacity: ${({ index }) => 1 - 0.2 * index};
`;

const AssetListBody = styled(Centered)`
  flex: 1;
`;

const ButtonContainer = styled(Centered)`
  flex-direction: column;
  width: 225;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 42.5;
`;

const ButtonDivider = styled(Divider)`
  width: 93;
  margin-top: 18;
  margin-bottom: 18;
`;

const ImportText = styled(Text).attrs({
  size: 'smedium',
  weight: 'regular',
  color: '#C4C6CB',
})`
  margin-top: 18;
  text-align: center;
`;

const AssetListSkeleton = ({
  onPressAddFunds,
  onPressImportWallet,
  skeletonCount,
}) => (
  <Container>
    <AssetListHeader section={{ title: 'Balances', totalValue: '$0.00' }} />
    <AssetListBody>
      <ButtonContainer>
        <Button bgColor={colors.appleBlue} onPress={onPressAddFunds}>
          Add Funds
        </Button>
        <ButtonDivider />
        <Button bgColor="#5D9DF6" onPress={onPressImportWallet}>
          Import Wallet
        </Button>
        <ImportText>
          Use your 12 or 24 word seed phrase from an existing wallet.
        </ImportText>
      </ButtonContainer>

      <SkeletonContainer>
        {times(skeletonCount, index => (
          <SkeletonElement index={index} key={`SkeletonElement${index}`} />
        ))}
      </SkeletonContainer>
    </AssetListBody>
  </Container>
);

AssetListSkeleton.propTypes = {
  onPressAddFunds: PropTypes.func,
  onPressImportWallet: PropTypes.func,
  skeletonCount: PropTypes.number,
};

AssetListSkeleton.defaultProps = {
  skeletonCount: 5,
};

export default compose(
  withNavigation,
  withHandlers({
    onPressAddFunds: ({ navigation }) => () =>
      navigation.navigate('SettingsScreen'),
    onPressImportWallet: ({ navigation }) => () =>
      navigation.navigate('IntroScreen'),
  }),
  omitProps('navigation')
)(AssetListSkeleton);
