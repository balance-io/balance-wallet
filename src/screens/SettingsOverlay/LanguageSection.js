import React, { Component } from "react";
import { ScrollView, Dimensions } from "react-native";
import styled from "styled-components";
import { Column, Row, Page } from "../../components/layout";
import { ButtonRow } from "../../components/buttons";
import { Text } from "../../components/text";
import Icon from "../../components/icons/Icon";
import { colors, fonts, padding } from "../../styles";
import { LANGUAGES, NUM_LANGUAGES } from "../../utils/constants";

const Content = styled(ScrollView)`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  height: ${Dimensions.get("window").height - 300};
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
  name: "checkmarkCircled",
  color: colors.appleBlue
})`
  margin-left: auto;
  margin-right: 5;
`;

class LanguageScreen extends React.PureComponent {
  state = {
    selected: this.props.language || "en"
  };

  selectLanguage = language => {
    this.setState({
      selected: language
    });
    this.props.onSelectLanguage(language);
  };

  sortLanguageOptions = (a, b) => {
    if (a[1] < b[1]) {
      return -1;
    } else if (a[1] > b[1]) {
      return 1;
    } else {
      return 0;
    }
  };

  renderLanguageOption = ([code, label], idx) => (
    <ButtonRow
      key={idx}
      border={idx !== NUM_LANGUAGES - 1}
      onPress={() => this.selectLanguage(code)}
    >
      <OptionLabel>{label}</OptionLabel>
      {this.state.selected === code && <SelectedIcon />}
    </ButtonRow>
  );

  render() {
    const { onPressBackButton } = this.props;
    return (
      <Content>
        {Object.entries(LANGUAGES)
          .sort(this.sortLanguageOptions)
          .map(this.renderLanguageOption)}
      </Content>
    );
  }
}

export default LanguageScreen;
