import { mapProps } from 'recompact';
import { calcDirectionToDegrees } from '../styles';

export default Component =>
  mapProps(({ direction, style, ...props }) => ({
    direction,
    ...props,
    style: {
      ...style,
      transform: [{ rotate: `${calcDirectionToDegrees(direction)}deg` }],
    },
  }))(Component);
