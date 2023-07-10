import React from 'react';
import {ScrollView, Text, View, RefreshControl, SafeAreaView} from 'react-native';
import { Button, Card, Badge, Avatar } from 'react-native-elements';
import Divider from 'components/Common/Divider';
import requests from 'utils/authRequests';
import {
  Colors,
  flex,
  flexCol,
  flexInline,
  flexVCenter,
  flexCenter
} from '../styles';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast, { DURATION } from 'react-native-easy-toast-fixed';
import _Const from '../const';
import { connect } from 'react-redux';
import NavBar from 'components/Common/NavBar';
import { API_ROOT } from 'configs/API';

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.requests = [];
    this.state = {
      limit: 5,
      orders: [],
      refreshing: false
    };
  }

  loadMores = () => {
    this.featchOrders(this.state.page + 1);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: 0,
      orders: []
    });
    this.featchOrders(0);
  }

  featchOrders(page) {
    this.state.refreshing = true;
    const { token } = this.props;
    const request = requests.get(
      API_ROOT + '/user/orders',
      {
        limit: this.state.limit,
        page: page
      },
      token
    );
    this.requests.push(request);
    request
      .then(res => {
        if (res.data.status && res.data.data) {
          this.setState({
            orders: [...this.state.orders, ...res.data.data.orders],
            page: page,
            total: res.data.data.total
          });
        }
        this.setState({refreshing: false});
      })
      .catch(err => {
        //alert(JSON.stringify(err))
        this.setState({refreshing: false});
      });
  }

  prePaidOrder = code => {
    const { token } = this.props;
    console.log({ code }, token);
    requests
      .post(
        API_ROOT + '/orders/status',
        null,
        {
          code: code
        },
        token
      )
      .then(res => {
        this.refs.toast.show(res.data.message);
        if (res.data.status) {
          this.setState({
            page: 0,
            orders: []
          });
          this.featchOrders(0);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  cancelOrder = code => {
    const { token } = this.props;

    requests
      .post(API_ROOT + `/orders/delete_order/${code}`, null, null, token)
      .then(res => {
        this.refs.toast.show(res.data.message);
        if (res.data.status) {
          this.setState({
            page: 0,
            orders: []
          });
          this.featchOrders(0);
        }
      })
      .catch(err => {});
  };

  componentDidMount() {
    this.featchOrders(0);
  }

  componentWillUnmount() {
    this.requests.forEach(request => request.cancel());
  }

  render() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View>
        <NavBar title={'Đơn hàng'} hasBack />
        <Divider />
        <ScrollView style={{ height: '100%' }} refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={()=>{
            this.setState({
            page: 0,
            orders: []
           });
            this.featchOrders(0);
            }}/>}>
          {this.state.orders &&
            this.state.orders.map(order => {
              return (
                <Card key={order.id}>
                  <View style={{ ...flex, ...flexInline, marginBottom: 2 }}>
                    <Badge
                      containerStyle={{
                        ...flex,
                        backgroundColor: Colors.mainColor
                      }}>
                      <Text style={{ color: '#fff' }}>
                        #{order.code || order.auto_code}
                      </Text>
                    </Badge>
                    </View>
                    <View style={{ ...flex, ...flexInline }}>
                    <Badge
                      containerStyle={{
                        ...flex,
                        marginLeft: 0,
                        backgroundColor: Colors.status(order.status)
                      }}>
                      <Text style={{ color: '#fff' }}>
                        Trạng thái: {_Const.status(order.status)}
                      </Text>
                    </Badge>
                  </View>
                  <Divider style={{ marginTop: 5 }} />
                  <View style={{ padding: 5 }}>
                    {order.products.length > 0 &&
                      order.products.map(product => {
                        return (
                          <View
                            key={product.id}
                            style={{ ...flex, ...flexInline }}>
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
                            <View style={{ ...flex, marginLeft: 10 }}>
                              <Text>
                                Sản phẩm:{' '}
                                <Text style={{ opacity: 0.8, color: '#222' }}>
                                  {product.name}
                                </Text>
                              </Text>
                              <Text>
                                Ghi chú:{' '}
                                <Text style={{ opacity: 0.8, color: '#222' }}>
                                  {product.note}
                                </Text>
                              </Text>
                              <Text style={{ fontWeight: 'bold' }}>
                                Tổng tiền:{' '}
                                {(
                                  product.price * product.number_product +
                                  order.check_price +
                                  order.secure_money
                                ).formatMoney(2, ',', '.')}{' '}
                                VNĐ
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                  </View>
                  <View
                    style={{
                      padding: 5,
                      ...flexInline,
                      ...flexVCenter,
                      ...flexCenter
                    }}>
                    <Button
                      backgroundColor={Colors.primaryColor}
                      onPress={() =>
                        this.setState({ orderShowing: order.auto_code })
                      }
                      title="Chi tiết"
                      buttonStyle={{
                        borderRadius: 5,
                        paddingTop: 2,
                        paddingBottom: 2,
                        ...flex
                      }}
                    />
                    {order.status == 2 && (
                      <Button
                        backgroundColor={Colors.mainColor}
                        buttonStyle={{
                          borderRadius: 5,
                          paddingTop: 2,
                          paddingBottom: 2,
                          ...flex
                        }}
                        onPress={() => {
                          this.setState({
                            prePaidCode: order.auto_code,
                            showPrePaidAlert: true
                          });
                        }}
                        title="Đặt cọc"
                      />
                    )}
                    {order.status <= 2 && order.status != 0 && (
                      <Button
                        backgroundColor="red"
                        buttonStyle={{
                          borderRadius: 5,
                          paddingTop: 2,
                          paddingBottom: 2,
                          ...flex
                        }}
                        title="Hủy đơn"
                        onPress={() => {
                          this.setState({
                            cancleCode: order.auto_code,
                            showCancelAlert: true
                          });
                        }}
                      />
                    )}
                  </View>
                  {this.state.orderShowing == order.auto_code && (
                    <View>
                      <Divider style={{ marginBottom: 5 }} />
                      <Text style={{ textAlign: 'right' }}>
                        Phí dịch vụ:{' '}
                        {(order.check_price || 0).formatMoney(2, ',', '.')} VNĐ
                      </Text>
                      <Text style={{ textAlign: 'right' }}>
                        Phí nội địa:{' '}
                        {(order.secure_money || 0).formatMoney(2, ',', '.')} VNĐ
                      </Text>
                      <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>
                        Đã thanh toán:{' '}
                        {(order.deposit || 0).formatMoney(2, ',', '.')} VNĐ
                      </Text>
                    </View>
                  )}
                  {/*
              <Divider style={{marginBottom: 5}}/>
              <Text style={{...flexVCenter}}><MIcon name="access-time"/> {order.created_at}</Text>
              <Text style={{...flexVCenter}}><MIcon name="av-timer"/> {order.updated_at}</Text>
              */}
                </Card>
              );
            })}
          {this.state.total > this.state.orders.length && (
            <Button
              backgroundColor={Colors.mainColor}
              buttonStyle={{
                margin: 10,
                borderRadius: 5,
                marginLeft: 0,
                marginRight: 0
              }}
              onPress={this.loadMores}
              title="Xem thêm"
            />
          )}
        </ScrollView>

        <AwesomeAlert
          show={this.state.showCancelAlert}
          showProgress={false}
          title="Hủy đơn hàng"
          message="Bạn có muốn hủy đơn hàng này?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Bỏ qua"
          confirmText="Đồng ý, hủy đơn!"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.setState({
              showCancelAlert: false
            });
          }}
          onConfirmPressed={() => {
            this.setState({
              showCancelAlert: false
            });
            this.cancelOrder(this.state.cancleCode);
          }}
        />
        <AwesomeAlert
          show={this.state.showPrePaidAlert}
          showProgress={false}
          title="Đặt cọc đơn hàng"
          message="Bạn cần số dư ít nhất 100% giá trị đơn hàng này để đặt cọc!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Bỏ qua"
          confirmText="Đồng ý, đặt cọc!"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.setState({
              showPrePaidAlert: false
            });
          }}
          onConfirmPressed={() => {
            this.setState({
              showPrePaidAlert: false
            });
            this.prePaidOrder(this.state.prePaidCode);
          }}
        />
        <Toast ref="toast" />
      </View>
        </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Screen);
