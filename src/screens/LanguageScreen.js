import React, { Component } from "react";
import styled from "styled-components";
import { Column, Row, Page } from "../components/layout";
import { BackButton } from "../components/header";
import { ButtonRow } from "../components/buttons";
import { Text } from "../components/text";
import Icon from "../components/icons/Icon";
import { colors, fonts, padding } from "../styles";
import { LANGUAGES } from "../utils/constants";

const Content = styled(Column)`
  ${padding(0, 24)};
`;

const LanguageTitle = styled(Text).attrs({
  weight: "semibold",
  size: "big"
})`
  margin-bottom: 14;
`;

const OptionLabel = styled(Text).attrs({
  size: "large"
})`
  padding-right: 5;
`;

const SelectedIcon = styled(Icon).attrs({
  name: "dot"
})`
  margin-left: auto;
`;

class LanguageScreen extends React.PureComponent {
  state = {
    selected: LANGUAGES[0].value
  };

  selectLanguage = language => {
    this.setState({
      selected: language
    });
  };

  renderLanguageOption = ({ label, value }, idx) => (
    <ButtonRow key={idx} onPress={() => this.selectLanguage(value)}>
      <OptionLabel>{label}</OptionLabel>
      {this.state.selected === value && <SelectedIcon />}
    </ButtonRow>
  );

  render() {
    const { onPressBackButton } = this.props;
    return (
      <Page align="stretch" component={Column} showTopInset>
        <BackButton
          color={colors.brightBlue}
          direction="left"
          onPress={onPressBackButton}
        />
        <Content>
          <LanguageTitle weight="semibold" size="big">
            Language
          </LanguageTitle>

          {LANGUAGES.map(this.renderLanguageOption)}
        </Content>
      </Page>
    );
  }
}

export default LanguageScreen;
