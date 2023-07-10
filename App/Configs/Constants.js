import { Platform, Dimensions, StatusBar } from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window');

export function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
      (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT))
  );
}

export function getStatusBarHeight() {
  return Platform.select({
    ios: isIphoneX() ? 40 : 20,
    android: 0
  });
}

export const Constants = {
  shadow: Platform.select({
    ios: {
      backgroundColor: 'white',
      shadowColor: '#aaa',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 5
    },
    android: {
      backgroundColor: 'white',
      elevation: 2
    }
  }),
  paddingTop: getStatusBarHeight(),
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};
