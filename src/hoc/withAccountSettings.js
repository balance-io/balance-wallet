import { connect } from "react-redux";
import {
  accountChangeLanguage,
  accountChangeNativeCurrency
} from "balance-common";

const mapStateToProps = ({ account }) => ({
  language: account.language,
  nativeCurrency: account.nativeCurrency,
  accountAddress: account.accountAddress.toLowerCase()
});

export default Component =>
  connect(
    mapStateToProps,
    {
      accountChangeLanguage,
      accountChangeNativeCurrency
    }
  )(Component);
