import React, { Component } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { Colors, flex, flexVCenter, flexCenter } from '../styles';
import IconInput from 'components/Common/IconInput';
import Button from 'components/Common/Button';
import FullWidthImage from 'components/Common/FullWidthImage';
import Select from 'components/Common/Select';
import Date from 'components/Common/Date';
import Back from 'components/Common/BackDefault';

import { connect } from 'react-redux';
import { Constants } from 'configs';

import { register } from 'actions/auth';
import { goHomeReset, goBack } from 'actions/nav';

import imgUser from 'images/User.png';
import imgPassword from 'images/Password.png';
import imgLogo from 'images/Logo.png';

export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      re_password: '',
      fullname: '',
      address: '',
      phone: '',
      gender: '',
      dob: '',
      location: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  onSignupPress = () => {
    const { username, password, re_password, dob } = this.state;
    // || !dob
    if (!username || !password ) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    } else if (password != re_password) {
      Alert.alert('Lỗi', 'Xác nhận mật khẩu không chính xác');
    } else {
      this.props.register(this.state);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isRegistering && !this.props.isRegistering) {
      if (this.props.isLogged) {
        this.props.goHomeReset();
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập đã được sử dụng');
      }
    }
  }

  onChangeText = field => value => {
    this.setState({ [field]: value });
  };

  render() {
    const { isRegistering } = this.props;
    const locations = this.props.locations.map(item => ({
      label: item.name,
      value: item.id
    }));
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            enabled={Platform.OS === 'ios'}
            behavior={'padding'}
            style={{ flex: 1 }}>
            <View style={{}}>
              <View style={{ flexDirection: 'row', paddingVertical: 24 }}>
                <View style={{ flex: 1 }}>
                  <Back imageStyle={{ tintColor: 'black' }} />
                </View>
                <View style={{ flex: 1.5 }}>
                  <FullWidthImage
                    style={{ backgroundColor: 'white' }}
                    source={imgLogo}
                    ratio={0.276}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>
            </View>

            <ScrollView style={{ flex: 1 }}>
              <View style={{ paddingVertical: 10, paddingHorizontal: 24 }}>
                <Text style={styles.text}>Tên đăng nhập</Text>
                <IconInput
                  containerStyle={{ paddingVertical: 0 }}
                  textInputStyle={styles.textInput}
                  onChangeText={this.onChangeText('username')}
                />
                <Text style={styles.text}>Mật khẩu</Text>
                <IconInput
                  secureTextEntry
                  containerStyle={{ paddingVertical: 0 }}
                  textInputStyle={styles.textInput}
                  onChangeText={this.onChangeText('password')}
                />
                <Text style={styles.text}>Xác nhận mật khẩu</Text>
                <IconInput
                  secureTextEntry
                  containerStyle={{ paddingVertical: 0 }}
                  textInputStyle={styles.textInput}
                  onChangeText={this.onChangeText('re_password')}
                />
                <Text style={styles.text}>Họ & tên</Text>
                <IconInput
                  containerStyle={{ paddingVertical: 0 }}
                  textInputStyle={styles.textInput}
                  onChangeText={this.onChangeText('fullname')}
                />
                <Text style={styles.text}>Địa chỉ</Text>
                <IconInput
                  containerStyle={{ paddingVertical: 0 }}
                  textInputStyle={styles.textInput}
                  onChangeText={this.onChangeText('address')}
                />
                <Text style={styles.text}>Số điện thoại</Text>
                <IconInput
                  containerStyle={{ paddingVertical: 0 }}
                  textInputStyle={styles.textInput}
                  onChangeText={this.onChangeText('phone')}
                />
                {/* <Text style={styles.text}>Giới tính</Text>
                <Select
                  items={[
                    {
                      label: 'Nam',
                      value: 'male'
                    },
                    {
                      label: 'Nữ',
                      value: 'female'
                    }
                  ]}
                  placeholder={'Chọn giới tính'}
                  onChange={this.onChangeText('gender')}
                />
                <Text style={styles.text}>Ngày sinh</Text>
                <Date onChange={this.onChangeText('dob')} /> */}
                <Text style={styles.text}>Chi nhánh</Text>
                <Select
                  items={locations}
                  placeholder={'Chọn chi nhánh'}
                  onChange={this.onChangeText('location')}
                />
                <TouchableOpacity onPress={() => Linking.openURL('https://ochivi.com/dieu-khoan-mobile-app')}>
                  <Text style={styles.terms}>
                    Bấm đăng ký là bạn đã đồng ý với 
                    <Text style={styles.bold}> Điều khoản sử dụng </Text>
                    của chúng tôi
                  </Text>
                </TouchableOpacity>
                <Button
                  isLoading={isRegistering}
                  onPress={this.onSignupPress}
                  text={'ĐĂNG KÝ'}
                  style={{ marginTop: 15 }}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#c0c0c0'
  },
  select: {
    fontSize: 16
  },
  textInput: {
    marginTop: 5,
    paddingHorizontal: 0,
    paddingVertical: 5,
    color: '#111',
    fontSize: 16
  },
  terms: {
    paddingHorizontal: 0,
    paddingVertical: 5,
    fontSize: 16,
    color: '#c0c0c0'
  },
  bold: {
    color: '#111',
    fontSize: 16
  }
});

const mapStateToProps = state => ({
  isLogged: state.auth.isLogged,
  isRegistering: state.auth.isRegistering,
  registerSuccess: state.auth.registerSuccess,
  token: state.auth.token,
  locations: state.auth.locations
});
const mapDispatchToProps = {
  goHomeReset,
  register,
  goBack
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
