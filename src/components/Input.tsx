import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  leftIcon?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
  maxLength?: number;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  leftIcon,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  className = '',
  maxLength,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-slate-700 mb-1.5">{label}</Text>
      )}
      <View
        className={`flex-row items-center border rounded-xl px-4 ${
          isFocused ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 bg-slate-50'
        } ${error ? 'border-red-400 bg-red-50/30' : ''} ${disabled ? 'opacity-60 bg-slate-100' : ''}`}>
        {leftIcon && <Text className="mr-3 text-lg">{leftIcon}</Text>}
        <TextInput
          className={`flex-1 text-base text-slate-800 ${multiline ? 'min-h-[100px]' : 'h-12'}`}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="text-lg">{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
}
