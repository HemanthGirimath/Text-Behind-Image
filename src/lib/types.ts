export interface TextStyle {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  color: string;
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  style: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  // Basic plan features
  shadow: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  gradient: {
    enabled: boolean;
    startColor: string;
    endColor: string;
    angle: number;
  };
  transform: {
    skewX: number;
    skewY: number;
    scale: number;
  };
  // Premium plan features
  effectTemplate?: string;
  language?: string;
  aiGenerated?: boolean;
  blur: number;
}
