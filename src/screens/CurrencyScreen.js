import React, { Component } from "react";
import styled from "styled-components";
import { Column, Row, Page } from "../components/layout";
import { BackButton } from "../components/header";
import { ButtonRow } from "../components/buttons";
import { Text } from "../components/text";
import Icon from "../components/icons/Icon";
import { colors, fonts, padding } from "../styles";
import { CURRENCIES } from "../utils/constants";

const Content = styled(Column)`
  ${padding(0, 24)};
`;

const CurrencyTitle = styled(Text).attrs({
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

class CurrencyScreen extends React.PureComponent {
  state = {
    selected: CURRENCIES[0].value
  };

  selectCurrency = currency => {
    this.setState({
      selected: currency
    });
  };

  sortCurrencyOptions = (a, b) => {
    if (a.label < b.label) {
      return -1;
    } else if (a.label > b.label) {
      return 1;
    } else {
      return 0;
    }
  };

  renderCurrencyOption = ({ label, value }, idx) => (
    <ButtonRow key={idx} onPress={() => this.selectCurrency(value)}>
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
          <CurrencyTitle weight="semibold" size="big">
            Currency
          </CurrencyTitle>

          {CURRENCIES.sort(this.sortCurrencyOptions).map(
            this.renderCurrencyOption
          )}
        </Content>
      </Page>
    );
  }
}

export default CurrencyScreen;
