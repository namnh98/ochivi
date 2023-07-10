import React from 'react';
import { ScrollView, Text, View, TextInput, TouchableOpacity, StyleSheet, Alert, RefreshControl , SafeAreaView, Platform} from 'react-native';
import { Button, Card, Badge, Avatar, CheckBox } from 'react-native-elements';
import Divider from 'components/Common/Divider';
import Icon from 'react-native-vector-icons/AntDesign';
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
import NavigationBar from 'react-native-navbar';
import Modal from 'react-native-modal';
import {
    goCreatePackOrder,
    goHomeReset,
  } from 'actions/nav';
  import DocumentPicker from 'react-native-document-picker';
  import DropDownPicker from 'react-native-dropdown-picker';
import { thisExpression } from '@babel/types';
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
    const { token } = this.props;
    this.state.refreshing = true;
    const request = requests.get(
      API_ROOT + '/user/pack-orders',
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
        this.setState({refreshing: false});
        //alert(JSON.stringify(err))
      });
  }

  prePaidOrder = code => {
    const { token } = this.props;
    requests
      .post(
        API_ROOT + '/pack-orders/status',
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
      });
  };

  cancelOrder = code => {
    const { token } = this.props;

    requests
      .post(API_ROOT + `/pack-orders/delete_order/${code}`, null, null, token)
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
      });
  };
  componentWillUpdate(){

  }

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        this.setState({
          page: 0,
          orders: []
        });
        this.featchOrders(0);
      }),
      // this.props.navigation.addListener("willBlur", () => this.setState({ isFocused: false }))
    ];
    this.featchOrders(0);
  }

  componentWillUnmount() {
    this.subs.forEach((sub, index)=>{ sub.remove() });
    this.subs = [];
    this.requests.forEach(request => request.cancel());
  }

  selectFile = async () => {
    //Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        //Provide which type of file you want user to pick
        type: [DocumentPicker.types.images],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      //Setting the state to show single file attributes
      this.setFormOrder('image',res);
    } catch (err) {
      this.setFormOrder('image',null);
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
      } else {
        //For Unknown Error
        throw err;
      }
    }
  };

  render() {
    return (
        <SafeAreaView style={{ flex:1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationBar style={{backgroundColor: Colors.primaryColor, color: '#fff', marginTop: Platform.OS === 'ios' ? -20 : 0}}
        title={{title:'Đơn hàng ký gửi', style:{color: '#fff'}}}
        rightButton={{title: 'Thêm', handler: () => this.props.goCreatePackOrder(), tintColor :'#fff'}}
        leftButton={{title: 'Quay lại', handler: () => this.props.goHomeReset(), tintColor: '#fff'}} hasBack />
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
                  <View style={{ ...flex, ...flexInline, marginTop: 2 }}>
                    <Badge
                      containerStyle={{
                        ...flex,
                        backgroundColor: Colors.mainColor, marginBottom: 2
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
                        backgroundColor: Colors.status(order.status)
                      }}>
                      <Text style={{ color: '#fff' }}>
                        Trạng thái: {_Const.statusPackOrder(order.status)}
                      </Text>
                    </Badge>
                  </View>
                  <Divider style={{ marginTop: 5 }} />
                  <View style={{ padding: 5 }}>
                    <View
                        style={{ ...flex, ...flexInline }}>
                            <Avatar
                              medium
                              source={{
                                uri: order.image
                                  ? `${(API_ROOT+order.image)
                                    .replace('/api','')
                                      .replace('_.webp', '')}`
                                  : 'https://orders.ochivi.com/images/avatar-default.png'
                              }}
                            />
                            <View style={{ ...flex, marginLeft: 10 }}>
                              <Text>
                                Thông tin kiện hàng:{' '}
                                <Text style={{ opacity: 0.8, color: '#222' }}>
                                  {order.description}
                                </Text>
                              </Text>
                              <Text>
                                Số kiện:{' '}
                                <Text style={{ opacity: 0.8, color: '#222' }}>
                                  {order.so_kien}
                                </Text>
                              </Text>
                              <Text style={{ fontWeight: 'bold' }}>
                                Ghi chú:{' '}
                                {order.note}
                              </Text>
                            </View>
                    </View>
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
                      <Text style={{ textAlign: 'left' }}>
                        Mã đơn hàng:{' '}
                        {(order.auto_code)}
                      </Text>
                      <Text style={{ textAlign: 'left' }}>
                        Hãng vận chuyển:{' '}
                        {(order.hang_van_chuyen)}
                      </Text>
                      <Text style={{ textAlign: 'left' }}>
                        Chiều gửi:{' '}
                        {(order.chieu_gui == 0 ? 'Trung Quốc - Việt Nam' : 'Việt Nam - Trung Quốc')}
                      </Text>
                      <Text style={{ textAlign: 'left' }}>
                        Danh mục:{' '}
                        {(order.category ? order.category.name : '')}
                      </Text>
                      <Text style={{ textAlign: 'left' }}>
                        Giá trị đơn hàng:{' '}
                        {(order.price)} {' tệ'}
                      </Text>
                      <Text style={{ textAlign: 'left' }}>
                        Link sản phẩm:{' '}
                        {(order.link)}
                      </Text>
                      <Text style={{ textAlign: 'left' }}>
                        Vận chuyển:{' '}
                        {(order.van_chuyen == 1 ? 'Nhanh' : 'Thường')}
                      </Text>
                      <Text style={{ textAlign: 'left' }}>
                        Bảo hiểm:{' '}
                        {(order.bao_hiem == 1? 'Có' : 'Không')}
                      </Text>
                      <Text style={{ textAlign: 'left' }}>
                        Kho nhận hàng Trung Quốc:{' '}
                        {(order.chinese_branch ? order.chinese_branch.name : '')}
                      </Text>
                      <Text style={{ textAlign: 'left' }}>
                        Kho trả hàng Việt Nam:{' '}
                        {(order.locations_branch ? order.locations_branch.name : '')}
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
const mapDispatchToProps = {
    goCreatePackOrder,
    goHomeReset,
  };
  const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    buttonStyle: {
      backgroundColor: '#307ecc',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#307ecc',
      alignItems: 'center',
      borderRadius: 5,
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 10,
      paddingRight: 10
    },
    buttonTextStyle: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    textStyle: {
      backgroundColor: '#fff',
      fontSize: 15,
      marginTop: 16,
      marginLeft: 35,
      marginRight: 35,
      textAlign: 'center',
    },
    styleInput:{
      flex: 1,
      margin: 0,
      padding: 0,
      paddingTop: 5,
      fontFamily: 'Muli-Regular',
      fontSize: 18,
      borderBottomColor: '#eee',
      borderBottomWidth: 1,
      color: 'black',
      width: '100%'
    }
  });
export default connect(mapStateToProps, mapDispatchToProps)(Screen);
