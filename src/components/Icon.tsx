import React from 'react';
import { Text } from 'react-native';

const icons: Record<string, string> = {
  home: '🏠',
  search: '🔍',
  cart: '🛒',
  user: '👤',
  heart: '❤️',
  'heart-outline': '🤍',
  star: '⭐',
  'star-half': '⭐',
  back: '←',
  forward: '→',
  close: '✕',
  check: '✓',
  plus: '+',
  minus: '−',
  edit: '✏️',
  delete: '🗑️',
  location: '📍',
  phone: '📞',
  email: '✉️',
  lock: '🔒',
  unlock: '🔓',
  eye: '👁️',
  'eye-off': '🙈',
  credit: '💳',
  gift: '🎁',
  trophy: '🏆',
  bell: '🔔',
  settings: '⚙️',
  logout: '🚪',
  camera: '📷',
  package: '📦',
  truck: '🚚',
  receipt: '🧾',
  shield: '🛡️',
  clock: '🕐',
  calendar: '📅',
  filter: '⚙️',
  sort: '↕️',
  share: '📤',
  copy: '📋',
  download: '⬇️',
  chevron_right: '›',
  chevron_down: '⌄',
  warning: '⚠️',
  info: 'ℹ️',
  success: '✅',
  error: '❌',
  tag: '🏷️',
  percent: '%',
  coins: '🪙',
  sparkle: '✨',
  fire: '🔥',
  refresh: '🔄',
  qr: '📱',
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className = '' }: IconProps) {
  return (
    <Text style={{ fontSize: size }} className={className}>
      {icons[name] || '•'}
    </Text>
  );
}
