import PropTypes from 'prop-types';
import React from 'react';
import { omitProps } from 'recompact';
import { Path } from 'svgs';
import styled from 'styled-components/primitives';
import { calcDirectionToDegrees, colors } from '../../../styles';
import { directionPropType } from '../../../utils';
import SvgElement from '../Svg';
import { withRotationForDirection } from 'hoc';

const Svg = styled(omitProps('direction')(SvgElement))`
  transform: rotate(${props => calcDirectionToDegrees(props.direction)}deg);
`;

const CaretThinIcon = ({ color, ...props }) => (
  <Svg
    {...props}
    height={props.height || '14'}
    width={props.width || '7'}
    viewBox="0 0 7 14"
  >
    <Path
      d="M.317 12.203a.875.875 0 1 0 1.366 1.094l4.15-5.188a1.375 1.375 0 0 0 0-1.718l-4.15-5.188A.875.875 0 1 0 .317 2.297L4.279 7.25.317 12.203z"
      fill={color}
      fillRule="nonzero"
    />
  </Svg>
);

CaretThinIcon.propTypes = {
  color: PropTypes.string,
  direction: directionPropType,
};

CaretThinIcon.defaultProps = {
  color: colors.black,
  direction: 'right',
};

export default withRotationForDirection(CaretThinIcon);
