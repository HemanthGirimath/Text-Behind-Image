import { TextStyle } from './types'

export const DEFAULT_TEXT_STYLE: TextStyle = {
  id: '',
  text: '',
  x: 50,
  y: 50,
  fontSize: 48,
  fontFamily: 'Arial',
  color: '#000000',
  style: {
    bold: false,
    italic: false,
    underline: false
  },
  opacity: 100,
  rotation: 0,
  letterSpacing: 0,
  blur: 0,
  shadow: {
    enabled: false,
    color: '#000000',
    blur: 4,
    offsetX: 0,
    offsetY: 4
  },
  gradient: {
    enabled: false,
    startColor: '#ff0000',
    endColor: '#00ff00',
    angle: 0
  },
  transform: {
    skewX: 0,
    skewY: 0,
    scale: 1
  }
};

export type PlanType = 'free' | 'basic' | 'premium';

export type SectionType = 'basic-text' | 'text-styling' | 'advanced-styling' | 'effects';

// Define the sections available in each plan
export const PLAN_SECTIONS: Record<PlanType, SectionType[]> = {
  free: ['basic-text'],
  basic: ['basic-text', 'text-styling'],
  premium: ['basic-text', 'text-styling', 'advanced-styling', 'effects']
} as const;

export type FeatureType = 
  | 'text-input'           // Basic text input
  | 'basic-fonts'          // 5 basic fonts
  | 'positioning'          // x, y coordinates
  | 'basic-colors'         // Basic color selection
  | 'single-layer'         // Single text layer
  | 'unlimited-fonts'      // Unlimited fonts (Basic+)
  | 'multiple-layers'      // Multiple text layers (Basic+)
  | 'bold'                 // Text styling (Basic+)
  | 'italic'               // Text styling (Basic+)
  | 'underline'           // Text styling (Basic+)
  | 'letter-spacing'      // Letter spacing (Basic+)
  | 'opacity'             // Opacity control (Basic+)
  | 'alignment'           // Text alignment (Basic+)
  | 'rotation'            // Rotation (Basic+)
  | 'shadows'             // Shadow effects (Premium)
  | 'gradients'           // Gradient effects (Premium)
  | 'glow'                // Glow effects (Premium)
  | 'outlines'            // Outline effects (Premium)
  | 'transform';          // Transform options (Premium)

// Define features available in each plan
export const PLAN_FEATURES: Record<PlanType, FeatureType[]> = {
  free: [
    'text-input',
    'basic-fonts',
    'positioning',
    'basic-colors',
    'single-layer'
  ],
  basic: [
    'text-input',
    'basic-fonts',
    'positioning',
    'basic-colors',
    'single-layer',
    'unlimited-fonts',
    'multiple-layers',
    'bold',
    'italic',
    'underline',
    'letter-spacing',
    'opacity',
    'alignment',
    'rotation'
  ],
  premium: [
    'text-input',
    'basic-fonts',
    'positioning',
    'basic-colors',
    'single-layer',
    'unlimited-fonts',
    'multiple-layers',
    'bold',
    'italic',
    'underline',
    'letter-spacing',
    'opacity',
    'alignment',
    'rotation',
    'shadows',
    'gradients',
    'glow',
    'outlines',
    'transform'
  ]
} as const;

export const FEATURE_DESCRIPTIONS: Record<FeatureType, string> = {
  'text-input': 'Basic text input',
  'basic-fonts': '5 basic fonts',
  'positioning': 'Simple positioning (x, y coordinates)',
  'basic-colors': 'Basic color selection',
  'single-layer': 'Single text layer',
  'unlimited-fonts': 'Unlimited fonts',
  'multiple-layers': 'Multiple text layers (up to 3)',
  'bold': 'Bold text styling',
  'italic': 'Italic text styling',
  'underline': 'Underline text styling',
  'letter-spacing': 'Letter spacing control',
  'opacity': 'Opacity control',
  'alignment': 'Text alignment options',
  'rotation': 'Rotation control',
  'shadows': 'Shadow effects',
  'gradients': 'Gradient effects',
  'glow': 'Glow effects',
  'outlines': 'Outline effects',
  'transform': 'Transform options (skew, scale)'
};

// Define the features in each section
export const SECTION_FEATURES: Record<SectionType, FeatureType[]> = {
  'basic-text': [
    'text-input',
    'basic-fonts',
    'positioning',
    'basic-colors',
    'single-layer'
  ],
  'text-styling': [
    'unlimited-fonts',
    'multiple-layers',
    'bold',
    'italic',
    'underline',
    'letter-spacing',
    'opacity',
    'alignment',
    'rotation'
  ],
  'advanced-styling': [
    'transform'
  ],
  'effects': [
    'shadows',
    'gradients',
    'glow',
    'outlines'
  ]
} as const;

export const PLAN_PRICES = {
  free: 0,
  basic: 10,
  premium: 20
} as const;

export type { TextStyle };
