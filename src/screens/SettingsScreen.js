import PropTypes from "prop-types";
import React from "react";
import { Animated } from "react-native";
import { TouchableOpacity } from "react-native";
import { compose, withHandlers } from "recompact";
import styled from "styled-components/primitives";
import { Column, Row } from "../components/layout";
import { Text } from "../components/text";
import Icon from "../components/icons/Icon";
import SettingsSection from "./SettingsOverlay/SettingsSection";
import LanguageSection from "./SettingsOverlay/LanguageSection";
import CurrencySection from "./SettingsOverlay/CurrencySection";
import { colors, borders, padding } from "../styles";

const Overlay = styled(Column)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 15, 17, 0.4);
`;

const Content = styled(Column).attrs({
  align: "stretch",
  justify: "start"
})`
  position: relative;
  flex: 1;
  margin-top: 120;
  margin-left: 15;
  margin-right: 15;
  margin-bottom: 120;
  ${padding(16)};
  background: ${colors.white};
  border-radius: 12;
  overflow: hidden;
`;

const HeaderRow = styled(Row).attrs({
  align: "center"
})`
  align-content: space-between;
  margin-bottom: 30;
`;

const HeaderTitle = styled(Text).attrs({
  size: "large",
  weight: "bold"
})`
  margin-left: auto;
  margin-right: auto;
`;

const HeaderBackButton = styled(Icon).attrs({
  name: "caret",
  direction: "left",
  color: colors.appleBlue
})`
  margin-right: 5;
`;

const HeaderAction = styled(Text).attrs({
  size: "large",
  weight: "semibold",
  color: "appleBlue"
})``;

const HeaderLeft = styled(TouchableOpacity)`
  position: absolute;
  left: 0;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: row;
  align-items: center;
`;

const HeaderRight = styled(TouchableOpacity)`
  position: absolute;
  right: 0;
`;

const sectionStyles = {
  position: "absolute",
  top: 50,
  left: 0,
  right: 0,
  paddingRight: 16,
  paddingLeft: 16
};

class SettingsScreen extends React.PureComponent {
  sections = {
    SETTINGS: "Settings",
    LANGUAGE: "Language",
    CURRENCY: "Currency"
  };

  state = {
    section: this.sections.SETTINGS,
    settingsXValue: new Animated.Value(0),
    sectionXValue: new Animated.Value(350)
  };

  onPressSection = section => {
    Animated.parallel([
      Animated.timing(this.state.settingsXValue, {
        toValue: -350,
        useNativeDriver: true
      }).start(),
      Animated.timing(this.state.sectionXValue, {
        toValue: 0,
        useNativeDriver: true
      }).start()
    ]);

    this.setState({
      section
    });
  };

  onPressBack = () => {
    Animated.parallel([
      Animated.timing(this.state.settingsXValue, {
        toValue: 0,
        useNativeDriver: true
      }).start(),
      Animated.timing(this.state.sectionXValue, {
        toValue: 350,
        useNativeDriver: true
      }).start()
    ]);

    this.setState({
      section: this.sections.SETTINGS
    });
  };

  onSelectLanguage = language => {
    this.props.accountChangeLanguage(language);
  };

  onSelectCurrency = currency => {
    this.props.accountChangeNativeCurrency(currency);
  };

  renderActiveSection = () => {
    switch (this.state.section) {
      case this.sections.LANGUAGE:
        return (
          <LanguageSection
            language={this.props.account.language}
            onSelectLanguage={this.onSelectLanguage}
          />
        );

      case this.sections.CURRENCY:
        return (
          <CurrencySection
            currency={this.props.account.nativeCurrency}
            onSelectCurrency={this.onSelectCurrency}
          />
        );

      case this.sections.SETTINGS:
      default:
        return null;
    }
  };

  render() {
    const { visible, onPressClose, account } = this.props;
    if (!visible) {
      return null;
    }

    return (
      <Overlay>
        <Content>
          <HeaderRow>
            <HeaderLeft
              visible={this.state.section !== this.sections.SETTINGS}
              onPress={this.onPressBack}
            >
              <HeaderBackButton />
              <HeaderAction>Settings</HeaderAction>
            </HeaderLeft>

            <HeaderTitle>{this.state.section}</HeaderTitle>

            <HeaderRight>
              <HeaderAction onPress={onPressClose}>Done</HeaderAction>
            </HeaderRight>
          </HeaderRow>

          <Animated.View
            style={[
              sectionStyles,
              { transform: [{ translateX: this.state.settingsXValue }] }
            ]}
          >
            <SettingsSection
              language={account.language}
              currency={account.nativeCurrency}
              onPressLanguage={() =>
                this.onPressSection(this.sections.LANGUAGE)
              }
              onPressCurrency={() =>
                this.onPressSection(this.sections.CURRENCY)
              }
            />
          </Animated.View>
          <Animated.View
            style={[
              sectionStyles,
              { transform: [{ translateX: this.state.sectionXValue }] }
            ]}
          >
            {this.renderActiveSection()}
          </Animated.View>
        </Content>
      </Overlay>
    );
  }
}

SettingsScreen.propTypes = {};

export default SettingsScreen;
