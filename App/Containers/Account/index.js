import React from 'react';
import { ScrollView, Text, View, SafeAreaView } from 'react-native';
import { Button, Card, Badge } from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import requests from 'utils/authRequests';
import { connect } from 'react-redux';
import {
  Colors,
  flex,
  flexCol,
  flexInline,
  flexVCenter,
  flexCenter
} from '../styles';
import _Const from '../const';
import { Constants } from 'configs';
import NavBar from 'components/Common/NavBar';
import { API_ROOT } from 'configs/API';
import {Header} from 'react-native-elements';

class AccountScreen extends React.Component {
  constructor(props) {
    super(props);
    this.requests = [];
    this.state = {
      limit: 5,
      balance: 0,
      totalMoney: 0,
      transactions: []
    };
  }

  loadMores = () => {
    this.featch(this.state.page + 1);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: 0,
      transactions: []
    });
    this.featch(0);
  }

  featch(page) {
    const { token } = this.props;
    const request = requests.get(
      API_ROOT + '/user/transactions',
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
            transactions: [
              ...this.state.transactions,
              ...res.data.transactions
            ],
            totalMoney: res.data.totalMoney,
            balance: res.data.balance,
            page: page,
            total: res.data.total
          });
        }
      })
      .catch(err => {});
  }

  componentDidMount() {
    this.featch(0);
  }

  componentWillUnmount() {
    this.requests.forEach(request => request.cancel());
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>

        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <NavBar title={'Quản lý tài chính'} hasBack />
          {/*<Header*/}
          {/*    leftComponent={{ icon: 'menu', color: '#fff' }}*/}
          {/*    centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}*/}
          {/*    rightComponent={{ icon: 'home', color: '#fff' }}*/}
          {/*    containerStyle={{*/}
          {/*      backgroundColor: 'red',*/}
          {/*      justifyContent: 'space-around',*/}
          {/*    }}*/}
          {/*/>*/}
          <ScrollView style={{ height: '100%', paddingTop: 5 }}>
            <Badge
              containerStyle={{
                marginBottom: 5,
                marginLeft: 30,
                marginRight: 30,
                backgroundColor: Colors.mainColor
              }}>
              <Text style={{ color: '#fff' }}>
                Số dư cuối: {this.state.balance ? this.state.balance.formatMoney(2, ',', '.') : 0} VNĐ
              </Text>
            </Badge>
            <Badge
              containerStyle={{
                marginBottom: 5,
                marginLeft: 30,
                marginRight: 30,
                backgroundColor: Colors.primaryColor
              }}>
              <Text style={{ color: '#fff' }}>
                Tổng tiền nạp: {this.state.totalMoney ? this.state.totalMoney.formatMoney(2, ',', '.') : 0}{' '}
                VNĐ
              </Text>
            </Badge>
            {this.state.transactions &&
              this.state.transactions.map(transaction => {
                return (
                  <Card key={transaction.id}>
                    <Badge
                      containerStyle={{
                        backgroundColor: Colors.transaction_type(
                          transaction.type
                        ),
                        marginBottom: 10
                      }}>
                      <Text style={{ color: '#fff' }}>
                        {_Const.transaction_type(transaction.type)}
                      </Text>
                    </Badge>
                    <Text>Nội dung: {transaction.content}</Text>
                    <Text>
                      Số tiền: {transaction.change.formatMoney(2, ',', '.')} VNĐ
                    </Text>
                    <Text style={{ ...flexVCenter }}>
                      <MIcon name="access-time" /> {transaction.created_at}
                    </Text>
                  </Card>
                );
              })}
            {this.state.total > this.state.transactions.length && (
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
)(AccountScreen);
