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
  // Free Plan
  | 'basic_text'
  | 'basic_fonts'
  | 'font_size'
  | 'letter_spacing'
  | 'basic_position'
  | 'basic_color'
  | 'text_alignment'
  // Basic Plan
  | 'text_styles'
  | 'opacity'
  | 'rotation'
  // Premium Plan
  | 'shadows'
  | 'gradients'
  | 'glow'
  | 'outlines'
  | 'transform'
  | 'unlimited_layers';

export const PLAN_FEATURES: Record<PlanType, FeatureType[]> = {
  free: [
    'basic_text',
    'basic_position',
    'basic_fonts',
    'font_size',
    'letter_spacing',
    'basic_color',
    'text_alignment'
  ],
  basic: [
    'text_styles',
    'opacity',
    'rotation'
  ],
  premium: [
    'shadows',
    'gradients',
    'glow',
    'outlines',
    'transform',
    'unlimited_layers'
  ]
};

export type { TextStyle };
