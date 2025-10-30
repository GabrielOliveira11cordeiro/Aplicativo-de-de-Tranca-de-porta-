import React, { Dispatch, SetStateAction } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

// Define uma interface que estende as props padrão do TextInput
interface InputProps extends TextInputProps {
    label?: string;
    // O valor e onChangeText são obrigatórios para um campo de formulário
    value: string;
    onChangeText: Dispatch<SetStateAction<string>> | ((text: string) => void);
    placeholder?: string;
    // Props como secureTextEntry, keyboardType, editable, e maxLength
    // são herdadas de TextInputProps, resolvendo os erros de tipagem (TS2322).
}


export default function Input({ label, value, onChangeText, placeholder, secureTextEntry, ...rest }: InputProps) {
  return (
    <View style={{ marginVertical: 8 }}>
      {label ? <Text style={{ marginBottom: 4, fontWeight: '500', color: '#333' }}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        // Passa todas as outras props (keyboardType, editable, maxLength, etc.)
        {...rest} 
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          backgroundColor: '#fff',
          fontSize: 16,
        }}
      />
    </View>
  );
}
