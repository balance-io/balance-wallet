import React, { Component } from "react";
import styled from "styled-components";
import { Column, Row, Page } from "../../components/layout";
import { ButtonRow } from "../../components/buttons";
import { Text } from "../../components/text";
import Icon from "../../components/icons/Icon";
import { colors, fonts, padding } from "../../styles";
import { LANGUAGES } from "../../utils/constants";

const Content = styled(Column)``;

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
  name: "checkmarkCircled",
  color: colors.appleBlue
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

  sortLanguageOptions = (a, b) => {
    if (a.label < b.label) {
      return -1;
    } else if (a.label > b.label) {
      return 1;
    } else {
      return 0;
    }
  };

  renderLanguageOption = ({ label, value }, idx) => (
    <ButtonRow
      key={idx}
      border={idx < LANGUAGES.length - 1}
      onPress={() => this.selectLanguage(value)}
    >
      <OptionLabel>{label}</OptionLabel>
      {this.state.selected === value && <SelectedIcon />}
    </ButtonRow>
  );

  render() {
    const { onPressBackButton } = this.props;
    return (
      <Content>
        {LANGUAGES.sort(this.sortLanguageOptions).map(
          this.renderLanguageOption
        )}
      </Content>
    );
  }
}

export default LanguageScreen;
