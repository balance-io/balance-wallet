import React, { PureComponent } from "react";
import { View, NetInfo } from "react-native";
import styled from "styled-components";

import Icon from "components/icons/Icon";
import { Text } from "components/text";
import { colors, padding } from "styles";

const Badge = styled(View)`
  position: absolute;
  align-self: center;
  bottom: 40;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${padding(10)};
  background: ${colors.dark};
  border-radius: 50;
  shadow-color: ${colors.dark};
  shadow-opacity: 0.14;
  shadow-offset: 0px 6px;
  shadow-radius: 10;
  z-index: 100;
`;

const BadgeIcon = styled(Icon).attrs({
  color: colors.white
})`
  margin-bottom: -3px;
`;

const BadgeLabel = styled(Text).attrs({
  size: "smedium",
  weight: "semibold",
  color: colors.white
})`
  margin-left: 5px;
`;

class OfflineBadge extends PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };

  render() {
    if (this.state.isConnected) {
      return null;
    }

    return (
      <Badge>
        <BadgeIcon name="offline" />
        <BadgeLabel>Offline</BadgeLabel>
      </Badge>
    );
  }
}

export default OfflineBadge;
