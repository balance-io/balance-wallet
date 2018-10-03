import PropTypes from "prop-types";
import React from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { compose, withHandlers } from "recompact";
import styled from "styled-components/primitives";
import { Column, Row } from "../../components/layout";
import { Text } from "../../components/text";
import Icon from "../../components/icons/Icon";
import { colors, borders, padding } from "../../styles";
import BackupIcon from "../../assets/backup-icon.png";
import CurrencyIcon from "../../assets/currency-icon.png";
import LanguageIcon from "../../assets/language-icon.png";

const SettingGroup = styled(Column)`
  margin-bottom: 20;
`;

const SettingRow = styled(Row).attrs({
  align: "center",
  justify: "start"
})`
  align-self: stretch;
  ${padding(18, 0)};
  border-bottom-width: 1;
  border-bottom-color: ${colors.lightGrey};
  &:last-child {
    border-bottom-color: transparent;
  }
`;

const PrimarySettingRow = styled(SettingRow)`
  ${padding(12, 0)};
`;

const SettingRowIcon = styled(Image)`
  width: 30;
  height: 30;
  margin-right: 10;
`;

const SettingRowLabel = styled(Text).attrs({
  size: "large"
})``;

const SettingArrowGroup = styled(Row).attrs({
  align: "center",
  justify: "center"
})`
  margin-left: auto;
  opacity: 0.6;
`;

const SettingRowValue = styled(Text).attrs({
  size: "large",
  color: colors.blueGreyDark
})``;

const SettingRowArrow = styled(Icon).attrs({
  name: "caret",
  color: colors.blueGreyDark,
  width: 20,
  height: 15
})`
  margin-left: 2;
`;

const SettingsSection = ({ onPressLanguage, onPressCurrency }) => (
  <Column>
    <SettingGroup>
      <PrimarySettingRow>
        <SettingRowIcon source={BackupIcon} />
        <SettingRowLabel>Backup</SettingRowLabel>
        <SettingArrowGroup>
          <Icon name="checkmarkCircled" color={colors.blueGreyDark} />
          <SettingRowArrow />
        </SettingArrowGroup>
      </PrimarySettingRow>

      <TouchableOpacity onPress={onPressCurrency}>
        <PrimarySettingRow>
          <SettingRowIcon source={CurrencyIcon} />
          <SettingRowLabel>Currency</SettingRowLabel>
          <SettingArrowGroup>
            <SettingRowValue>USD</SettingRowValue>
            <SettingRowArrow />
          </SettingArrowGroup>
        </PrimarySettingRow>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressLanguage}>
        <PrimarySettingRow>
          <SettingRowIcon source={LanguageIcon} />
          <SettingRowLabel>Language</SettingRowLabel>
          <SettingArrowGroup>
            <SettingRowValue>English</SettingRowValue>
            <SettingRowArrow />
          </SettingArrowGroup>
        </PrimarySettingRow>
      </TouchableOpacity>
    </SettingGroup>

    <SettingGroup>
      <SettingRow>
        <SettingRowLabel>About Balance ⚖️</SettingRowLabel>
      </SettingRow>
      <SettingRow>
        <SettingRowLabel>Leave Feedback ❤️</SettingRowLabel>
      </SettingRow>
      <SettingRow>
        <SettingRowLabel>Legal 📃</SettingRowLabel>
      </SettingRow>
    </SettingGroup>
  </Column>
);

export default SettingsSection;
