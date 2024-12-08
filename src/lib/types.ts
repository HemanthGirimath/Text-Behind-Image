export interface TextStyle {
  id: string;
  
  // Free Plan Features
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  letterSpacing: number;

  // Basic Plan Features
  opacity: number;
  rotation: number;
  align: 'left' | 'center' | 'right';
  style: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };

  // Premium Plan Features
  shadow?: {
    enabled: boolean;
    blur: number;
    color: string;
    offsetX: number;
    offsetY: number;
  };
  gradient?: {
    enabled: boolean;
    colors: string[];
  };
  glow?: {
    enabled: boolean;
    blur: number;
    color: string;
    intensity: number;
  };
  outline?: {
    enabled: boolean;
    width: number;
    color: string;
  };
  transform?: {
    enabled: boolean;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
  };

  // Other properties
  _delete?: boolean;
}
