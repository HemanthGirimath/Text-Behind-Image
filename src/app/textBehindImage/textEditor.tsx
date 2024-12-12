'use client'

import React from 'react';
import { TextStyle } from '@/lib/types';
import { EditorControls } from '@/components/editor/EditorControls';
import { Button } from '@/components/UI/button';
import { Plus } from 'lucide-react';
import { ScrollArea } from '@/components/UI/scroll-area';

interface TextEditorProps {
  styles: TextStyle[];
  selectedId: string | null;
  onChange: (style: Partial<TextStyle> & { id: string }) => void;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
}

export function TextEditor({
  styles,
  selectedId,
  onChange,
  onSelect,
  onDelete
}: TextEditorProps) {
  const selectedStyle = selectedId ? styles.find(style => style.id === selectedId) : null;

  const handleStyleChange = (updates: Partial<TextStyle>) => {
    if (selectedId && selectedStyle) {
      onChange({
        ...updates,
        id: selectedId
      });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {selectedStyle ? (
        <ScrollArea className="flex-1 pr-4 overflow-y-auto">
          <div className="h-full py-4">
            <EditorControls
              textLayer={selectedStyle}
              onUpdate={handleStyleChange}
            />
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Select a text layer to edit
        </div>
      )}
    </div>
  );
}