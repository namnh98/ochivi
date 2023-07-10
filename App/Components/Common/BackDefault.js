import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';

import { goBack } from 'actions/nav';

import imgBack from 'images/Back.png';

export default connect(state => ({}), { goBack })(
  class BackDefault extends React.PureComponent {
    render() {
      return (
        <TouchableOpacity
          onPress={this.props.goBack}
          style={{
            paddingHorizontal: 18,
            paddingVertical: 11,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Image
            source={imgBack}
            style={[
              { width: 16, height: 16, tintColor: 'white' },
              this.props.imageStyle
            ]}
          />
        </TouchableOpacity>
      );
    }
  }
);
