import React from "react";
import { Modal, WebView, Dimensions } from "react-native";

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

class WebViewScreen extends React.PureComponent {
  render() {
    const { navigation } = this.props;
    const uri = navigation.getParam("uri", "https://balance.io");

    return (
      <Modal visible={true}>
        <WebView
          source={{ uri }}
          style={{ height: ScreenHeight, width: ScreenWidth }}
        />
      </Modal>
    );
  }
}

export default WebViewScreen;
