import React from 'react';
import { Divider } from 'react-native-elements';
export default class DividerFix extends React.Component {
  render() {
    return (
      <Divider
        style={{
          height: 0.5,
          backgroundColor: '#e1e8ee',
          margin: 0,
          opacity: 0.8,
          ...this.props.style
        }}
      />
    );
  }
}
