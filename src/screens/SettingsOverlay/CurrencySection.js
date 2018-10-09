import React, { Component } from "react";
import { ScrollView, Dimensions } from "react-native";
import styled from "styled-components";
import { Column, Row, Page } from "../../components/layout";
import { BackButton } from "../../components/header";
import { ButtonRow } from "../../components/buttons";
import { Text } from "../../components/text";
import Icon from "../../components/icons/Icon";
import { colors, fonts, padding } from "../../styles";
import { CURRENCIES, NUM_CURRENCIES } from "../../utils/constants";

const Content = styled(ScrollView)`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  height: ${Dimensions.get("window").height - 300};
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
  display: flex;
  align-items: center;
  padding-right: 5;
`;

const CurrencyIcon = styled(Icon)`
  height: 20;
  width: 20;
  margin-right: 5;
`;

const SelectedIcon = styled(Icon).attrs({
  name: "checkmarkCircled",
  color: colors.appleBlue
})`
  margin-left: auto;
`;

class CurrencyScreen extends React.PureComponent {
  state = {
    selected: this.props.currency || "USD"
  };

  selectCurrency = currency => {
    this.setState({
      selected: currency
    });
    this.props.onSelectCurrency(currency);
  };

  sortCurrencyOptions = (a, b) => {
    if (a[1] < b[1]) {
      return -1;
    } else if (a[1] > b[1]) {
      return 1;
    } else {
      return 0;
    }
  };

  renderCurrencyIcon = currency => {
    switch (currency) {
      case "BTC":
        return <CurrencyIcon name="btc" color="#FF9900" />;

      case "ETH":
        return <CurrencyIcon name="eth" color="#1E2022" />;

      default:
        return null;
    }
  };

  renderCurrencyOption = ([currency, label], idx) => (
    <ButtonRow
      key={idx}
      border={idx !== NUM_CURRENCIES - 1}
      onPress={() => this.selectCurrency(currency)}
    >
      {this.renderCurrencyIcon(currency)}
      <OptionLabel>{label}</OptionLabel>
      {this.state.selected === currency && <SelectedIcon />}
    </ButtonRow>
  );

  render() {
    return (
      <Content>
        {Object.entries(CURRENCIES)
          .sort(this.sortCurrencyOptions)
          .map(this.renderCurrencyOption)}
      </Content>
    );
  }
}

export default CurrencyScreen;
