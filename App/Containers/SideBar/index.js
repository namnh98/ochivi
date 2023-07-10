import React from 'react';
import {
  SafeAreaView,
  Linking,
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';
import { Avatar, Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  flexCenter,
  Colors,
  flexVCenter,
  flexInline,
  padding510,
  padding1020,
  padding1520,
  flex
} from '../styles';
import Divider from 'components/Common/Divider';
import Storage from 'react-native-expire-storage';
import { connect } from 'react-redux';
import { Constants } from 'configs';

var md5 = require('md5');

import {
  goAccount,
  goOrder,
  goCart,
  goFavorite,
  goNotification,
  goLoginReset,
  toggleDrawer,
  goHomeReset,
  goPackOrder
} from 'actions/nav';
import { logout } from 'actions/auth';

export class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  logOut() {
    this.props.logout();
    this.props.goHomeReset();
  }

  openAccount = () => {
    this.props.goAccount();
  };

  render() {
    console.log(this.props)
    const { user = {} } = this.props;
    //const { state } = this.props.navigation
    //const { index, routes } = state
    const screens = [
      {
        key: 'Order',
        name: 'Đơn hàng',
        drawerIcon: 'tag',
        onGoScreen: this.props.goOrder
      },
      {
        key: 'Cart',
        name: 'Giỏ hàng',
        drawerIcon: 'shopping-cart',
        onGoScreen: this.props.goCart
      },
      {
        key: 'PackOrder',
        name: 'Đơn hàng gửi',
        drawerIcon: 'tag',
        onGoScreen: this.props.goPackOrder
      },
      {
        key: 'Favorites',
        name: 'Yêu thích',
        drawerIcon: 'heart',
        onGoScreen: this.props.goFavorite
      },
      {
        key: 'Notifications',
        name: 'Thông báo',
        drawerIcon: 'bell',
        onGoScreen: this.props.goNotification
      }
    ];

    const pages = [
      //{key: 'support', name: 'Hướng dẫn', url: "https://ochivi.com/huong-dan-mobile-app"},
      {
        key: 'price',
        name: 'Bảng giá',
        url: 'https://ochivi.com/bang-gia-mobile-app'
      },
      {
        key: 'contact',
        name: 'Liên hệ',
        url: 'https://ochivi.com/lien-he-mobile-app'
      },
      {
        key: 'about',
        name: 'Giới thiệu',
        url: 'https://ochivi.com/gioi-thieu-mobile-app'
      },
      {
        key: 'policy',
        name: 'Điều khoản',
        url: 'https://ochivi.com/dieu-khoan-mobile-app'
      }
    ];

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#26344B'
        }}>
        <TouchableOpacity
          onPress={this.openAccount}
          style={{
            // backgroundColor: 'white',
            paddingTop: Constants.paddingTop,
            padding: 20,
            // alignItems: 'center',
            // justifyContent: 'center'
            borderBottomColor: '#2B3B55',
            borderBottomWidth: 1,
          }}>
          {user.username ? (
            <Avatar
              rounded
              medium
              source={{
                uri: `https://www.gravatar.com/avatar/${md5(
                  user.username.toLocaleLowerCase().trim()
                )}`
              }}
              activeOpacity={0.7}
            />
          ) : null}
          <Text
            style={{
              fontWeight: 'bold',
              color: '#FFFFFF',
              fontSize: 20,
              marginTop: 10,
              marginBottom: 10
            }}>
            { user.fullname || user.username || user.email }
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ color: Colors.primaryColor }}>Số dư cuối</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.primaryColor,
                }}>
                {(user.balance || 0).formatMoney(2, ',', '.')}{' '}
                <Text style={{ fontSize: 14, fontWeight: 'normal' }}>VNĐ</Text>
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 14, color: '#1BBC9B' }}>Tổng tiền nạp</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={{
                  color: '#1BBC9B',
                  fontSize: 14
                }}>
                {(user.amount || 0).formatMoney(2, ',', '.')}{' '}
                <Text style={{ fontSize: 14, fontWeight: 'normal' }}>VNĐ</Text>
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <ScrollView style={{ height: '100%', flex: 1 }}>
          {screens.map(route => {
            return (
              <View
                key={route.key}
                style={{ borderBottomColor: '#2B3B55', borderBottomWidth: 1 }}>
                <TouchableOpacity
                  style={{
                    ...flexInline,
                    ...flexCenter,
                    width: '100%',
                    ...padding1520
                  }}
                  onPress={() => {
                    this.props.toggleDrawer();
                    route.onGoScreen();
                  }}>
                  <Icon
                    size={14}
                    name={route.drawerIcon}
                    style={{
                      width: 14,
                      color: '#FFFFFF',
                      marginRight: 14
                    }}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14
                    }}>
                    {route.name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
          <View style={{}}>
            {pages.map(page => {
              return (
                <View key={page.key} style={{ borderBottomColor: '#2B3B55', borderBottomWidth: 1 }}>
                  <TouchableOpacity
                    style={{
                      ...flexInline,
                      ...flexCenter,
                      width: '100%',
                      ...padding1520
                    }}
                    onPress={() => Linking.openURL(page.url)}>
                    <Icon
                      size={14}
                      name="arrow-right"
                      style={{
                        width: 14,
                        color: '#FFFFFF',
                        marginRight: 14
                      }}
                    />
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 14
                      }}>
                      {page.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={{
              borderBottomColor: '#2B3B55',
              borderBottomWidth: 1,
              ...flexInline,
              ...flexCenter,
              width: '100%',
              ...padding1520
            }}
            onPress={() => this.logOut()}>
            <Icon
              size={14}
              name="sign-out"
              style={{
                width: 14,
                color: '#FFFFFF',
                marginRight: 14,
              }}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 14
              }}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token
});
const mapDispatchToProps = {
  goAccount,
  goOrder,
  goCart,
  goFavorite,
  goNotification,
  goLoginReset,
  logout,
  goHomeReset,
  toggleDrawer,
  goPackOrder
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
