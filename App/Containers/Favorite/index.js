import React from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import { Button, Card, Badge, Avatar } from 'react-native-elements';
import Divider from 'components/Common/Divider';
import requests from 'utils/authRequests';
import { Colors, flex, flexCol, flexInline, flexVCenter } from '../styles';
import _Const from '../const';
import { Constants } from 'configs';
import { connect } from 'react-redux';
import NavBar from 'components/Common/NavBar';
import { API_ROOT } from 'configs/API';

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.requests = [];
    this.state = {
      limit: 5,
      products: []
    };
  }

  loadMores = () => {
    this.featch(this.state.page + 1);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: 0,
      products: []
    });
    this.featch(0);
  }

  featch(page) {
    const { token } = this.props;

    const request = requests.get(
      API_ROOT + '/user/favorites',
      {
        limit: this.state.limit,
        page: page
      },
      token
    );
    this.requests.push(request);
    request
      .then(res => {
        if (res.data.status) {
          this.setState({
            products: [...this.state.products, ...res.data.favorites],
            page: page,
            total: res.data.total
          });
        }
      })
      .catch(err => {
        //alert(JSON.stringify(err))
      });
  }

  componentDidMount() {
    this.featch(0);
  }

  componentWillUnmount() {
    this.requests.forEach(request => request.cancel());
  }

  render() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View >
        <NavBar title={'Yêu thích'} hasBack />
        <Divider />
        <ScrollView style={{ height: '100%' }}>
          {this.state.products.map(product => {
            return (
              <View
                key={product.id}
                style={{
                  ...flex,
                  ...flexInline,
                  borderRadius: 2,
                  borderWidth: 1,
                  borderColor: '#eee',
                  margin: 5
                }}>
                <Avatar
                  medium
                  source={{
                    uri: product.image
                      ? `https:${product.image
                          .replace('https:', '')
                          .replace('_.webp', '')}`
                      : 'https://orders.ochivi.com/images/avatar-default.png'
                  }}
                />
                <View
                  style={{
                    ...flex,
                    ...flexVCenter,
                    marginLeft: 5,
                    marginRight: 5
                  }}>
                  <Text
                    style={{ color: Colors.primaryColor, fontWeight: 'bold' }}>
                    {product.name}
                  </Text>
                  <Text>
                    Giá tiền:{' '}
                    <Text
                      style={{ color: Colors.mainColor, fontWeight: 'bold' }}>
                      ¥ {product.price}
                    </Text>
                  </Text>
                </View>
              </View>
            );
          })}
          {this.state.total > this.state.products.length && (
            <Button
              style={{ margin: 10 }}
              backgroundColor={Colors.mainColor}
              buttonStyle={{
                borderRadius: 5,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0
              }}
              onPress={this.loadMores}
              title="Xem thêm"
            />
          )}
        </ScrollView>
      </View>
        </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  user: state.auth.user
});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen);
