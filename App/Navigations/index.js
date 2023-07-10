import React, { Component } from 'react';
import { View, StatusBar, BackHandler, ActivityIndicator } from 'react-native';
import {
  createStackNavigator,
  StackActions,
  NavigationActions,
  createDrawerNavigator
} from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import { rehydration } from 'configs';

import Account from 'containers/Account';
import Cart from 'containers/Cart';
import Favorite from 'containers/Favorite';
import Home from 'containers/Home';
import Login from 'containers/Auth/Login';
import Notification from 'containers/Notification';
import Order from 'containers/Order';
import PackOrder from 'containers/PackOrder';
import CreatePackOrder from 'containers/PackOrder/CreatePackOrder';
import Register from 'containers/Auth/Register';

import SideBar from 'containers/SideBar';

export class _Auth extends Component {
  constructor() {
    super();

    this.checkAuth = this.checkAuth.bind(this);
  }

  async componentDidMount() {
    this.checkAuth();
  }

  async checkAuth() {
    await rehydration();

    if (this.props.isLogged) {
      this.resetNavigation('Home');
    } else {
      this.resetNavigation('Login');
    }
  }

  resetNavigation(routeName) {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white'
        }}>
        <ActivityIndicator />
      </View>
    );
  }
}

export const Auth = connect(state => ({
  isLogged: state.auth.isLogged
}))(_Auth);

export const AppNavigator = createStackNavigator(
  {
    Auth,
    Account,
    Cart,
    Favorite,
    Home: createDrawerNavigator(
      {
        Home
      },
      {
        contentComponent: SideBar
      }
    ),
    Login,
    Notification,
    Order,
    PackOrder,
    CreatePackOrder,
    Register
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home'
  }
);

export class AppWithNavigationState extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.nav.routes.length > 1) {
        this.props.dispatch({ type: 'GO_BACK' });
        return true;
      }
      return false;
    });
  }

  render() {
    const { dispatch, nav } = this.props;
    const addListener = createReduxBoundAddListener('root');

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle={'light-content'} />
        <AppNavigator navigation={{ dispatch, state: nav, addListener }} />
      </View>
    );
  }
}

AppWithNavigationState.propTypes = {};

const mapStateToProps = state => ({
  nav: state.nav
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWithNavigationState);
