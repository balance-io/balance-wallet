import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components/primitives';
import { colors } from '../../styles';
import { ButtonPressAnimation } from '../buttons';
import { Monospace } from '../text';
import CoinName from './CoinName';
import CoinRow from './CoinRow';

const BottomRowText = styled(Monospace).attrs({ size: 'smedium' })`
  color: ${({ color }) => (color || colors.blueGreyLight)};
`;

const SendNftCoinRow = ({ item, onPress, ...props }) => (
  <ButtonPressAnimation onPress={onPress} scaleTo={0.96}>
    <CoinRow
      {...item}
      {...props}
      bottomRowRender={({ asset_contract, id }) => (
        <Fragment>
          <BottomRowText>{asset_contract.name} #{id}</BottomRowText>
        </Fragment>
      )}
      topRowRender={({ name }) => (
        <Fragment>
          <CoinName>{name}</CoinName>
        </Fragment>
      )}
    />
  </ButtonPressAnimation>
);

SendNftCoinRow.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};

export default SendNftCoinRow;
