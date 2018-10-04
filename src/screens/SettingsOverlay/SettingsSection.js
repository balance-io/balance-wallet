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
  ${padding(14, 0)};
`;

// NOTE:
// I was having issues getting :last-child to properly
// remove borders, so I'm using `props.border` as a workaround.
// @hoodsy
const SettingButton = styled(TouchableOpacity)`
  border-bottom-width: ${({ border }) => (border ? 1 : 0)};
  border-bottom-color: ${colors.lightGrey};
`;

const PrimarySettingRow = styled(SettingRow)`
  ${padding(12, 0)};
`;

const SettingRowIcon = styled(Image)`
  width: 42;
  height: 42;
  margin-left: -6;
  margin-right: 4;
  margin-bottom: -8;
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

class SettingsSection extends React.PureComponent {
  render() {
    const { onPressLanguage, onPressCurrency } = this.props;
    return (
      <Column>
        <SettingGroup>
          <SettingButton border onPress={onPressCurrency}>
            <PrimarySettingRow>
              <SettingRowIcon source={BackupIcon} />
              <SettingRowLabel>Backup</SettingRowLabel>
              <SettingArrowGroup>
                <Icon name="checkmarkCircled" color={colors.blueGreyDark} />
                <SettingRowArrow />
              </SettingArrowGroup>
            </PrimarySettingRow>
          </SettingButton>

          <SettingButton border onPress={onPressCurrency}>
            <PrimarySettingRow>
              <SettingRowIcon source={CurrencyIcon} />
              <SettingRowLabel>Currency</SettingRowLabel>
              <SettingArrowGroup>
                <SettingRowValue>USD</SettingRowValue>
                <SettingRowArrow />
              </SettingArrowGroup>
            </PrimarySettingRow>
          </SettingButton>

          <SettingButton onPress={onPressLanguage}>
            <PrimarySettingRow>
              <SettingRowIcon source={LanguageIcon} />
              <SettingRowLabel>Language</SettingRowLabel>
              <SettingArrowGroup>
                <SettingRowValue>English</SettingRowValue>
                <SettingRowArrow />
              </SettingArrowGroup>
            </PrimarySettingRow>
          </SettingButton>
        </SettingGroup>

        <SettingGroup>
          <SettingButton border>
            <SettingRow>
              <SettingRowLabel>⚖️ About Balance</SettingRowLabel>
            </SettingRow>
          </SettingButton>
          <SettingButton border>
            <SettingRow>
              <SettingRowLabel>❤️ Leave Feedback️</SettingRowLabel>
            </SettingRow>
          </SettingButton>
          <SettingButton>
            <SettingRow>
              <SettingRowLabel>📃 Legal</SettingRowLabel>
            </SettingRow>
          </SettingButton>
        </SettingGroup>
      </Column>
    );
  }
}

export default SettingsSection;
