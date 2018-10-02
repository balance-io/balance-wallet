import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity } from "react-native";
import { compose, onlyUpdateForPropTypes, withHandlers } from "recompact";
import styled from "styled-components/primitives";
import AppVersionStamp from "../components/AppVersionStamp";
import Avatar from "../components/Avatar";
import { Button } from "../components/buttons";
import { BackButton, Header } from "../components/header";
import { Centered, Column, Row, Page } from "../components/layout";
import SendFeedback from "../components/SendFeedback";
import { Monospace, TruncatedAddress, Text } from "../components/text";
import Icon from "../components/icons/Icon";
import CopyTooltip from "../components/CopyTooltip";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { colors, fonts, padding } from "../styles";
import { deviceUtils } from "../utils";

const Content = styled(Column).attrs({
  align: "stretch",
  justify: "start"
})`
  ${padding(0, 24)};
  flex: 1;
`;

const FooterCol = styled(Column).attrs({
  align: "start",
  justify: "start"
})`
  ${padding(24)};
`;

const SmallAddress = styled(Monospace).attrs({
  size: "tiny",
  weight: "regular",
  color: "blueGreyLight"
})`
  margin-top: 10;
  max-width: ${deviceUtils.dimensions.width * (150 / deviceUtils.iPhoneXWidth)};
`;

const HeaderCol = styled(Column).attrs({
  align: "start",
  justify: "start"
})`
  margin-bottom: 24;
`;

const SettingRow = styled(Row).attrs({
  align: "center",
  justify: "start"
})`
  ${padding(20, 0)};
  border-top-width: 1;
  border-top-color: ${colors.lightGrey};
  align-self: stretch;
`;

const SettingRowLabel = styled(Text).attrs({
  size: "large"
})``;

const SettingRowValue = styled(Text).attrs({
  size: "large",
  color: colors.blueGreyLight
})``;

const SettingArrowGroup = styled(Row).attrs({
  align: "center",
  justify: "center"
})`
  margin-left: auto;
`;

const SettingRowArrow = styled(Icon).attrs({
  name: "caret",
  color: colors.blueGreyLight,
  width: 20,
  height: 15
})`
  margin-left: 6;
`;

// const SeedPhraseButton = styled(Button)`
//   margin-top: ${fonts.size.h5};
// `;

// const SeedPhraseSection = styled(Centered)`
//   flex: 1;
// `;

// const SeedPhraseText = styled(Monospace).attrs({
//   size: "h5",
//   weight: "medium"
// })`
//   line-height: 28;
//   max-width: 288;
//   text-align: center;
// `;

const WalletAddressTextContainer = styled(Column).attrs({
  align: "start",
  justify: "start"
})`
  margin-top: 6;
  margin-bottom: 6;
`;

const SettingsScreen = ({
  accountAddress,
  onPressBackButton,
  onPressLanguage,
  onToggleShowSeedPhrase,
  seedPhrase
}) => (
  <Page
    align="stretch"
    component={Column}
    justify="start"
    showBottomInset
    showTopInset
  >
    {/*
    <Header align="end" justify="end">
      <BackButton
        color={colors.brightBlue}
        direction="right"
        onPress={onPressBackButton}
      />
      </Header>
      */}

    <Content>
      <HeaderCol>
        <Avatar />
        <WalletAddressTextContainer>
          <CopyTooltip textToCopy={accountAddress} tooltipText="Copy Address">
            <TruncatedAddress
              address={accountAddress}
              size="large"
              weight="semibold"
            />
          </CopyTooltip>
        </WalletAddressTextContainer>
        <Text size="medium">Copy Share</Text>
      </HeaderCol>

      <SettingRow>
        <SettingRowLabel>Backup</SettingRowLabel>
        <SettingArrowGroup>
          <SettingRowArrow />
        </SettingArrowGroup>
      </SettingRow>

      <TouchableOpacity onPress={onPressLanguage}>
        <SettingRow>
          <SettingRowLabel>Currency</SettingRowLabel>
          <SettingArrowGroup>
            <SettingRowValue>USD</SettingRowValue>
            <SettingRowArrow />
          </SettingArrowGroup>
        </SettingRow>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressLanguage}>
        <SettingRow>
          <SettingRowLabel>Language</SettingRowLabel>
          <SettingArrowGroup>
            <SettingRowValue>English</SettingRowValue>
            <SettingRowArrow />
          </SettingArrowGroup>
        </SettingRow>
      </TouchableOpacity>

      <SettingRow>
        <SettingRowLabel color={colors.blueGreyLight}>
          About Balance
        </SettingRowLabel>
      </SettingRow>

      <SettingRow>
        <SettingRowLabel color={colors.blueGreyLight}>Legal</SettingRowLabel>
      </SettingRow>

      {/*
          <SendFeedback />
          <SeedPhraseButton onPress={onToggleShowSeedPhrase}>
            {seedPhrase ? "Hide" : "Show"} Seed Phrase
          </SeedPhraseButton>
          <SeedPhraseSection>
            {seedPhrase && (
              <CopyTooltip textToCopy={seedPhrase} tooltipText="Copy Seed Phrase">
                <SeedPhraseText>{seedPhrase}</SeedPhraseText>
              </CopyTooltip>
            )}
          </SeedPhraseSection>
        */}
    </Content>

    <FooterCol>
      <QRCodeDisplay
        size={deviceUtils.dimensions.width * (150 / deviceUtils.iPhoneXWidth)}
        value={accountAddress}
      />
      <SmallAddress>{accountAddress}</SmallAddress>
    </FooterCol>
  </Page>
);

SettingsScreen.propTypes = {
  accountAddress: PropTypes.string,
  onPressBackButton: PropTypes.func,
  onToggleShowSeedPhrase: PropTypes.func,
  seedPhrase: PropTypes.string
};

export default compose(
  withHandlers({
    onPressLanguage: ({ navigation }) => () =>
      navigation.navigate("LanguageScreen"),
    onPressCurrency: ({ navigation }) => () =>
      navigation.navigate("CurrencyScreen")
  })
  // onlyUpdateForPropTypes(SettingsScreen)
)(SettingsScreen);
