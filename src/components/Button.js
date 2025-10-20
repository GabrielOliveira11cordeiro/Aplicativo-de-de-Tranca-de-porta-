// src/components/Button.js
import { Text, TouchableOpacity } from 'react-native';

export default function Button({ title, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#9dd1b6' : '#2ecc71',
        padding: 12,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>{title}</Text>
    </TouchableOpacity>
  );
}
