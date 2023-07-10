import React, { Component } from 'react';
import {
  Platform,
  BackHandler,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import AppWithNavigationState from './App/Navigations';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import reducers from 'reducers';
import sagas from 'sagas';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import storage from 'redux-persist/lib/storage';
import { axiosDebugger } from 'utils';
import axios from 'axios';
import 'utils/formatMoney';
import { Colors } from 'configs';

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const persistedReducer = persistReducer(persistConfig, reducers);
let rehydrationComplete;
const rehydrationPromise = new Promise((resolve, reject) => {
  rehydrationComplete = resolve;
});

export function rehydration() {
  return rehydrationPromise;
}

export default class App extends Component {
  constructor(props) {
    super(props);

    const sagaMiddleware = createSagaMiddleware();
    const store = compose(applyMiddleware(sagaMiddleware, middleware))(
      createStore
    )(
      persistedReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    this.store = store;
    persistStore(store, {}, () => {
      rehydrationComplete();

      const { token } = store.getState().auth;
      if (token) {
        axios.defaults.headers.common.Authorization = 'Bearer ' + token;
      }
    });
    sagaMiddleware.run(sagas);
    axiosDebugger();

    TouchableOpacity.defaultProps.activeOpacity = 0.8;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.store.dispatch({ type: 'GO_BACK' });
      return true;
    });

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(Colors.Primary);
      StatusBar.setBarStyle('light-content');
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
