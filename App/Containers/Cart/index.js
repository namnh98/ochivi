import React from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { Avatar, CheckBox, Button, Card, Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Divider from 'components/Common/Divider';
import {
  flexInline,
  flex,
  flexVCenter,
  flexCenter,
  Colors,
  footerWrapper,
  footerWrapperNC
} from '../styles';
import authRequests from 'utils/authRequests';
import TextTicker from 'react-native-text-ticker';
import Storage from 'react-native-expire-storage';
import { Constants } from 'configs';
import { connect } from 'react-redux';
import NavBar from 'components/Common/NavBar';
import { API_ROOT } from 'configs/API';

import { goOrder } from 'actions/nav';

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked:{},
      countProducts: 0,
      products: []
    };
  }

  sendOrders = () => {
    const { token } = this.props;
    console.log(
      API_ROOT + '/user/orders',
      token,
      JSON.stringify({
        products: this.state.products.filter(product => {
          return product.checked;
        })
      })
    );
    authRequests
      .post(
        API_ROOT + '/user/orders',
        null,
        {
          products: this.state.products.filter(product => {
            return product.checked;
          })
        },
        token
      )
      .then(res => {
        this.clearProducts();
        this.setState({
          showSuccess: true,
          orders: res.data.orders
        });
      })
      .catch(err => {
        console.log('err', err.response.data);
      });
  };

  componentWillReceiveProps(nextProps) {
    this.getProducts();
  }

  componentDidMount() {
    this.getProducts();
  }

  async getProducts() {
    let {checked} = this.state;
    checked = [];
    let products = await Storage.getItem('@OchiviStore:products');
    console.log(products);
    products = JSON.parse(products || '[]');
    this.setState({
      products: products,
      totalPrice: 0,
      showSuccess: false,
      countProducts: products.length,
      orders: []
    });
  }

  async clearProducts() {
    let { products } = this.state;
    products = products.filter(product => {
      return !product.checked;
    });
    await Storage.setItem('@OchiviStore:products', JSON.stringify(products));
    this.setState({
      products: products,
      totalPrice: 0
    });
  }

  async deleteProduct(index) {
    let { products } = this.state;
    products.splice(index, 1);
    await Storage.setItem('@OchiviStore:products', JSON.stringify(products));
    this.setState({
      products: products,
      totalPrice: 0
    });
  }


  toogleCheckedProduct = (index) => {
    let { products } = this.state;
    products[index].checked = products[index].checked ? false : true;
    this.setState({
      products: products
    });
  };

  toggleCheckedBranch = (index) => {
    let {products, checked} = this.state;
    let i = 0;
    if(checked[index] == false){
      checked[index] = true;
    }else{
      checked[index] = false;
    }
    for(let k in products[index]){
      products[index][k].checked = checked[index];
    }
    this.setState({
      checked: checked,
      products: products
    });
  }

  render() {
    let { totalPrice, checked } = this.state;
    totalPrice = 0;
    let renderView = [];
    for(let index in this.state.products){
      let product = this.state.products[index];
      console.log(product);
      if(product.checked == true){
        totalPrice += product.number_product * product.price;
      }

      renderView.push(
        <View
          style={{
            ...flexInline,
            borderRadius: 2,
            padding: 5,
            borderWidth: 1,
            borderColor: '#eee',
            margin: 5
          }}
          key={product.name}>
          <CheckBox
            textStyle={{ width: 0, margin: 0, padding: 0 }}
            containerStyle={{
              ...flexInline,
              ...flexVCenter,
              width: 30,
              margin: 0,
              backgroundColor: 'transparent',
              borderWidth: 0
            }}
            checked={product.checked}
            onPress={() => this.toogleCheckedProduct(index)}
          />
          <Avatar
            large
            source={{
              uri: product.image
            }}
          />
          <View
            style={{
              ...flex,
              ...flexVCenter,
              marginLeft: 10,
              marginRight: 10
            }}>
            <TextTicker
              duration={3000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
              style={{
                color: Colors.primaryColor,
                fontWeight: 'bold'
              }}>
              {product.name}
            </TextTicker>
            <Text>
              Số lượng:{' '}
              <Text style={{ color: Colors.mainColor }}>
                {product.number_product}
              </Text>
            </Text>
            <Text>Ghi chú: {product.note}</Text>
            <Text>
              Giá tiền:{' '}
              <Text
                style={{
                  color: Colors.mainColor,
                  fontWeight: 'bold'
                }}>
                {(
                  product.number_product * product.price
                ).formatMoney(2, ',', '.')}{' '}
                VNĐ
              </Text>
            </Text>
          </View>
          <Icon
            onPress={() => this.deleteProduct(index)}
            style={{
              ...flexVCenter,
              marginTop: 10,
              color: 'red',
              width: 30,
              fontSize: 25
            }}
            name="delete"
          />
        </View>
      );
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View >
        <NavBar title={'Giỏ hàng'} hasBack/>

        <Divider />
        <SafeAreaView style={{ flex: 1 }}>
          {this.state.countProducts > 0 ? (
            <>
              <ScrollView style={{ flex: 1 }}>
                { renderView }
              </ScrollView>

              <Text style={{ fontWeight: 'bold', margin: 10 }}>
                Tổng tiền:{' '}
                <Text style={{ color: Colors.primaryColor }}>
                  {totalPrice.formatMoney(2, ',', '.')} VNĐ
                </Text>
              </Text>

              <Button
                onPress={() => this.sendOrders()}
                icon={{ name: 'cart-plus', type: 'font-awesome' }}
                buttonStyle={{
                  borderRadius: 5,
                  backgroundColor: Colors.mainColor
                }}
                title="Đặt hàng!"
              />
            </>
          ) : (
            <View style={{ ...flex, ...flexCenter, ...flexVCenter }}>
              <Text>Không có sản phẩm nào được chọn!</Text>
            </View>
          )}
          {this.state.showSuccess && (
            <View
              style={{
                ...flexVCenter,
                ...flexCenter,
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(52, 52, 52, 0.8)'
              }}>
              <Card containerStyle={{ borderRadius: 5 }} title="Thành công!">
                <View>
                  <Text style={{ fontWeight: 'bold' }}>
                    Các mã đơn hàng đã tạo:
                  </Text>
                  <View style={{ ...footerWrapper }}>
                    {this.state.orders.map(order => {
                      return (
                        <Badge
                          key={order.code || order.auto_code}
                          containerStyle={{
                            ...footerWrapperNC,
                            backgroundColor: '#ff4500',
                            margin: 5
                          }}>
                          <Text style={{ color: '#fff' }}>
                            #{order.code || order.auto_code}
                          </Text>
                        </Badge>
                      );
                    })}
                  </View>
                  <Button
                    onPress={() => {
                      this.setState({ showSuccess: false });
                      this.props.goOrder();
                    }}
                    icon={{ name: 'paper-plane-o', type: 'font-awesome' }}
                    buttonStyle={{
                      borderRadius: 5,
                      backgroundColor: Colors.mainColor
                    }}
                    title="Quản lý đơn hàng"
                  />
                </View>
              </Card>
            </View>
          )}
        </SafeAreaView>
      </View>
        </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  user: state.auth.user
});
const mapDispatchToProps = {
  goOrder
};
export default connect(mapStateToProps, mapDispatchToProps)(Screen);
