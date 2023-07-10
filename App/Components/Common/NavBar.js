import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Colors, Constants } from 'configs';
import BackDefault from './BackDefault';
import Text from './Text';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0
    };
    this.onLayout = this.onLayout.bind(this);
  }
  onLayout(event) {
    const width = event.nativeEvent.layout.width;
    if (width > this.state.width) {
      this.setState({ width });
    }
  }
  render() {
    const { hasBack, leftComponent, rightComponent, title } = this.props;
    return (
      <View
        style={{
          // paddingTop: Constants.paddingTop,
          paddingVertical: 5,
          backgroundColor: Colors.Primary
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            onLayout={this.onLayout}
            style={{
              minWidth: this.state.width
            }}>
            {(hasBack && <BackDefault />) || leftComponent}
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 8.4 }}>
            <Text style={{ fontSize: 16, color: 'white' }}>{title}</Text>
          </View>
          <View
            onLayout={this.onLayout}
            style={{
              minWidth: this.state.width
            }}>
            {rightComponent}
          </View>
        </View>
      </View>
    );
  }
}
