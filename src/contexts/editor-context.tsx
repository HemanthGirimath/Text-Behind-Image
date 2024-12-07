import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { TextStyle } from '@/app/textBehindImage/textEditor';
import type { ImageAdjustments } from '@/app/textBehindImage/imageAdjustments';

interface EditorState {
  image: string | null;
  textStyles: TextStyle[];
  imageAdjustments: ImageAdjustments;
  activeTextIndex: number;
}

type EditorAction = 
  | { type: 'SET_IMAGE'; payload: string | null }
  | { type: 'UPDATE_TEXT_STYLE'; payload: { index: number; style: TextStyle } }
  | { type: 'ADD_TEXT_STYLE'; payload: TextStyle }
  | { type: 'DELETE_TEXT_STYLE'; payload: number }
  | { type: 'SET_ACTIVE_TEXT_INDEX'; payload: number }
  | { type: 'SET_IMAGE_ADJUSTMENTS'; payload: ImageAdjustments }
  | { type: 'RESET_STATE' };

const defaultImageAdjustments: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  opacity: 100,
  filters: {
    grayscale: false,
    sepia: false,
    invert: false
  }
};

const initialState: EditorState = {
  image: null,
  textStyles: [{
    text: 'Enter text here',
    fontSize: 48,
    fontFamily: 'Arial',
    color: '#ffffff',
    x: 50,
    y: 50,
    letterSpacing: 0,
    opacity: 1,
    rotation: 0,
    direction: 'horizontal',
    align: 'center',
    verticalAlign: 'middle',
    transform: {
      scale: { x: 1, y: 1 },
      skew: { x: 0, y: 0 }
    },
    style: {
      bold: false,
      italic: false,
      underline: false,
      stroke: {
        enabled: true,
        width: 2,
        color: '#000000'
      }
    },
    effects: {
      shadow: {
        enabled: true,
        blur: 5,
        color: '#000000',
        offsetX: 2,
        offsetY: 2
      },
      glow: {
        enabled: false,
        blur: 10,
        color: '#ffffff',
        strength: 1
      },
      gradient: {
        enabled: false,
        type: 'linear',
        colors: ['#ff0000', '#00ff00'],
        angle: 0
      },
      outline: {
        enabled: false,
        width: 2,
        color: '#000000',
        blur: 0
      }
    },
    watermark: {
      enabled: false,
      text: '',
      position: 'bottom-right',
      fontSize: 24
    }
  }],
  imageAdjustments: defaultImageAdjustments,
  activeTextIndex: 0
};

const STORAGE_KEY = 'editor_state';

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_IMAGE':
      return { ...state, image: action.payload };
    case 'UPDATE_TEXT_STYLE': {
      const newTextStyles = [...state.textStyles];
      newTextStyles[action.payload.index] = action.payload.style;
      return { ...state, textStyles: newTextStyles };
    }
    case 'ADD_TEXT_STYLE':
      return {
        ...state,
        textStyles: [...state.textStyles, action.payload],
        activeTextIndex: state.textStyles.length
      };
    case 'DELETE_TEXT_STYLE': {
      const newTextStyles = state.textStyles.filter((_, index) => index !== action.payload);
      return {
        ...state,
        textStyles: newTextStyles,
        activeTextIndex: Math.max(0, state.activeTextIndex - 1)
      };
    }
    case 'SET_ACTIVE_TEXT_INDEX':
      return { ...state, activeTextIndex: action.payload };
    case 'SET_IMAGE_ADJUSTMENTS':
      return { ...state, imageAdjustments: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'SET_IMAGE', payload: parsedState.image });
        parsedState.textStyles.forEach((style: TextStyle) => {
          dispatch({ type: 'ADD_TEXT_STYLE', payload: style });
        });
        dispatch({ type: 'SET_IMAGE_ADJUSTMENTS', payload: parsedState.imageAdjustments });
      } catch (error) {
        console.error('Error loading editor state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}