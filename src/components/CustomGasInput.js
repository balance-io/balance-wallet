import Dialog from 'react-native-dialog';

const CustomGasInput = ({visible, onCancel, handleUpdate}) => (
  <Dialog.Container visible={visible}>
    <Dialog.Title>Custom Gas</Dialog.Title>
    <Dialog.Description>
      Please enter custom gas price and gas limit.
    </Dialog.Description>
    <Dialog.Input label="Gas price" />
    <Dialog.Input label="Gas limit" />
    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
    <Dialog.Button label="Okay" onPress={this.handleUpdate} />
  </Dialog.Container>
);

export default CustomGasInput;
