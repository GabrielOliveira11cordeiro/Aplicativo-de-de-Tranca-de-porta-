// src/components/Input.tsx

import React, { Dispatch, SetStateAction } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

// --- 1. Definição da Interface (Props) ---

/**
 * Interface para o componente Input, estendendo as props nativas do TextInput.
 */
interface InputProps extends TextInputProps {
  label?: string;
  // O valor e onChangeText são obrigatórios para uso controlado
  value: string;
  onChangeText: Dispatch<SetStateAction<string>> | ((text: string) => void);
  placeholder?: string;
  
  // Props de estilização para customização externa
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}


// --- 2. Componente Funcional ---

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  containerStyle,
  labelStyle,
  inputStyle,
  ...rest
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Rótulo (Label) opcional */}
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}

      {/* Campo de Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="white" // Cinza sutil para o placeholder
        secureTextEntry={secureTextEntry}
        
        // Aplica o estilo padrão e permite a sobrescrita externa
        style={[styles.input, inputStyle]} 
        
        // Passa todas as outras props (keyboardType, maxLength, etc.)
        {...rest}
      />
    </View>
  );
}


// --- 3. Estilos (StyleSheet) ---

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },

  label: {
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 14,
    color: '#ffff', // Texto escuro
  },

  input: {
    backgroundColor: '#ffffff', // Fundo branco
    borderWidth: 1,
    borderColor: '#e5e7eb', // Borda cinza clara
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#1f2937', // Texto digitado escuro
    
    // Sombra sutil (melhora a aparência no iOS/Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Sombra para Android
  },
});