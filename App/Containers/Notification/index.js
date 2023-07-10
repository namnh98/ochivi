import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import { WebView } from 'react-native-webview';
import { flex, flexCenter, flexVCenter, Colors } from '../styles';
import Divider from 'components/Common/Divider';
import { Constants } from 'configs';
import { connect } from 'react-redux';
import NavBar from 'components/Common/NavBar';

class Screen extends React.Component {
  render() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <NavBar title={'Thông báo'} hasBack />
        <Divider />
        <View style={{ ...flex }}>
          <WebView
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0
            }}
            source={{ uri: 'https://ochivi.com/thong-bao-mobile-app' }}
          />
        </View>
      </View>
        </SafeAreaView>
    );
  }
}

export default Screen;
