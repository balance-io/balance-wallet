import PropTypes from 'prop-types';
import { createElement } from 'react';
import Flex from '../layout/Flex';

import ArrowIcon from './svg/ArrowIcon';
import AssetListItemSkeletonIcon from './svg/AssetListItemSkeletonIcon';
import AvatarIcon from './svg/AvatarIcon';
import BalanceLogoIcon from './svg/BalanceLogoIcon';
import BTCIcon from './svg/BTCIcon';
import CameraIcon from './svg/CameraIcon';
import CaretIcon from './svg/CaretIcon';
import CaretThinIcon from './svg/CaretThinIcon';
import CheckmarkIcon from './svg/CheckmarkIcon';
import CheckmarkCircledIcon from './svg/CheckmarkCircledIcon';
import ClockIcon from './svg/ClockIcon';
import CloseIcon from './svg/CloseIcon';
import CopyIcon from './svg/CopyIcon';
import DotIcon from './svg/DotIcon';
import ETHIcon from './svg/ETHIcon';
import GearIcon from './svg/GearIcon';
import OfflineIcon from './svg/OfflineIcon';
import ShareIcon from './svg/ShareIcon';
import SpinnerIcon from './svg/SpinnerIcon';
import ThreeDotsIcon from './svg/ThreeDotsIcon';
import WalletConnectIcon from './svg/WalletConnectIcon';
import WarningIcon from './svg/WarningIcon';

const Icon = ({ name, ...props }) =>
  createElement(Icon.IconTypes[name] || Flex, props);

Icon.propTypes = {
  name: PropTypes.string,
};

Icon.IconTypes = {
  arrow: ArrowIcon,
  avatar: AvatarIcon,
  balanceLogo: BalanceLogoIcon,
  btc: BTCIcon,
  camera: CameraIcon,
  caret: CaretIcon,
  caretThin: CaretThinIcon,
  checkmark: CheckmarkIcon,
  checkmarkCircled: CheckmarkCircledIcon,
  clock: ClockIcon,
  close: CloseIcon,
  copy: CopyIcon,
  dot: DotIcon,
  eth: ETHIcon,
  gear: GearIcon,
  offline: OfflineIcon,
  spinner: SpinnerIcon,
  share: ShareIcon,
  threeDots: ThreeDotsIcon,
  walletConnect: WalletConnectIcon,
  warning: WarningIcon,
};

export default Icon;
