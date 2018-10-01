import React, { Component } from "react";
import styled from "styled-components";
import { Column, Row, Page } from "../components/layout";
import { BackButton } from "../components/header";
import { ButtonRow } from "../components/buttons";
import { Text } from "../components/text";
import { colors, fonts, padding } from "../styles";

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
})``;

const LanguageScreen = ({ onPressBackButton }) => (
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

      <ButtonRow>
        <OptionLabel>Deutsch</OptionLabel>
      </ButtonRow>
      <ButtonRow>
        <OptionLabel>English</OptionLabel>
      </ButtonRow>
      <ButtonRow>
        <OptionLabel>Español</OptionLabel>
      </ButtonRow>
    </Content>
  </Page>
);

export default LanguageScreen;
