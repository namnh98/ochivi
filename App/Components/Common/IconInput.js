import React from 'react';
import { View, Image, TextInput } from 'react-native';
import { Colors } from 'configs';

export default class IconInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: !!this.props.focused,
      value: this.props.value || ''
    };
  }

  onChangeText = value => {
    this.setState({ value }, () => {
      const { onChangeText } = this.props;
      if (typeof onChangeText === 'function') {
        onChangeText(value);
      }
    });
  };

  onFocusChange = focused => () => {
    this.setState({ focused });
  };

  render() {
    const {
      icon,
      placeholder,
      containerStyle,
      textInputStyle,
      iconStyle,
      inputProps,
      secureTextEntry
    } = this.props;
    const { focused } = this.state;
    return (
      <View
        style={[
          {
            alignItems: 'center',
            flexDirection: 'row',
            borderBottomColor: focused ? Colors.Secondary : '#eee',
            borderBottomWidth: 1,
            paddingVertical: 5,
            marginBottom: 15
          },
          containerStyle
        ]}>
        {!!icon && (
          <Image
            source={icon}
            style={[
              {
                width: 20,
                height: 20,
                tintColor: focused ? Colors.Secondary : '#777'
              },
              iconStyle
            ]}
          />
        )}
        <TextInput
          style={[
            {
              flex: 1,
              paddingVertical: 7,
              paddingHorizontal: 15,
              fontSize: 16,
              margin: 0,
              color: 'black'
            },
            textInputStyle
          ]}
          secureTextEntry={secureTextEntry}
          autoCapitalize={'none'}
          autoCompleteType={'off'}
          autoCorrect={false}
          onFocus={this.onFocusChange(true)}
          onBlur={this.onFocusChange(false)}
          placeholder={placeholder}
          placeholderTextColor={'#999'}
          onChangeText={this.onChangeText}
          value={this.value}
          {...inputProps}
        />
      </View>
    );
  }
}
