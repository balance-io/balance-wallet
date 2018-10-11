import React from "react";
import { Dimensions } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components";

import { OptionList, OptionListItem } from "components/list";
import { Text } from "components/text";
import Icon from "components/icons/Icon";
import { CURRENCIES, NUM_CURRENCIES } from "utils/constants";

// ======================================================================
// Styles
// ======================================================================

const CurrencyList = styled(OptionList)`
  height: ${Dimensions.get("window").height - 300};
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

// ======================================================================
// Component
// ======================================================================

class CurrencySection extends React.Component {
  state = {
    selected: this.props.nativeCurrency || "USD"
  };

  selectCurrency = nativeCurrency => () => {
    this.setState({
      selected: nativeCurrency
    });
    this.props.onSelectCurrency(nativeCurrency);
  };

  sortAlphabetical = (a, b) => {
    if (a[1] < b[1]) {
      return -1;
    } else if (a[1] > b[1]) {
      return 1;
    } else {
      return 0;
    }
  };

  renderCurrencyIcon = nativeCurrency => {
    switch (nativeCurrency) {
      case "BTC":
        return <CurrencyIcon name="btc" color="#FF9900" />;

      case "ETH":
        return <CurrencyIcon name="eth" color="#1E2022" />;

      default:
        return null;
    }
  };

  renderCurrencyOption = ([nativeCurrency, label], idx) => (
    <OptionListItem
      key={idx}
      border={idx !== NUM_CURRENCIES - 1}
      selected={this.state.selected === nativeCurrency}
      onPress={this.selectCurrency(nativeCurrency)}
    >
      {this.renderCurrencyIcon(nativeCurrency)}
      <OptionLabel>{label}</OptionLabel>
    </OptionListItem>
  );

  render() {
    return (
      <CurrencyList>
        {Object.entries(CURRENCIES)
          .sort(this.sortAlphabetical)
          .map(this.renderCurrencyOption)}
      </CurrencyList>
    );
  }
}

CurrencySection.propTypes = {
  nativeCurrency: PropTypes.string.isRequired,
  onSelectCurrency: PropTypes.func.isRequired
};

export default CurrencySection;
