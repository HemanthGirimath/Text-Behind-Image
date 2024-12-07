'use client';

import { useState } from 'react';
import TextEditor from './textEditor';
import ImageAdjustments from './imageAdjustments';
import { EditorProvider } from '@/contexts/editor-context';
import type { TextStyle } from './textEditor';
import { useSubscription } from '@/hooks/useSubscription';
import { canAddTextLayer } from '@/lib/subscription';
import { useToast } from '@/components/UI/use-toast';

const defaultTextStyle: TextStyle = {
  text: 'Enter your text',
  fontSize: 24,
  fontFamily: 'Arial',
  color: '#000000',
  x: 50,
  y: 50,
  letterSpacing: 0,
  opacity: 1,
  rotation: 0,
  direction: 'horizontal',
  align: 'left',
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
      enabled: false,
      width: 1,
      color: '#000000'
    }
  },
  effects: {
    shadow: {
      enabled: false,
      blur: 0,
      color: '#000000',
      offsetX: 0,
      offsetY: 0
    },
    glow: {
      enabled: false,
      blur: 0,
      color: '#000000',
      strength: 0
    },
    gradient: {
      enabled: false,
      type: 'linear',
      colors: ['#000000', '#ffffff'],
      angle: 0
    },
    outline: {
      enabled: false,
      width: 1,
      color: '#000000',
      blur: 0
    }
  },
  watermark: {
    enabled: false,
    text: '',
    position: 'top-left',
    fontSize: 12
  }
};

export default function TextBehindImagePage() {
  const [textStyles, setTextStyles] = useState<TextStyle[]>([defaultTextStyle]);
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const { currentPlan, canUseFeature, getMaxTextLayers } = useSubscription();
  const { toast } = useToast();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<FeatureKey>('maxImages');

  const handleProcessImage = async () => {
    if (!canUseFeature('maxImages')) {
      setUpgradeFeature('maxImages');
      setShowUpgradeModal(true);
      return;
    }
    // Image processing logic here
  };

  const handleTextStyleChange = (newStyle: TextStyle) => {
    const newTextStyles = [...textStyles];
    newTextStyles[activeTextIndex] = newStyle;
    setTextStyles(newTextStyles);
  };

  const handleAddText = () => {
    if (!canUseFeature('multipleTextLayers')) {
      setUpgradeFeature('multipleTextLayers');
      setShowUpgradeModal(true);
      return;
    }
    
    const maxLayers = getMaxTextLayers();
    if (textStyles.length >= maxLayers) {
      toast({
        title: "Layer limit reached",
        description: `Your plan allows up to ${maxLayers} text layers. Upgrade to add more.`,
        variant: "destructive"
      });
      setUpgradeFeature('multipleTextLayers');
      setShowUpgradeModal(true);
      return;
    }
    
    setTextStyles([...textStyles, { ...defaultTextStyle, text: `Text ${textStyles.length + 1}` }]);
    setActiveTextIndex(textStyles.length);
  };

  const handleDeleteText = () => {
    if (textStyles.length <= 1) return;
    
    const newTextStyles = textStyles.filter((_, index) => index !== activeTextIndex);
    setTextStyles(newTextStyles);
    setActiveTextIndex(Math.max(0, activeTextIndex - 1));
  };

  const handleTextSelect = (index: number) => {
    setActiveTextIndex(index);
  };

  return (
    <EditorProvider>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {/* Image preview area */}
          </div>
          <div className="space-y-4">
            <TextEditor 
              textStyles={textStyles} 
              activeTextIndex={activeTextIndex} 
              onTextStyleChange={handleTextStyleChange} 
              onAddText={handleAddText} 
              onDeleteText={handleDeleteText} 
              onTextSelect={handleTextSelect} 
              onProcessImage={handleProcessImage} 
            />
            <ImageAdjustments />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}
