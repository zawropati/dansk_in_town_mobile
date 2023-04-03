import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput } from 'react-native';

const CustomInput = React.forwardRef((props, ref) => {
  const {
    keyboardType, placeholder, returnKeyType, secureTextEntry, onChangeText, value, onSubmitEditing,
  } = props;
  const [Color, setColor] = useState("fff");
  return (
    <TextInput
      autoCapitalize="none"
      underlineColorAndroid="transparent"
      onFocus={() => setColor('blue')}
      onBlur={() => setColor('green')}
      style={{ ...styles.input }}
      borderColor={Color}
      secureTextEntry={secureTextEntry}
      returnKeyType={returnKeyType}
      keyboardType={keyboardType}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      ref={ref}
      onSubmitEditing={onSubmitEditing}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#E9E9E8',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
    width: '100%',
    borderWidth: 1,
  },
});

CustomInput.propTypes = {
  returnKeyType: PropTypes.string,
  keyboardType: PropTypes.string,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
};
CustomInput.defaultProps = {
  returnKeyType: 'done',
  keyboardType: 'default',
  placeholder: '',
  secureTextEntry: false,
  value: '',
  onChangeText: () => {},
  onSubmitEditing: () => {},
};
export default CustomInput;
