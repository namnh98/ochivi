import React, { Component } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  View,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Colors, flex, flexVCenter, flexCenter } from '../styles';
import IconInput from 'components/Common/IconInput';
import Button from 'components/Common/Button';
import FullWidthImage from 'components/Common/FullWidthImage';
import Back from 'components/Common/BackDefault';

import { connect } from 'react-redux';
import { Constants } from 'configs';

import { login, getLocations } from 'actions/auth';
import { goHomeReset, goRegister } from 'actions/nav';

import imgUser from 'images/User.png';
import imgPassword from 'images/Password.png';
import imgLogo from 'images/Logo.png';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null
    };
  }

  componentDidMount() {
    this.props.getLocations();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  onSignupPress = () => {
    Linking.openURL('https://orders.ochivi.com/register');
  };

  onLoginPress = () => {
    const { username, password } = this.state;
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin đăng nhập');
    } else {
      this.props.login({ username, password });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isLogging && !this.props.isLogging) {
      if (this.props.isLogged) {
        this.props.goHomeReset();
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập hoặc mật khẩu không chính xác');
      }
    }
  }

  onChangeText = field => value => {
    this.setState({ [field]: value });
  };

  render() {
    const { isLogging } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            enabled={Platform.OS === 'ios'}
            behavior={'padding'}
            style={{ flex: 1 }}>
            <Back imageStyle={{ tintColor: 'black' }} />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: 32
              }}>
              <View style={{ flexDirection: 'row', padding: 24 }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1.5 }}>
                  <FullWidthImage
                    style={{ backgroundColor: 'white' }}
                    source={imgLogo}
                    ratio={0.276}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ paddingVertical: 32 }}>
                <IconInput
                  icon={imgUser}
                  placeholder={'Tên đăng nhập'}
                  onChangeText={this.onChangeText('username')}
                />
                <IconInput
                  icon={imgPassword}
                  placeholder={'Mật khẩu'}
                  inputProps={{ secureTextEntry: true }}
                  onChangeText={this.onChangeText('password')}
                />
                <Button
                  onPress={this.onLoginPress}
                  text={'ĐĂNG NHẬP'}
                  style={{ marginTop: 15 }}
                  isLoading={isLogging}
                />
                <Button
                  onPress={this.props.goRegister}
                  text={'ĐĂNG KÝ'}
                  style={{
                    backgroundColor: 'white',
                    borderColor: Colors.primaryColor,
                    borderWidth: 1,
                    marginTop: 15
                  }}
                  textStyle={{ color: Colors.primaryColor }}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  isLogged: state.auth.isLogged,
  isLogging: state.auth.isLogging,
  token: state.auth.token
});
const mapDispatchToProps = {
  getLocations,
  goHomeReset,
  goRegister,
  login
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
