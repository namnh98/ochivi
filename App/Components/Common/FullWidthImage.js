import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class FullWidthImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: props.initialWidth || 0,
      height: props.initialHeight || 0
    };
  }

  _onLayout(event) {
    const containerWidth = event.nativeEvent.layout.width;

    if (this.props.ratio) {
      if (this.props.onLayout)
        this.props.onLayout({
          width: containerWidth,
          height: containerWidth * this.props.ratio
        });
      this.setState({
        width: containerWidth,
        height: containerWidth * this.props.ratio
      });
    } else {
      Image.getSize(this.props.source, (width, height) => {
        this.setState({
          width: containerWidth,
          height: (containerWidth * height) / width
        });
      });
    }
  }

  render() {
    return (
      <View
        style={[
          {
            backgroundColor: '#ddd'
          },
          this.props.style
        ]}
        onLayout={this._onLayout.bind(this)}>
        <Image
          source={this.props.source}
          style={{
            width: this.state.width,
            height: this.state.height
          }}
        />
      </View>
    );
  }
}
