import React from "react";
import { Animated, Dimensions, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components";

import { withAccountSettings } from "hoc";
import { Column, Row } from "components/layout";
import { Text } from "components/text";
import Icon from "components/icons/Icon";
import SettingsSection from "./SettingsSection";
import LanguageSection from "./LanguageSection";
import CurrencySection from "./CurrencySection";
import { colors, padding } from "styles";

// ======================================================================
// Styles
// ======================================================================

const ScreenWidth = Dimensions.get("window").width;
const OverlayWidth = ScreenWidth - 31;

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

// ======================================================================
// Component
// ======================================================================

class SettingsOverlay extends React.Component {
  sections = {
    SETTINGS: "Settings",
    LANGUAGE: "Language",
    CURRENCY: "Currency"
  };

  state = {
    section: this.props.section || this.sections.SETTINGS,
    settingsXValue: new Animated.Value(0),
    sectionXValue: new Animated.Value(OverlayWidth)
  };

  // Animate to last active section when SettingsOverlay is opened
  // Example:
  // `navigator.navigate('WalletScreen', {settingsSection: 'Language'})`
  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.state.section !== this.sections.SETTINGS) {
        this.setState({
          settingsXValue: new Animated.Value(-OverlayWidth),
          sectionXValue: new Animated.Value(0)
        });
      } else {
        this.setState({
          settingsXValue: new Animated.Value(0),
          sectionXValue: new Animated.Value(OverlayWidth)
        });
      }
    }
  }

  onPressSection = section => () => {
    Animated.parallel([
      Animated.timing(this.state.settingsXValue, {
        toValue: -OverlayWidth,
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
        toValue: OverlayWidth,
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
            language={this.props.language}
            onSelectLanguage={this.onSelectLanguage}
          />
        );

      case this.sections.CURRENCY:
        return (
          <CurrencySection
            nativeCurrency={this.props.nativeCurrency}
            onSelectCurrency={this.onSelectCurrency}
          />
        );

      case this.sections.SETTINGS:
      default:
        return null;
    }
  };

  render() {
    if (!this.props.visible) {
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
              <HeaderAction onPress={this.props.onPressClose}>
                Done
              </HeaderAction>
            </HeaderRight>
          </HeaderRow>

          <Animated.View
            style={[
              sectionStyles,
              { transform: [{ translateX: this.state.settingsXValue }] }
            ]}
          >
            <SettingsSection
              language={this.props.language}
              nativeCurrency={this.props.nativeCurrency}
              onPressLanguage={this.onPressSection(this.sections.LANGUAGE)}
              onPressCurrency={this.onPressSection(this.sections.CURRENCY)}
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

SettingsOverlay.propTypes = {
  language: PropTypes.string.isRequired,
  nativeCurrency: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onPressClose: PropTypes.func.isRequired
};

export default withAccountSettings(SettingsOverlay);
