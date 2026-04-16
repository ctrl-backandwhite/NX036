import React from 'react';
import FA5 from 'react-native-vector-icons/FontAwesome5';

// Mapeo de nombres internos a iconos de FontAwesome5
const iconMap: Record<string, { name: string; solid?: boolean }> = {
  home: { name: 'home', solid: true },
  search: { name: 'search', solid: true },
  cart: { name: 'shopping-cart', solid: true },
  user: { name: 'user', solid: true },
  heart: { name: 'heart', solid: true },
  'heart-outline': { name: 'heart' },
  star: { name: 'star', solid: true },
  'star-half': { name: 'star-half-alt', solid: true },
  back: { name: 'chevron-left', solid: true },
  forward: { name: 'chevron-right', solid: true },
  close: { name: 'times', solid: true },
  check: { name: 'check', solid: true },
  plus: { name: 'plus', solid: true },
  minus: { name: 'minus', solid: true },
  edit: { name: 'pen', solid: true },
  delete: { name: 'trash-alt', solid: true },
  location: { name: 'map-marker-alt', solid: true },
  phone: { name: 'phone', solid: true },
  email: { name: 'envelope', solid: true },
  lock: { name: 'lock', solid: true },
  unlock: { name: 'lock-open', solid: true },
  eye: { name: 'eye', solid: true },
  'eye-off': { name: 'eye-slash', solid: true },
  credit: { name: 'credit-card', solid: true },
  gift: { name: 'gift', solid: true },
  trophy: { name: 'trophy', solid: true },
  bell: { name: 'bell', solid: true },
  settings: { name: 'cog', solid: true },
  logout: { name: 'sign-out-alt', solid: true },
  camera: { name: 'camera', solid: true },
  package: { name: 'box', solid: true },
  truck: { name: 'truck', solid: true },
  receipt: { name: 'receipt', solid: true },
  shield: { name: 'shield-alt', solid: true },
  clock: { name: 'clock', solid: true },
  calendar: { name: 'calendar-alt', solid: true },
  filter: { name: 'filter', solid: true },
  sort: { name: 'sort', solid: true },
  share: { name: 'share-alt', solid: true },
  copy: { name: 'copy', solid: true },
  download: { name: 'download', solid: true },
  chevron_right: { name: 'chevron-right', solid: true },
  chevron_down: { name: 'chevron-down', solid: true },
  warning: { name: 'exclamation-triangle', solid: true },
  info: { name: 'info-circle', solid: true },
  success: { name: 'check-circle', solid: true },
  error: { name: 'times-circle', solid: true },
  tag: { name: 'tag', solid: true },
  percent: { name: 'percent', solid: true },
  coins: { name: 'coins', solid: true },
  sparkle: { name: 'magic', solid: true },
  fire: { name: 'fire', solid: true },
  refresh: { name: 'sync-alt', solid: true },
  qr: { name: 'qrcode', solid: true },
  store: { name: 'store', solid: true },
  orders: { name: 'list-alt', solid: true },
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 20, color = '#1e293b', className = '' }: IconProps) {
  const icon = iconMap[name];
  const faName = icon?.name ?? 'circle';
  const solid = icon?.solid ?? false;
  return <FA5 name={faName} size={size} color={color} solid={solid} />;
}
