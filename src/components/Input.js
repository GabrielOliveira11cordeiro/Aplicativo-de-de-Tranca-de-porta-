// src/components/Input.js
import { Text, TextInput, View } from 'react-native';

export default function Input({ label, value, onChangeText, placeholder, secureTextEntry }) {
  return (
    <View style={{ marginVertical: 8 }}>
      {label ? <Text style={{ marginBottom: 4 }}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 6,
        }}
      />
    </View>
  );
}
