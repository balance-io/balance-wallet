import { connect } from "react-redux";
import {
  accountChangeLanguage,
  accountChangeNativeCurrency
} from "balance-common";

const mapStateToProps = ({ account }) => ({
  account
});

export default Component =>
  connect(
    mapStateToProps,
    {
      accountChangeLanguage,
      accountChangeNativeCurrency
    }
  )(Component);
