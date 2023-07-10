import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from 'configs';
import Text from './Text';

export default class Button extends React.PureComponent {
  render() {
    const { style, text, onPress, isLoading, textStyle } = this.props;
    return (
      <TouchableOpacity
        disabled={isLoading}
        onPress={onPress}
        style={[
          {
            borderRadius: 3,
            backgroundColor: Colors.Primary,
            paddingVertical: 12,
            paddingHorizontal: 17,
            alignItems: 'center'
          },
          style
        ]}>
        {(isLoading && <ActivityIndicator color={'white'} />) || (
          <Text bold style={[{ color: 'white', fontSize: 16 }, textStyle]}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}
