import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  className?: string;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-gray-800 active:bg-gray-900',
  secondary: 'bg-gray-100 active:bg-gray-200',
  outline: 'bg-transparent border-2 border-gray-800',
  ghost: 'bg-transparent',
  danger: 'bg-red-600 active:bg-red-700',
};

const textVariantStyles = {
  primary: 'text-white',
  secondary: 'text-gray-800',
  outline: 'text-gray-800',
  ghost: 'text-gray-800',
  danger: 'text-white',
};

const sizeStyles = {
  sm: 'px-3 py-2 rounded-lg',
  md: 'px-5 py-3 rounded-xl',
  lg: 'px-6 py-4 rounded-xl',
};

const textSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''
        } ${disabled ? 'opacity-50' : ''} ${className}`}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#4F46E5' : 'white'} />
      ) : (
        <>
          {icon && <Text className="mr-2">{icon}</Text>}
          <Text className={`font-semibold ${textVariantStyles[variant]} ${textSizeStyles[size]}`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
