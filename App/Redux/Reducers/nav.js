import { AppNavigator } from 'navigations';
import { NavigationActions, StackActions } from 'react-navigation';

// export Account = () => ({ type: 'GO_ACCOUNT' });
// export Cart = () => ({ type: 'GO_CART' });
// export Favorite = () => ({ type: 'GO_FAVORITE' });
// export Notification = () => ({ type: 'GO_NOTIFICATION' });
// export Order = () => ({ type: 'GO_ORDER' });

export const nav = {
  GO_HOME: 'Home',
  GO_ACCOUNT: 'Account',
  GO_CART: 'Cart',
  GO_FAVORITE: 'Favorite',
  GO_NOTIFICATION: 'Notification',
  GO_ORDER: 'Order',
  GO_REGISTER: 'Register',
  GO_LOGIN: 'Login',
  GO_PACK_ORDER: 'PackOrder',
  GO_CREATE_PACK_ORDER: 'CreatePackOrder'
};

export default (state, action) => {
  let nextState = AppNavigator.router.getStateForAction(action, state);

  let isNavigateWithoutParams = false;
  switch (action.type) {
    case 'GO_BACK':
      isNavigateWithoutParams = false;

      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;

    case 'GO_HOME':
      isNavigateWithoutParams = true;
      break;

    case 'GO_ACCOUNT':
      isNavigateWithoutParams = true;
      break;

    case 'GO_CART':
      isNavigateWithoutParams = true;
      break;

    case 'GO_FAVORITE':
      isNavigateWithoutParams = true;
      break;

    case 'GO_NOTIFICATION':
      isNavigateWithoutParams = true;
      break;

    case 'GO_ORDER':
      isNavigateWithoutParams = true;
      break;

    case 'GO_REGISTER':
      isNavigateWithoutParams = true;
      break;

    case 'GO_LOGIN':
      isNavigateWithoutParams = true;
      break;

    case 'GO_PACK_ORDER':
      isNavigateWithoutParams = true;
      break;

    case 'GO_CREATE_PACK_ORDER':
        isNavigateWithoutParams = true;
        break;

    case 'GO_HOME_RESET':
      nextState = AppNavigator.router.getStateForAction(
        StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'Home' })]
        }),
        state
      );
      return nextState;

    case 'GO_LOGIN_RESET':
      nextState = AppNavigator.router.getStateForAction(
        StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'Login' })]
        }),
        state
      );
      return nextState;

    default:
      break;
  }

  if (isNavigateWithoutParams) {
    nextState = AppNavigator.router.getStateForAction(
      NavigationActions.navigate({ routeName: nav[action.type] }),
      state
    );
  }

  return nextState || state;
};
