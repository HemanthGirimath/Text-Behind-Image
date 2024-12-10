'use client'

import React, { useCallback } from 'react';
import { Button } from '@/components/UI/button';
import { ScrollArea } from '@/components/UI/scroll-area';
import { Trash2, Plus } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/UI/use-toast';
import { TextStyle } from '@/lib/types';
import { DEFAULT_TEXT_STYLE } from '@/lib/plans';
import { EditorControls } from '@/components/editor/EditorControls';

interface TextEditorProps {
  textStyles: TextStyle[];
  selectedTextId: string | null;
  onTextStyleChange: (style: Partial<TextStyle> & { id: string }) => void;
  onTextSelect: (id: string | null) => void;
  onDelete: () => void;
}

export function TextEditor({
  textStyles,
  selectedTextId,
  onTextStyleChange,
  onTextSelect,
  onDelete,
}: TextEditorProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const userPlan = session?.user?.plan || 'free';

  const selectedStyle = selectedTextId
    ? textStyles.find(style => style.id === selectedTextId)
    : null;

  const handleAddText = () => {
    // Only allow multiple text layers for paid plans
    if (textStyles.length > 0 && userPlan === 'free') {
      toast({
        title: 'Premium Feature',
        description: 'Multiple text layers are only available in paid plans. Please upgrade to use this feature.',
        variant: 'destructive',
      });
      return;
    }

    const newStyle: TextStyle = {
      ...DEFAULT_TEXT_STYLE,
      id: generateId(),
    };
    onTextStyleChange(newStyle);
    onTextSelect(newStyle.id);
  };

  const handleStyleChange = useCallback(
    (style: Partial<TextStyle>) => {
      if (!selectedTextId) return;

      // Allow all basic text changes without restriction
      if (!style.effects && !style.gradient && !style.shadow && !style.glow) {
        onTextStyleChange({ ...style, id: selectedTextId });
        return;
      }

      // Check for premium features
      if ((style.effects || style.shadow || style.glow) && userPlan !== 'premium') {
        toast({
          title: 'Premium Feature',
          description: 'Text effects are only available in paid plans. Please upgrade to use this feature.',
          variant: 'destructive',
        });
        return;
      }

      // Check for gradient (basic plan feature)
      if (style.gradient && userPlan === 'free') {
        toast({
          title: 'Basic Plan Feature',
          description: 'Advanced color features are only available in paid plans. Please upgrade to use this feature.',
          variant: 'destructive',
        });
        return;
      }

      onTextStyleChange({ ...style, id: selectedTextId });
    },
    [selectedTextId, onTextStyleChange, userPlan, toast]
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <Button
          onClick={handleAddText}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Text Layer
        </Button>
      </div>

      {textStyles.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground">
          No text layers yet. Click the "Add Text Layer" button to get started.
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {/* Text Layer List */}
            <div className="space-y-2">
              {textStyles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => onTextSelect(style.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTextId === style.id
                      ? 'border-primary bg-accent'
                      : 'border-border hover:bg-accent/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{style.text || 'Empty Text'}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (style.id === selectedTextId) {
                          onDelete();
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Text Editor Controls */}
            {selectedStyle && (
              <EditorControls
                textLayer={selectedStyle}
                onUpdate={(updates) => handleStyleChange(updates)}
              />
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default TextEditor;