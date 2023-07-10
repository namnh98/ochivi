import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  StyleSheet,
  Text
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default class Select extends React.Component {
  state = {
    seletedValue: ''
  };
  onValueChange = seletedValue => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      if (Platform.OS === 'android') {
        onChange(seletedValue);
      } else {
        this.setState({ seletedValue });
      }
    }
  };
  onDonePress = () => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      console.log(this.state.seletedValue);
      onChange(this.state.seletedValue);
    }
  };
  render() {
    const { placeholder = 'Chose an option', items = [] } = this.props;
    let ph = placeholder;
    if (!!this.state.seletedValue) {
      const item = items.find(x => x.value == this.state.seletedValue);
      if (item) {
        ph = item.label;
      }
    }

    return (
      <View
        style={[
          {
            marginBottom: 15,
            paddingVertical: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#F0f0f0'
          },
          this.props.style
        ]}>
        <RNPickerSelect
          onDonePress={this.onDonePress}
          onValueChange={this.onValueChange}
          style={pickerSelectStyles}
          items={items}
          placeholder={{ label: placeholder, value: '' }}
          useNativeAndroidPickerStyle>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10
            }}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1}>{ph}</Text>
            </View>
            <View
              style={{
                backgroundColor: 'transparent',
                borderTopWidth: 7,
                borderTopColor: '#A9AEBE',
                borderRightWidth: 7,
                borderRightColor: 'transparent',
                borderLeftWidth: 7,
                borderLeftColor: 'transparent',
                width: 0,
                height: 0
              }}
            />
          </View>
        </RNPickerSelect>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 10,
    flex: 1
  }
});

const pickerSelectStyles = StyleSheet.create({
  iconContainer: {
    width: 0,
    height: 0
  }
});
