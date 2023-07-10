import React, {Component} from 'react';
import {Text, Platform} from 'react-native';
import {Colors} from 'configs/Colors';

const FONT_NAME = '';

export default Text;

// export default class Txt extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const { semibold, italic, bold } = this.props;

//     let { style } = this.props;
//     let style2 = {};
//     for (const key in style) {
//       if (typeof style[key] === 'object') {
//         style2 = { ...style2, ...style[key] };
//       } else if (style[key] !== undefined) {
//         style2[key] = style[key];
//       }
//     }
//     style = style2;

//     let fontStyle = 'Regular';
//     if (style.fontWeight) {
//       if (style.fontWeight === 'normal') {
//         fontStyle = 'Regular';
//       } else if (style.fontWeight === 'italic') {
//         fontStyle = 'Italic';
//       } else if (style.fontWeight === 'bold') {
//         fontStyle = 'SemiBold';
//       }
//       style.fontWeight = null;
//     }

//     if (semibold) fontStyle = 'SemiBold';
//     if (italic) fontStyle = 'Italic';
//     if (bold) fontStyle = 'SemiBold';

//     return (
//       <Text
//         {...this.props}
//         style={[
//           {
//             fontFamily: FONT_NAME + '-' + fontStyle,
//             color: Colors.Text
//           },
//           style
//         ]}>
//         {this.props.children}
//       </Text>
//     );
//   }
// }
