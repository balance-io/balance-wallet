import PropTypes from "prop-types";
import React from "react";
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
import { Header } from "../components/header";

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
  flex: 1;
  margin-top: 120;
  margin-left: 15;
  margin-right: 15;
  margin-bottom: 120;
  ${padding(16)};
  background: ${colors.white};
  border-radius: 12;
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

class SettingsScreen extends React.PureComponent {
  sections = {
    SETTINGS: "Settings",
    LANGUAGE: "Language",
    CURRENCY: "Currency"
  };

  state = {
    section: this.sections.SETTINGS // settings, language, currency
  };

  handleSectionChange = section =>
    this.setState({
      section
    });

  renderActiveSection = () => {
    switch (this.state.section) {
      case this.sections.LANGUAGE:
        return <LanguageSection />;

      case this.sections.CURRENCY:
        return <CurrencySection />;

      case this.sections.SETTINGS:
      default:
        return (
          <SettingsSection
            onPressLanguage={() =>
              this.handleSectionChange(this.sections.LANGUAGE)
            }
            onPressCurrency={() =>
              this.handleSectionChange(this.sections.CURRENCY)
            }
          />
        );
    }
  };

  render() {
    const { visible } = this.props;

    return (
      <Overlay>
        <Content>
          <HeaderRow>
            <HeaderLeft
              visible={this.state.section !== this.sections.SETTINGS}
              onPress={() => this.handleSectionChange(this.sections.SETTINGS)}
            >
              <HeaderBackButton />
              <HeaderAction>Settings</HeaderAction>
            </HeaderLeft>

            <HeaderTitle>{this.state.section}</HeaderTitle>

            <HeaderRight>
              <HeaderAction>Done</HeaderAction>
            </HeaderRight>
          </HeaderRow>

          {this.renderActiveSection()}
        </Content>
      </Overlay>
    );
  }
}

SettingsScreen.propTypes = {};

export default SettingsScreen;
