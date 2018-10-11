import React from "react";
import PropTypes from "prop-types";
import { Dimensions } from "react-native";
import styled from "styled-components";

import { OptionList, OptionListItem } from "components/list";
import { Text } from "components/text";
import { LANGUAGES, NUM_LANGUAGES } from "utils/constants";

// ======================================================================
// Styles
// ======================================================================

const LanguageList = styled(OptionList)`
  height: ${Dimensions.get("window").height - 300};
`;
const OptionLabel = styled(Text).attrs({
  size: "large"
})`
  padding-right: 5;
`;

// ======================================================================
// Component
// ======================================================================

class LanguageSection extends React.Component {
  state = {
    selected: this.props.language || "en"
  };

  selectLanguage = language => () => {
    this.setState({
      selected: language
    });
    this.props.onSelectLanguage(language);
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

  renderLanguageOption = ([code, label], idx) => (
    <OptionListItem
      key={idx}
      border={idx !== NUM_LANGUAGES - 1}
      selected={this.state.selected === code}
      onPress={this.selectLanguage(code)}
    >
      <OptionLabel>{label}</OptionLabel>
    </OptionListItem>
  );

  render() {
    return (
      <LanguageList>
        {Object.entries(LANGUAGES)
          .sort(this.sortAlphabetical)
          .map(this.renderLanguageOption)}
      </LanguageList>
    );
  }
}

LanguageSection.propTypes = {
  language: PropTypes.string.isRequired,
  onSelectLanguage: PropTypes.func.isRequired
};

export default LanguageSection;
