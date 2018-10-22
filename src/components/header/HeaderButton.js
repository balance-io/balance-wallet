import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { padding } from '../../styles';
import { ButtonPressAnimation } from '../buttons';
import { Flex } from '../layout';

const Container = styled(Flex)`
  ${padding(10)};
`;

<<<<<<< HEAD
const HeaderButton = ({
  children,
  onPress,
  transformOrigin,
  ...props
}) => (
  <ButtonPressAnimation onPress={onPress} transformOrigin={transformOrigin}>
    <Container {...props}>
      {children}
    </Container>
=======
const HeaderButton = ({ children, onPress, ...props }) => (
  <ButtonPressAnimation onPress={onPress}>
    <Container {...props}>{children}</Container>
>>>>>>> prettier config
  </ButtonPressAnimation>
);

HeaderButton.propTypes = {
  ...ButtonPressAnimation.propTypes,
  children: PropTypes.node,
  onPress: PropTypes.func.isRequired,
};

export default HeaderButton;
