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
  TouchableOpacity,
  TextInput
} from 'react-native';
import requests from 'utils/authRequests';
import {  Card, Badge, Avatar, CheckBox, Button } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast, { DURATION } from 'react-native-easy-toast-fixed';
import { Colors, flex, flexVCenter, flexCenter } from '../styles';
import IconInput from 'components/Common/IconInput';

import FullWidthImage from 'components/Common/FullWidthImage';
import Select from 'components/Common/Select';
import Date from 'components/Common/Date';
import Back from 'components/Common/BackDefault';
import NavBar from 'components/Common/NavBar';

import { connect } from 'react-redux';
import { Constants } from 'configs';

import { register } from 'actions/auth';
import { goHomeReset, goBack, goPackOrder } from 'actions/nav';
import imgUser from 'images/User.png';
import imgPassword from 'images/Password.png';
import imgLogo from 'images/Logo.png';
import DocumentPicker from 'react-native-document-picker';
  import DropDownPicker from 'react-native-dropdown-picker';
  import { API_ROOT } from 'configs/API';
import imgBack from 'images/Back.png';

export class CreatePackOrder extends React.Component {
  constructor(props) {
    super(props);
    this.requests = [];
    this.state = {
        categories: [{label: 'Chọn danh mục', value: 0}],
        chineseBranches: [{label: 'Chọn kho Trung Quốc', value: 0}],
        chiNhanhs: [{label: 'Chọn kho Việt Nam', value: 0}],
        formOrder: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  setFormOrder= (attribute, value) =>{
    let { formOrder } = this.state;
    formOrder[attribute] = value;
    this.setState({formOrder: formOrder});
  };

  getCategories(){
    const {token} = this.props;
    const request = requests.get(API_ROOT+'/pack-orders/categories',{},token);
    this.requests.push(request);
    request
      .then(res=>{
        if(res.data.status && res.data.data) {
          let categories = [{label: 'Chọn danh mục', value: 0}];
          let chineseBranches = [{label: 'Chọn kho Trung Quốc', value: 0}];
          let chiNhanhs = [{label: 'Chọn kho Việt Nam', value: 0}];
          for(let i in res.data.data.categories){
            categories.push({label:res.data.data.categories[i].name,value:res.data.data.categories[i].id});
          }
          console.log(categories);
          for(let i in res.data.data.chineseBranches){
            chineseBranches.push({label:res.data.data.chineseBranches[i].name, value:res.data.data.chineseBranches[i].id});
          }
          for(let i in res.data.data.chiNhanhs){
            chiNhanhs.push({label:res.data.data.chiNhanhs[i].name,value:res.data.data.chiNhanhs[i].id});
          }
          this.setState({
            categories: categories,
            chineseBranches: chineseBranches,
            chiNhanhs: chiNhanhs
          });
        }
      }).catch(err=>{
        let categories = [{label: 'Chọn danh mục', value: 0}];
        let chineseBranches = [{label: 'Chọn kho Trung Quốc', value: 0}];
        let chiNhanhs = [{label: 'Chọn kho Việt Nam', value: 0}];
        this.setState({
            categories: categories,
            chineseBranches: chineseBranches,
            chiNhanhs: chiNhanhs
          });
        console.log(err);
      });
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

  resetFormOrder = () =>{
    let formOrder = {description: '',
        code: '',
        note: '',
        chi_nhanh: 0,
        weight: 0,
        so_kien: 0,
        hang_van_chuyen: '',
        chieu_gui: 0,
        category_id: 0,
        van_chuyen: 0,
        bao_hiem: 0,
        chinese_branch: 0,
        image: '',
        price: 0,
        link: ''
      };

      this.setState({formOrder: formOrder});
  }

  onSubmitForm = async () => {
    let that= this;
    const {token} = this.props;
    let { formOrder } = this.state;
    const data = new FormData();
    for(let k in formOrder){
      data.append(k,formOrder[k]);
    }
    let res = await fetch(API_ROOT + '/pack-orders/create',{
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data; ',
        'Authorization': 'Bearer '+token
      },
    });
    let responseJson = await res.json();
      if (responseJson.status == 1) {
        Alert.alert('Thành công', 'Thêm đơn hàng thành công!');
        this.resetFormOrder();
      }else{
        Alert.alert('Lỗi', responseJson.error);
      }
  }

  onCancelForm = () => {
    this.resetFormOrder();
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

  componentDidMount() {
    this.resetFormOrder();
    this.getCategories();
  }

//   componentDidUpdate(prevProps) {
//     this.resetFormOrder();
//     this.getCategories();
//   }

  componentWillUnmount() {
    this.requests.forEach(request => request.cancel());
  }

  onChangeText = field => value => {
    this.setState({ [field]: value });
  };

//   navBarLeft() {
//     return (
//         <TouchableOpacity
//           onPress={()=>{
//             let { navigation } = this.props;
//             navigation.state.params.
//           }}
//           style={{
//             paddingHorizontal: 18,
//             paddingVertical: 11,
//             flexDirection: 'row',
//             alignItems: 'center'
//           }}>
//           <Image
//             source={imgBack}
//             style={[
//               { width: 16, height: 16, tintColor: 'white' },
//               this.props.imageStyle
//             ]}
//           />
//         </TouchableOpacity>
//       );
//  }

  render() {
    const { formOrder, categories, chineseBranches, chiNhanhs } = this.state;
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>

          <KeyboardAvoidingView
            enabled={Platform.OS === 'ios'}
            behavior={'padding'}
            style={{ flex: 1 }}>
            <NavBar title={'Tạo đơn hàng ký gửi'} hasBack />
                <ScrollView style={{ flex: 1 }}>
                <View style={{ backgroundColor: 'white', padding: 10 }}>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: 10
                }}>
                <View
                    style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                    <Text bold>Mã vận đơn *:</Text>
                </View>
                <TextInput
                    ref={ref => (this.inputRef = ref)}
                    style={{
                    flex: 1,
                    margin: 0,
                    padding: 0,
                    paddingTop: 5,
                    fontFamily: 'Muli-Regular',
                    fontSize: 18,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    color: 'black'
                    }}
                    value={formOrder.code}
                    onChangeText={ code => this.setFormOrder('code', code)}
                />
                </View>
                <View
                style={{
                    flexDirection: 'row',
                    marginBottom: 10
                }}>
                <View
                    style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                    <Text bold>Hình ảnh:</Text>
                </View>
                <Avatar
                    style={{ flex: 1, borderWidth: 1, borderColor: '#ddd'}}
                    large
                    source={{
                        uri: formOrder && formOrder.image && formOrder.image.uri
                        ? formOrder.image.uri
                        : 'https://orders.ochivi.com/images/avatar-default.png'
                    }}
                    />
                <Button
                    buttonStyle={styles.buttonStyle}
                    style={styles.buttonTextStyle}
                    activeOpacity={0.5}
                    onPress={this.selectFile}
                    title="Chọn ảnh"
                    >
                </Button>
                </View>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: 10
                }}>
                <View
                    style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                    <Text bold>Tên hàng *:</Text>
                </View>
                <TextInput
                    style={{
                    flex: 1,
                    margin: 0,
                    padding: 0,
                    paddingTop: 5,
                    fontFamily: 'Muli-Regular',
                    fontSize: 18,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    color: 'black'
                    }}
                    value={formOrder.description}
                    onChangeText={description => this.setFormOrder('description',description)}
                />
                </View>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: 10
                }}>
                <View
                    style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                    <Text bold>Số kiện *:</Text>
                </View>
                <TextInput
                    style={{
                    flex: 1,
                    margin: 0,
                    padding: 0,
                    paddingTop: 5,
                    fontFamily: 'Muli-Regular',
                    fontSize: 18,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    color: 'black'
                    }}
                    value={formOrder.so_kien}
                    onChangeText={so_kien => this.setFormOrder('so_kien',so_kien)}
                />
                </View>
                {/* <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: 10
                }}>
                <View
                    style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                    <Text bold>Hãng vận chuyển:</Text>
                </View>
                <TextInput
                    style={{
                    flex: 1,
                    margin: 0,
                    padding: 0,
                    paddingTop: 5,
                    fontFamily: 'Muli-Regular',
                    fontSize: 18,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    color: 'black'
                    }}
                    value={formOrder.hang_van_chuyen}
                    onChangeText={hang_van_chuyen => this.setFormOrder('hang_van_chuyen',hang_van_chuyen)}
                />
                </View> */}
                <View>
                    <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginBottom: 10,
                        zIndex: 5,
                    }}>
                    <View
                        style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110 , width: '35%'}}>
                        <Text bold>Chiều gửi *:</Text>
                    </View>
                    <DropDownPicker
                        items={[
                            {label: 'Trung Quốc - Việt Nam', value: 0},
                            {label: 'Việt Nam - Trung Quốc', value: 1},
                        ]}
                        defaultValue={formOrder ? formOrder.chieu_gui : 0}
                        containerStyle={{height: 40, width: 200}}
                        style={[styles.styleInput]}
                        itemStyle={{
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={item => this.setFormOrder('chieu_gui',item.value)}
                    />
                    </View>
                    <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginBottom: 10,
                        zIndex: 4,
                    }}>
                    <View
                        style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                        <Text bold>Danh mục *:</Text>
                    </View>
                    <DropDownPicker
                        // items={categories}
                        items={categories}
                        defaultValue={formOrder ? formOrder.category_id : 0}
                        containerStyle={{height: 40, width: 200}}
                        style={[styles.styleInput]}
                        itemStyle={{

                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={item => this.setFormOrder('category_id',item.value)}
                    />
                    </View>
                    <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginBottom: 10,
                        zIndex: 3,
                    }}>
                    <View
                        style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                        <Text bold>Kho Trung Quốc *:</Text>
                    </View>
                    <DropDownPicker
                        items={chineseBranches}
                        defaultValue={formOrder ? formOrder.chinese_branch : 0}
                        containerStyle={{height: 40, width: 200}}
                        style={styles.styleInput}
                        itemStyle={{

                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={item => this.setFormOrder('chinese_branch',item.value)}
                    />
                    </View>
                    <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginBottom: 10,
                        zIndex: 2,
                    }}>
                    <View
                        style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                        <Text bold>Kho Việt Nam *:</Text>
                    </View>
                    <DropDownPicker
                        items={chiNhanhs}
                        defaultValue={formOrder ? formOrder.chi_nhanh : 0}
                        containerStyle={{height: 40, width: 200}}
                        style={styles.styleInput}
                        itemStyle={{

                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={item => this.setFormOrder('chi_nhanh',item.value)}
                    />
                    </View>
                    <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginBottom: 10,
                        zIndex: 1,
                    }}>
                    <View
                        style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                        <Text bold>Vận chuyển nhanh:</Text>
                    </View>
                    <CheckBox
                        textStyle={{ width: 0, margin: 0, padding: 0 }}
                        containerStyle={{
                        width: 40,
                        margin: 0,
                        backgroundColor: 'transparent',
                        borderWidth: 0
                        }}
                        checked={formOrder ? (formOrder.van_chuyen == 0 ? false : true) : false}
                        onPress={() => this.setFormOrder('van_chuyen',(formOrder ? (formOrder.van_chuyen == 0 ? 1 : 0) : 1))}
                    />
                    </View>
                    <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginBottom: 10,
                        zIndex: 0,
                    }}>
                    <View
                        style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                        <Text bold>Bảo hiểm:</Text>
                    </View>
                    <CheckBox
                        textStyle={{ width: 0, margin: 0, padding: 0 }}
                        containerStyle={{
                        width: 40,
                        margin: 0,
                        backgroundColor: 'transparent',
                        borderWidth: 0
                        }}
                        checked={formOrder ? (formOrder.bao_hiem == 0 ? false : true) : false}
                        onPress={() => this.setFormOrder('bao_hiem',(formOrder ? (formOrder.bao_hiem == 0 ? 1 : 0) : 1))}
                    />
                    </View>
                </View>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: 10
                }}>
                <View
                    style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                    <Text bold>Giá trị đơn hàng (tệ) *:</Text>
                </View>
                <TextInput
                    style={{
                    flex: 1,
                    margin: 0,
                    padding: 0,
                    paddingTop: 5,
                    fontFamily: 'Muli-Regular',
                    fontSize: 18,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    color: 'black'
                    }}
                    keyboardType={'numeric'}
                    value={formOrder.price}
                    onChangeText={price => this.setFormOrder('price',price)}
                />
                </View>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: 10
                }}>
                <View
                    style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                    <Text bold>Link sản phẩm *:</Text>
                </View>
                <TextInput
                    style={{
                    flex: 1,
                    margin: 0,
                    padding: 0,
                    paddingTop: 5,
                    fontFamily: 'Muli-Regular',
                    fontSize: 18,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    color: 'black'
                    }}
                    value={formOrder.link}
                    onChangeText={link => this.setFormOrder('link',link)}
                />
                </View>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: 10
                }}>
                <View
                    style={{ paddingRight: 15, paddingBottom: 5, minWidth: 110, width: '35%' }}>
                    <Text bold>Ghi chú:</Text>
                </View>
                <TextInput
                    style={{
                    flex: 1,
                    margin: 0,
                    padding: 0,
                    paddingTop: 5,
                    fontFamily: 'Muli-Regular',
                    fontSize: 18,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    color: 'black'
                    }}
                    value={formOrder.note}
                    onChangeText={note => this.setFormOrder('note',note)}
                />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={this.onSubmitForm}
                    style={{
                    borderRadius: 3,
                    backgroundColor: Colors.premiumColor,
                    paddingHorizontal: 24,
                    paddingVertical: 7
                    }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.onCancelForm}
                    style={{
                    marginLeft: 10,
                    borderRadius: 3,
                    borderColor: '#E7505A',
                    borderWidth: 1,
                    paddingHorizontal: 24,
                    paddingVertical: 7
                    }}>
                    <Text style={{ color: '#E7505A', fontSize: 18 }}>HỦY</Text>
                </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
          </KeyboardAvoidingView>

      </View>
        </SafeAreaView>
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
    width: '100%',
      zIndex: 999,
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
});

const mapStateToProps = state => ({
  isLogged: state.auth.isLogged,
  token: state.auth.token,
  locations: state.auth.locations
});
const mapDispatchToProps = {
  goHomeReset,
  goBack,
  goPackOrder
};
export default connect(mapStateToProps, mapDispatchToProps)(CreatePackOrder);
