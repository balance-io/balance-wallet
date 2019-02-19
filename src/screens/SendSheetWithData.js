import { withSendComponentWithData } from 'balance-common';
import { compose } from 'recompact';
import SendSheet from './SendSheet';
import { sendTransaction } from '../model/wallet';

const SendSheetWithData = withSendComponentWithData(SendSheet, {
  gasFormat: 'short',
  sendTransactionCallback: sendTransaction,
});

SendSheetWithData.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;

  return {
    effect: 'sheet',
    gestureResponseDistance: {
      vertical: params && params.verticalGestureResponseDistance,
    },
  };
};

export default SendSheetWithData;


// const SendSheetWithData = compose(
//   withState('isAuthorizing')
// )(withSendComponentWithData(SendSheet, {
//   gasFormat: 'short',
//   sendTransactionCallback: async (test) => {
//     const tx = await sendTransaction(test);
//     console.log('sendTransactionCallback', tx);

//     return tx;
//   },
// }));
