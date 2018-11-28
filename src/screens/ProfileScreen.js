import PropTypes from 'prop-types';
import React from 'react';
import lang from 'i18n-js';
import { onlyUpdateForPropTypes } from 'recompact';
import styled from 'styled-components/primitives';
import AppVersionStamp from '../components/AppVersionStamp';
import { Button } from '../components/buttons';
import { BackButton, Header, HeaderButton } from '../components/header';
import { Centered, Column, FlexItem, Page } from '../components/layout';
import SendFeedback from '../components/SendFeedback';
import { Monospace, TruncatedAddress } from '../components/text';
import Icon from '../components/icons/Icon';
import CopyTooltip from '../components/CopyTooltip';
import ProfileMasthead from '../components/ProfileMasthead';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { colors, fonts, padding, position } from '../styles';
import { deviceUtils } from '../utils';
import { SettingsMenu } from '~/components/settings-menu';

const ProfileScreen = ({
  accountAddress,
  hideSettingsOverlay,
  modalYPosition,
  navigation,
  onPressBackButton,
  overlayOpacity,
  settingsVisible,
  showSettingsOverlay,
}) => {
  // allow navigation to any Settings section via navigation.params
  const settingsSection = navigation.getParam('settingsSection', 'Settings');

  return (
    <Page component={FlexItem} style={position.sizeAsObject('100%')}>
      <Header justify="space-between">
        <HeaderButton onPress={showSettingsOverlay}>
          <Icon name="gear" />
        </HeaderButton>
        <BackButton
          color={colors.brightBlue}
          direction="right"
          onPress={onPressBackButton}
        />
      </Header>
      <ProfileMasthead accountAddress={accountAddress} />

      <SettingsMenu
        overlayOpacity={overlayOpacity}
        modalYPosition={modalYPosition}
        section={settingsSection}
        visible={settingsVisible}
        onPressClose={hideSettingsOverlay}
      />
    </Page>
  );
};

ProfileScreen.propTypes = {
  accountAddress: PropTypes.string,
  hideSettingsOverlay: PropTypes.func,
  modalYPosition: PropTypes.number,
  navigation: PropTypes.object,
  onPressBackButton: PropTypes.func,
  overlayOpacity: PropTypes.number,
  settingsVisible: PropTypes.bool,
  showSettingsOverlay: PropTypes.func,
};

export default ProfileScreen;
