import { connect } from "react-redux";
// import { accountChangeLanguage } from "/Users/loganbernard/Documents/freelance/balance/balance-common/dist";
import { accountChangeLanguage } from "balance-common";

const mapStateToProps = ({ account }) => ({
  account
});

export default Component =>
  connect(
    mapStateToProps,
    {
      accountChangeLanguage
    }
  )(Component);
