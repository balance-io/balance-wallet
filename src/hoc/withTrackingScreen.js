import Matomo from 'react-native-matomo';
import { compose, lifecycle } from 'recompact';
import { getDisplayName } from 'recompose';

export default Component => compose(
  lifecycle({
    componentDidMount() {
      const displayName = getDisplayName(Component);
      Matomo.trackScreen(displayName, displayName);
    },
  }),
)(Component);
