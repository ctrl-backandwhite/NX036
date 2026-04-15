import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3 px-1">
      <Text className="text-lg font-bold text-slate-800">{title}</Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text className="text-sm font-semibold text-indigo-600">{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface BadgeProps {
  count: number;
  className?: string;
}

export function Badge({ count, className = '' }: BadgeProps) {
  if (count <= 0) return null;
  return (
    <View className={`absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center ${className}`}>
      <Text className="text-white text-[10px] font-bold">{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionTitle, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-xl font-bold text-slate-800 text-center mb-2">{title}</Text>
      <Text className="text-sm text-slate-500 text-center mb-6">{description}</Text>
      {actionTitle && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="bg-indigo-600 px-6 py-3 rounded-xl">
          <Text className="text-white font-semibold">{actionTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return <View className={`h-px bg-slate-100 my-3 ${className}`} />;
}

interface PriceRowProps {
  label: string;
  value: number;
  isBold?: boolean;
  isDiscount?: boolean;
  isTotal?: boolean;
}

export function PriceRow({ label, value, isBold = false, isDiscount = false, isTotal = false }: PriceRowProps) {
  return (
    <View className={`flex-row items-center justify-between py-1 ${isTotal ? 'pt-3 border-t border-slate-200' : ''}`}>
      <Text className={`${isBold || isTotal ? 'font-bold text-base' : 'text-sm'} ${isDiscount ? 'text-emerald-600' : 'text-slate-600'}`}>
        {label}
      </Text>
      <Text className={`${isBold || isTotal ? 'font-bold text-lg' : 'text-sm'} ${isDiscount ? 'text-emerald-600' : 'text-slate-800'}`}>
        {isDiscount ? '-' : ''}€{Math.abs(value).toFixed(2)}
      </Text>
    </View>
  );
}
