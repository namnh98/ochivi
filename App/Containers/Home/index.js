import React from 'react';
import {
  SearchBar,
  Button,
  Icon,
  ButtonGroup,
  Card,
  Avatar
} from 'react-native-elements';
import {
  SafeAreaView,
  Clipboard,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import Divider from 'components/Common/Divider';
import {
  flexCenter,
  flexInline,
  flexVCenter,
  Colors,
  flex,
  padding510,
  padding010
} from '../styles';
import translate from 'utils/translate';
import requests from 'utils/requests';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { connect } from 'react-redux';
import { Constants } from 'configs';

import authRequests from 'utils/authRequests';
import Toast, { DURATION } from 'react-native-easy-toast-fixed';
import { isEqual } from 'lodash';
import Storage from 'react-native-expire-storage';

import { toggleDrawer, goCart, goLogin } from 'actions/nav';
import { API_ROOT } from 'configs/API';

const patchPostMessageFunction = function() {
  //var originalPostMessage = window.ReactNativeWebView.postMessage;

  //var patchedPostMessage = function (message, targetOrigin, transfer) {
  //  originalPostMessage(message, targetOrigin, transfer);
  //};

  //patchedPostMessage.toString = function () {
  //  return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  //};
  var skuCard = null;
  var sku1688 = null;
  var skuTmall = null;

  //window.postMessage = patchedPostMessage;

  document.addEventListener(
    'message',
    e => {
      var event = JSON.parse(e.data);

      switch (event.action) {
        case 'orderClick': {
          if (skuCard) skuCard.click();
          break;
        }
      }
    },
    false
  );

  window.addEventListener(
    'message',
    e => {
      var event = JSON.parse(e.data);

      switch (event.action) {
        case 'orderClick': {
          if (skuCard) skuCard.click();
          break;
        }
      }
    },
    false
  );

  var readyInterval = null;

  function checkOrderOn() {
    var documentRoot = document.getElementById('root');
    sku1688 = document.getElementById('widget-wap-detail-common-sku');
    skuTmall = document.getElementById('content');

    if (documentRoot) {
      skuCard =
        documentRoot.getElementsByClassName('sku card').length > 0 &&
        documentRoot.getElementsByClassName('sku card')[0];
    } else if (sku1688 && !skuCard) {
      skuCard =
        sku1688.getElementsByClassName(
          'takla-item-content has-item-arrow J_SkuBtn'
        ).length > 0 &&
        sku1688.getElementsByClassName(
          'takla-item-content has-item-arrow J_SkuBtn'
        )[0];
    } else if (skuTmaill && !skuCard) {
      skuCard =
        skuTmall.getElementsByClassName('module-sku').length > 0 &&
        skuTmall.getElementsByClassName('module-sku')[0];
    }

    if (skuCard) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ action: 'orderOn' })
      );
      clearInterval(readyInterval);
    }
  }

  function getValues() {
    var data = null;
    var baseData = {
      link: window.location.href
    };

    if (sku1688) {
      var name =
        document.getElementsByClassName('title-text').length > 0 &&
        document.getElementsByClassName('title-text')[0].textContent.trim();
      var image =
        document.getElementsByClassName('J_ImageFirstRender').length > 0 &&
        document.getElementsByClassName('J_ImageFirstRender')[0].src;
      var quantity =
        document.getElementsByClassName('J_SelectedTotalAmount').length > 0 &&
        parseInt(
          document.getElementsByClassName('J_SelectedTotalAmount')[0]
            .textContent
        );
      var price =
        document.getElementsByClassName('J_SelectedTotalPrice').length > 0 &&
        parseFloat(
          document.getElementsByClassName('J_SelectedTotalPrice')[0].textContent
        );
      baseData.name = name;
      baseData.image = image;
      baseData.price =
        document.getElementsByClassName('price-num').length > 0 &&
        parseFloat(document.getElementsByClassName('price-num')[0].textContent);

      if (quantity == 0) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ action: 'orderDetail', data: {}, base: baseData })
        );
        return;
      }
      var branch =  document.getElementsByClassName('shop-name-text').length > 0 ? document.getElementsByClassName('shop-name-text')[0].textContent : 'N/A';
      var properties = [];
      var quantity = 0;
      // Start: Lấy thuộc tính của sản phẩm
      if(document.getElementsByClassName('b2b-wap-skuselector-content').length > 0){

          var classAttributes = getClassAttributesOf1688(document.getElementsByClassName('b2b-wap-skuselector-content')[0].getElementsByClassName('m-selector-content')[0].className);
          if(classAttributes.length == 1){
            var selectedCounts = document.getElementsByClassName('J_SelectedCount');
            if(selectedCounts.length > 0){
              selectedCounts[0].remove();
            }
            var amountInputs = document.getElementsByClassName('b2b-wap-skuselector-content')[0].getElementsByClassName('amount-input');
            var countInput = 0;
            for(var i = 0; i<  amountInputs.length; i++){
              if(amountInputs[i].value > 0){
                var properties = [];
                var amountInput = amountInputs[i];
                countInput += 1;
                quantity = amountInputs[i].value;
                var priceDiscount = amountInput.parentElement.parentElement.getAttribute('data-sku-discountprice');
                if(priceDiscount == ""){
                  var priceOrignal = amountInput.parentElement.parentElement.getAttribute('data-sku-price');
                  if(priceOrignal == ""){
                    if(document.querySelectorAll('.J_SkuPriceItem.active-price').length > 0){
                      if(document.querySelectorAll('.J_SkuPriceItem.active-price')[0].getElementsByClassName('price-num').length){
                        priceOrignal = document.querySelectorAll('.J_SkuPriceItem.active-price')[0].getElementsByClassName('price-num')[0].textContent;
                      }
                    }
                  }
                }
                price = parseFloat(priceDiscount != "" ? priceDiscount : (priceOrignal != "" ? priceOrignal : 0));
                var propertyValue = amountInput.parentElement.parentElement.parentElement.getElementsByClassName('main-text').length > 0 ? amountInput.parentElement.parentElement.parentElement.getElementsByClassName('main-text')[0].textContent : '';
                var propertyName = amountInput.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('prop-name-text').length > 0 ? amountInput.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('prop-name-text')[0].textContent : '';
                if(propertyName != '' && propertyValue !=''){
                  properties.push({name: propertyName, value: propertyValue});
                }
              }
            }
            if(countInput > 1){
              var properties = [];
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ action: 'error', isError: true,error: 'Vui lòng chỉ chọn số lượng của một loại sản phẩm' })
              );
              quantity = 0;
              for(var kInput = 0; kInput < document.getElementsByClassName('amount-input').length; kInput++){
                document.getElementsByClassName('amount-input')[kInput].value = 0;
              }
              for(var kSelected = 0; kSelected < document.getElementsByClassName('selected-count').length; kSelected++){
                document.getElementsByClassName('selected-count')[kSelected].textContent = 0;
              }
              price = 0;
            }
          }else{
            for(var kAttr = 0; kAttr < classAttributes.length; kAttr++){
              var property = {name: '', value: ''};
              var classItem = classAttributes[kAttr];
              var classChild = classItem.replace('box','');
              if(document.getElementsByClassName(classItem).length){
                var nameAttr = ''; var valueAttr = '';
                if(document.getElementsByClassName(classItem)[0].getElementsByClassName(classChild+'name').length > 0){
                  if(document.getElementsByClassName(classItem)[0].getElementsByClassName(classChild+'name')[0].getElementsByClassName('prop-name-text').length > 0){
                    nameAttr = document.getElementsByClassName(classItem)[0].getElementsByClassName(classChild+'name')[0].getElementsByClassName('prop-name-text')[0].textContent
                  }
                  if(document.getElementsByClassName(classItem)[0].getElementsByClassName(classChild+'content').length > 0){
                    if(document.querySelectorAll('.'+classChild+'item.active-sku-item').length > 0){
                      valueAttr = document.querySelectorAll('.'+classChild+'item.active-sku-item')[0].textContent;
                    }
                    for(var kSkuItem = 0 ; kSkuItem < document.querySelectorAll('.'+classChild+'item').length; kSkuItem++){
                      var selectedCounts = document.querySelectorAll('.'+classChild+'item')[kSkuItem].getElementsByClassName('J_SelectedCount');
                      if(selectedCounts.length > 0){
                        selectedCounts[0].remove();
                      }
                    }
                  }

                }
                if(nameAttr != '' && valueAttr != ''){
                  property.name = nameAttr;
                  property.value = valueAttr;
                  properties.push(property);
                }
                // Start: Lấy số lượng và giá của sản phẩm
                if(document.getElementsByClassName(classItem)[0].getElementsByClassName(classChild+'amount').length > 0){
                  var countInput = 0;
                  var amountWraps = document.getElementsByClassName(classItem)[0].getElementsByClassName(classChild+'amount');

                  for(var i = 0; i < amountWraps.length; i++){
                    if(amountWraps[i].getElementsByClassName('amount-input').length > 0){
                      var amountInput = amountWraps[i].getElementsByClassName('amount-input')[0];
                      if(amountInput.value > 0){
                        countInput += 1;
                        quantity += amountInput.value;
                        var priceDiscount = amountInput.parentElement.parentElement.getAttribute('data-sku-discountprice');

                        if(priceDiscount == ""){
                          var priceOrignal = amountInput.parentElement.parentElement.getAttribute('data-sku-price');
                          if(priceOrignal == ""){
                            if(document.querySelectorAll('.J_SkuPriceItem.active-price').length > 0){
                              if(document.querySelectorAll('.J_SkuPriceItem.active-price')[0].getElementsByClassName('price-num').length){
                                priceOrignal = document.querySelectorAll('.J_SkuPriceItem.active-price')[0].getElementsByClassName('price-num')[0].textContent;
                              }
                            }
                          }
                        }
                        price = parseFloat(priceDiscount != "" ? priceDiscount : (priceOrignal != "" ? priceOrignal : 0));
                      }
                    }
                  }
                  if(countInput > 1){
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({ action: 'error', isError: true,error: 'Vui lòng chỉ chọn số lượng của một loại sản phẩm' })
                    );
                    quantity = 0;
                    for(var i = 0; i < document.getElementsByClassName('amount-input').length; i++){
                      document.getElementsByClassName('amount-input')[i].value = 0;
                    }
                    price = 0;
                  }
                }
              }
            }
          }
      }
      price = parseFloat(price);
      quantity = parseInt(quantity);
      if(document.getElementsByClassName('J_SelectedTotalAmount').length > 0){
        document.getElementsByClassName('J_SelectedTotalAmount')[0].textContent = quantity;
      }
      if(document.getElementsByClassName('J_SelectedTotalPrice').length > 0){
        document.getElementsByClassName('J_SelectedTotalPrice')[0].textContent = (quantity * price).toFixed(2);
      }
      // End: Lấy thuộc tính sản phẩm

      data = {
        price: price.toFixed(2),
        quantity: quantity,
        name: name,
        image: image,
        branch: branch,
        properties: properties
      };
    } else if (skuTmall) {
      //
    } else {
      var skuItems = document.getElementsByClassName('modal-sku-content');
      var name =
        document.getElementsByClassName('title').length > 0 &&
        document.getElementsByClassName('title')[0].textContent.trim();

      baseData.name = name;
      baseData.image =
        document.getElementsByClassName('mui-lazy slick-image').length > 0 &&
        document.getElementsByClassName('mui-lazy slick-image')[0].src;
      baseData.price =
        document.getElementsByClassName('price').length > 0 &&
        parseFloat(document.getElementsByClassName('price')[0].textContent);

      var properties = [];
      for (var i = 0; i < skuItems.length; i++) {
        var name =
          skuItems[i].getElementsByClassName('modal-sku-content-title').length >
            0 &&
          skuItems[i].getElementsByClassName('modal-sku-content-title')[0]
            .textContent;
        var item = skuItems[i].getElementsByClassName(
          'modal-sku-content-item modal-sku-content-item-active'
        );
        if (item.length == 0) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ action: 'orderDetail', data: {}, base: baseData })
          );
          return;
        }
        var value = item[0].textContent;
        properties.push({
          name: name,
          value: value
        });
      }

      var quantity =
        document.getElementsByClassName('sku-number-edit').length > 0 &&
        document.getElementsByClassName('sku-number-edit')[0].value;
      var price =
        document.getElementsByClassName('modal-sku-title-price').length > 0 &&
        parseFloat(
          document.getElementsByClassName('modal-sku-title-price')[0]
            .textContent
        );
      var image =
        document.getElementsByClassName('modal-sku-image').length > 0 &&
        document
          .getElementsByClassName('modal-sku-image')[0]
          .getElementsByTagName('img').length > 0 &&
        document
          .getElementsByClassName('modal-sku-image')[0]
          .getElementsByTagName('img')[0].src;
      // var branchLink = querySelectorAll('a.bar-item').length > 0 ? '' : querySelectorAll('a.bar-item')[0].href;
      var branch =  document.getElementsByClassName('shop-title-text').length > 0 ? document.getElementsByClassName('shop-title-text')[0].textContent : 'N/A';
      data = {
        image: image,
        properties: properties,
        price: price,
        quantity: quantity,
        name: name,
        branch: branch
      };
    }

    window.ReactNativeWebView.postMessage(
      JSON.stringify({ action: 'orderDetail', data: data, base: baseData })
    );
  }

  function hideClass(klass) {
    var ads = document.getElementsByClassName(klass),
        i;
    for (i = 0; i < ads.length; i += 1) {
      ads[i].style.display = "none";
    };
  };

  function hideDynamicAds() {
    if ($) {
      var ads = $( "div[dpr=1]" )
      for (i = 0; i < ads.length; i += 1) {
        ads[i].style.display = "none !important";
      };
    }
  }

  function hideAds() {
    hideClass('smartbanner-wrapper')
    // hideClass('mui-zebra-module') 2020/19/09
    hideClass('banner-and-poplayer')
    hideDynamicAds()
  };
  setInterval(hideAds, 10);
  setInterval(getValues, 1000);
  readyInterval = setInterval(checkOrderOn, 1000);
  window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'onLoad' }));

  function getClassAttributesOf1688(className){
    var numbers = ['one','two','three','four','five','six','seven','eight','nine','ten'];
    var numericals = ['1st','2nd','3rd','4th','6th','7th','8th','9th','10th'];
    for(var i in numbers){
      var number = numbers[i];
      if(className.indexOf(number+'-sku-status') > -1 || i == 9){
        var classAttributes = [];
        for(k = 0; k <= i; k ++){
          var numerical = numericals[k];
          classAttributes.push('sku-'+numerical+'-prop-box');
        }
        return classAttributes;
      }

    }
    return [];
  }
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

class MyHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: [
        'https://m.intl.taobao.com',
        'https://tmall.com/?from=m',
        'https://m.1688.com'
      ],
      searchUrls: [
        'https://m.intl.taobao.com/search/search.html?q=',
        'https://list.tmall.com/search_product.htm?type=p&q=',
        'https://m.1688.com/offer_search/-6D7033.html?keywords='
      ],
      selectedIndex: 0,
      url: 'https://m.intl.taobao.com',
      orderEnabled: false,
      acceptAddToCart: false,
      loading: false,
      amountVND: 0,
      itemDetails: {},
      showOrder: false
    };
  }

  postMessage = message => {
    this.state.webWiewRef.postMessage(JSON.stringify(message));
  };

  async saveOrder() {
    if (!this.state.note || this.state.note == '') {
      return this.refs.toast.show('Yêu cầu nhập ghi chú cho sản phẩm!');
    }
    let products = await Storage.getItem('@OchiviStore:products');
    products = JSON.parse(products || '[]');
    products.push({
      ...this.state.itemDetails,
      price: this.state.amountVND,
      link: this.state.baseDetails.link,
      number_product: this.state.itemDetails.quantity,
      note: `${this.state.note}`,
      branch: this.state.itemDetails.branch == '' ? 'N/A' : this.state.itemDetails.branch
    });
    await Storage.setItem('@OchiviStore:products', JSON.stringify(products));
    if (this.state.showOrder != false || this.state.showSuccess != true)
      this.setState({
        showOrder: false,
        showSuccess: true
      });
  }

  addTocart = () => {
    if (!this.props.isLogged) {
      this.props.goLogin();
    } else {
      if (this.state.acceptAddToCart) {
        if (this.state.showOrder != true)
          this.setState({
            showOrder: true
          });
      } else {
        this.postMessage({
          action: 'orderClick'
        });
        this.refs.toast.show('Chọn thuộc tính sản phẩm!');
      }
    }
  };

  searchAction = e => {
    const s = e.nativeEvent.text;
    this.doSearch(s);
  };

  doSearch = s => {
    const regex = new RegExp(
      '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
    );
    if (regex.test(s)) {
      this.setState({
        keyword: s,
        url: s
      });
      this.state.webWiewRef && this.state.webWiewRef.forceUpdate();
      return;
    }
    translate(s).then(
      text => {
        const url = `${this.state.searchUrls[this.state.selectedIndex]}${text}`;
        this.setState({
          keyword: s,
          url: url
        });
        this.state.webWiewRef && this.state.webWiewRef.forceUpdate();
      },
      err => {
        this.refs.toast.show('Không thể dịch từ khóa này!');
      }
    );
  };

  async getPrice(price) {
    try {
      const res = await requests.get(
        `https://orders.ochivi.com/converter?amount=${price}&from=NDT&to=VND`
      );
      if (this.state.amountVND != res.result)
        this.setState({
          amountVND: res.result
        });
    } catch (error) {}
  }

  refresh = () => {
    this.state.webWiewRef && this.state.webWiewRef.reload();
  };

  saveToFavorites = () => {
    const {token} = this.props;
    const { baseDetails } = this.state;
    authRequests
      .post(
        API_ROOT + '/user/favorites',
        null,
        {
          ...baseDetails,
          note: ''
        },
        token
      )
      .then(res => {
        this.refs.toast.show('Đã thêm vào yêu thích!');
      })
      .catch(err => {
      });
  };

  updateIndex = index => {
    this.state.webWiewRef && this.state.webWiewRef.stopLoading();
    this.setState({
      selectedIndex: index,
      url: this.state.urls[index],
      orderEnabled: false,
      acceptAddToCart: false
    });
    this.state.webWiewRef && this.state.webWiewRef.forceUpdate();
  };

  goBack = () => {
    this.state.webWiewRef && this.state.webWiewRef.goBack();
  };

  goForward = () => {
    this.state.webWiewRef && this.state.webWiewRef.goForward();
  };

  onWebViewMessage = e => {
    const message = JSON.parse(e.nativeEvent.data);
    switch (message.action) {
      case 'onLoad': {
        if (this.state.orderEnabled != false) {
          this.setState({
            acceptAddToCart: false,
            orderEnabled: false
          });
        }
        break;
      }
      case 'orderOn': {
        if (this.state.orderEnabled != true) {
          this.setState({
            orderEnabled: true
          });
        }
        break;
      }
      case 'orderDetail': {

          if (
            message.data && message.data.price &&
            message.data.price != this.state.itemDetails.price
          ) {
            this.getPrice(message.data.price);
          }
          if (
            !isEqual(this.state.itemDetails, message.data) ||
            !isEqual(this.state.baseDetails != message.base)
          ) {
            this.setState({
              acceptAddToCart: message.data && message.data.price && message.data.price > 0 ? true : false,
              itemDetails: message.data,
              baseDetails: message.base
            });
          }
      }
      case 'error': {
        if(message.isError && message.isError == true && message.error && message.error != ''){
          Alert.alert('Lỗi',message.error);
        }
      }
      case 'consoleCustom' : {
        console.log(message.message);
      }
    }
  };

  setRefWebview = WEBVIEW_REF => {
    this.state.webWiewRef = WEBVIEW_REF;
  };

  onToggleDrawer = () => {
    if (!this.props.isLogged) {
      this.props.goLogin();
    } else {
      this.props.toggleDrawer();
    }
  };

  render() {
    const { selectedIndex, orderEnabled } = this.state;
    const buttons = [
      {
        element: () => (
          <Text
            style={{
              fontWeight: 'bold',
              color: selectedIndex == 0 ? Colors.mainColor : '#ccc'
            }}>
            Taobao
          </Text>
        )
      },
      {
        element: () => (
          <Text
            style={{
              fontWeight: 'bold',
              color: selectedIndex == 1 ? Colors.mainColor : '#ccc'
            }}>
            Tmall
          </Text>
        )
      },
      {
        element: () => (
          <Text
            style={{
              fontWeight: 'bold',
              color: selectedIndex == 2 ? Colors.mainColor : '#ccc'
            }}>
            1688
          </Text>
        )
      }
    ];

    onNavigationStateChange = e => {
      this.state.hasNavChange = true;
    };

    return (

      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingTop: Constants.paddingTop,
            backgroundColor: Colors.primaryColor
          }}>
          <View
            style={{
              ...flexInline,
              ...flexVCenter,
              ...flexCenter,
              padding: 0,
              margin: 0,
              height: 56
            }}>
            <TouchableOpacity
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                width: 56,
                ...flexCenter,
                ...flexVCenter
              }}
              onPress={this.onToggleDrawer}>
              <FontAwesome size={20} name="th-list" color={'white'} />
            </TouchableOpacity>

            <SearchBar
              lightTheme
              inputStyle={{
                ...flex,
                ...flexVCenter,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: 'white'
              }}
              noIcon
              containerStyle={{
                ...flex,
                ...flexVCenter,
                padding: 0,
                backgroundColor: 'transparent',
                marginTop: 0,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent'
              }}
              onSubmitEditing={this.searchAction}
              selectTextOnFocus={true}
              defaultValue={this.state.keyword}
              returnKeyType="search"
              placeholder="Tìm kiếm hoặc nhập đường dẫn (Link)..."
            />
          </View>
        </View>

        <ButtonGroup
          containerStyle={{ height: 35 }}
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
        />

        <View style={{ ...flex, margin: 0, position: 'relative' }}>
          <WebView
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0
            }}
            ref={this.setRefWebview}
            injectedJavaScript={patchPostMessageJsCode}
            mixedContentMode="always"
            allowUniversalAccessFromFileURLs={true}
            domStorageEnabled={true}
            onMessage={this.onWebViewMessage}
            onNavigationStateChange={this.onNavigationStateChange}
            source={{ uri: this.state.url }}
          />
          {this.state.showOrder && (
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
              <Card containerStyle={{ borderRadius: 5 }}>
                <View style={{ ...flexInline, ...flexVCenter, padding: 5 }}>
                  <Text
                    style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 15 }}>
                    Xác nhận đơn hàng
                  </Text>
                </View>
                <Divider />
                <View style={{ ...flexInline, padding: 5 }}>
                  <Avatar
                    large
                    source={{
                      uri: this.state.itemDetails.image
                    }}
                  />
                  <View style={{ ...flex, marginLeft: 10 }}>
                    <Text
                      style={{
                        color: Colors.primaryColor,
                        fontWeight: 'bold'
                      }}>
                      {this.state.itemDetails.name}
                    </Text>
                    <Text>
                      Số lượng:{' '}
                      <Text
                        style={{ color: Colors.mainColor, fontWeight: 'bold' }}>
                        {this.state.itemDetails.quantity}
                      </Text>
                    </Text>
                    <Text>
                      Tổng tiền:{' '}
                      <Text
                        style={{ color: Colors.mainColor, fontWeight: 'bold' }}>
                        {(
                          this.state.amountVND * this.state.itemDetails.quantity
                        ).formatMoney(2, ',', '.')}{' '}
                        VNĐ
                      </Text>
                    </Text>
                    {this.state.itemDetails.properties && (
                      <View>
                        <Text style={{ fontWeight: 'bold' }}>Thuộc tính: </Text>
                        {this.state.itemDetails.properties.map(prop => {
                          return (
                            <Text key={prop.name}>
                              {prop.name}:{' '}
                              <Text style={{ color: Colors.mainColor }}>
                                {prop.value}
                              </Text>
                            </Text>
                          );
                        })}
                      </View>
                    )}
                  </View>
                </View>
                <View style={{ ...flexInline, padding: 5 }}>
                  <TextInput
                    onChangeText={value =>
                      this.setState({
                        note: value
                      })
                    }
                    placeholder="Ghi chú"
                    style={{
                      borderRadius: 5,
                      borderWidth: 1,
                      width: '100%',
                      padding: 5,
                      borderColor: '#eee',
                      borderStyle: 'dashed'
                    }}
                  />
                </View>
                <Divider />
                <View
                  style={{
                    ...flexInline,
                    ...flexCenter,
                    ...flexVCenter,
                    padding: 5
                  }}>
                  <Button
                    icon={{ name: 'backspace', type: 'material-icons' }}
                    buttonStyle={{ borderRadius: 5 }}
                    onPress={() =>
                      this.setState({
                        showOrder: false
                      })
                    }
                    title="Quay lại"
                  />
                  <Button
                    onPress={() => this.saveOrder()}
                    icon={{ name: 'cart-plus', type: 'font-awesome' }}
                    buttonStyle={{
                      borderRadius: 5,
                      backgroundColor: Colors.mainColor
                    }}
                    title="Xác nhận"
                  />
                </View>
              </Card>
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
                <View style={{ ...flexInline, ...flexCenter }}>
                  <Button
                    icon={{ name: 'backspace', type: 'material-icons' }}
                    buttonStyle={{ borderRadius: 5 }}
                    onPress={() =>
                      this.setState({
                        showSuccess: false
                      })
                    }
                    title="Quay lại"
                  />
                  <Button
                    onPress={() => {
                      this.setState({ showSuccess: false });
                      this.props.goCart();
                    }}
                    icon={{ name: 'cart-plus', type: 'font-awesome' }}
                    buttonStyle={{
                      borderRadius: 5,
                      backgroundColor: Colors.mainColor
                    }}
                    title="Đến giỏ hàng"
                  />
                </View>
              </Card>
            </View>
          )}
          {this.state.loading && (
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
              <Button
                title="Đang tải..."
                buttonStyle={{ borderRadius: 5 }}
                loading
              />
            </View>
          )}
        </View>
        <Divider />
        <SafeAreaView style={{ backgroundColor: 'white' }}>
          <View
            style={{
              ...flexInline,
              ...flexVCenter,
              ...flexCenter,
              height: 48,
              backgroundColor: '#fff'
            }}>
            <Icon
              onPress={this.goBack}
              name="chevron-left"
              type="font-awesome"
              iconStyle={{ width: 50, textAlign: 'center', color: '#888' }}
            />
            <Icon
              onPress={this.goForward}
              name="chevron-right"
              type="font-awesome"
              iconStyle={{ width: 50, textAlign: 'center', color: '#888' }}
            />
            <View style={{ ...flex, ...flexVCenter }}>
              {(this.props.isLogged && (
                <Button
                  onPress={this.addTocart}
                  disabled={!orderEnabled}
                  icon={{
                    name: this.state.acceptAddToCart ? 'cart-plus' : 'opencart',
                    type: 'font-awesome'
                  }}
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: Colors.premiumColor
                  }}
                  title={this.state.acceptAddToCart ? 'Mua hàng' : 'Chọn SP'}
                />
              )) || (
                <Button
                  onPress={this.addTocart}
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: Colors.primaryColor
                  }}
                  title={'ĐĂNG NHẬP'}
                />
              )}
            </View>
            <Icon
              onPress={this.refresh}
              name="refresh"
              type="font-awesome"
              iconStyle={{ width: 50, textAlign: 'center', color: '#888' }}
            />
            {this.props.isLogged && (
              <Icon
                disabled={!orderEnabled}
                onPress={() => this.saveToFavorites()}
                name="heart"
                type="font-awesome"
                iconStyle={{
                  width: 50,
                  textAlign: 'center',
                  color: '#FF4136',
                  opacity: orderEnabled ? 1 : 0.3
                }}
              />
            )}
          </View>
        </SafeAreaView>
        <Toast ref="toast" />
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
  toggleDrawer,
  goCart,
  goLogin
};
export default connect(mapStateToProps, mapDispatchToProps)(MyHomeScreen);
