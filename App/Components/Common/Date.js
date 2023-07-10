import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Text from 'components/Common/Text';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default class TI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      selected: props.selected || ''
    };
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({
      selected: moment(date).format('YYYY-MM-DD'),
      isDateTimePickerVisible: false
    });
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(moment(date).format('YYYY-MM-DD'));
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.selected != this.state.selected &&
      prevState.selected === ''
    ) {
      this.setState({
        selected: this.props.selected
      });
    }
  }

  render() {
    const {
      label,
      required,
      containerStyle,
      showError,
      valueStyle
    } = this.props;
    return (
      <View style={[{ marginBottom: 14 }, containerStyle]}>
        {!!label && (
          <Text h semibold style={{ marginBottom: 5 }}>
            {label}
            {required === true && <Text style={{ color: 'red' }}> *</Text>}
          </Text>
        )}
        <TouchableOpacity
          onPress={this.showDateTimePicker}
          style={[
            {
              flexDirection: 'row',
              margin: 0,
              borderBottomColor: '#eee',
              borderBottomWidth: 1,
              paddingTop: 14,
              paddingBottom: 12,
              backgroundColor: 'white',
              alignItems: 'center'
            },
            this.props.style
          ]}>
          <View style={[{ flex: 1 }, valueStyle]}>
            <Text h>{this.state.selected}</Text>
          </View>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          date={
            this.state.selected
              ? moment(this.state.selected).toDate()
              : new Date()
          }
          style={{ color: 'black' }}
        />
      </View>
    );
  }
}
