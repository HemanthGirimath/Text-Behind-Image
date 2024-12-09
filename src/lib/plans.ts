import { TextStyle } from './types'

export const DEFAULT_TEXT_STYLE: TextStyle = {
  id: '',
  // Free Plan Features
  text: '',
  x: 50,
  y: 50,
  fontSize: 48,
  fontFamily: 'Arial',
  color: '#000000',
  align: 'center' as const,
  style: {
    bold: false,
    italic: false,
    underline: false
  },
  opacity: 100,
  rotation: 0,
  letterSpacing: 0,
  shadow: {
    enabled: false,
    color: '#000000',
    blur: 4,
    offsetX: 0,
    offsetY: 4
  },
  glow: {
    enabled: false,
    color: '#ffffff',
    blur: 20,
    intensity: 1
  },
  outline: {
    enabled: false,
    color: '#000000',
    width: 2
  },
  gradient: {
    enabled: false,
    colors: ['#ff0000', '#00ff00']
  },
  transform: {
    enabled: false,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0
  },
};

export type PlanType = 'free' | 'basic' | 'premium';

export type FeatureType = 
  | 'basic_text'
  | 'basic_position'
  | 'font_customization'
  | 'text_effects'
  | 'advanced_effects'
  | 'background_removal'
  | 'export_options'
  | 'templates'
  | 'priority_support';

export const PLAN_PRICES = {
  free: 0,
  basic: 900,  // ₹900
  premium: 1900 // ₹1900
};

export const PLAN_FEATURES: Record<PlanType, FeatureType[]> = {
  free: [
    'basic_text',
    'basic_position'
  ],
  basic: [
    'basic_text',
    'basic_position',
    'font_customization',
    'text_effects',
    'background_removal'
  ],
  premium: [
    'basic_text',
    'basic_position',
    'font_customization',
    'text_effects',
    'advanced_effects',
    'background_removal',
    'export_options',
    'templates',
    'priority_support'
  ]
};

export const FEATURE_DESCRIPTIONS: Record<FeatureType, string> = {
  basic_text: 'Add and edit text',
  basic_position: 'Basic text positioning',
  font_customization: 'Custom fonts and sizes',
  text_effects: 'Basic text effects (shadow, outline)',
  advanced_effects: 'Advanced effects (gradient, glow, transforms)',
  background_removal: 'Background removal tool',
  export_options: 'Multiple export formats',
  templates: 'Premium templates',
  priority_support: 'Priority customer support'
};

export type { TextStyle };
