'use client';

import { useBuilderStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { InputWithUnit } from './InputWithUnit';

export function PropertiesPanel() {
  const { template, selectedElementId, updateElement, deleteElement, moveElement } = useBuilderStore();
  const selectedElement = template.elements.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return null;
  }

  const handleStyleChange = (key: string, value: unknown) => {
    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [key]: value,
      },
    });
  };

  const handleContentChange = (content: string) => {
    updateElement(selectedElement.id, { content });
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium capitalize">{selectedElement.type}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveElement(selectedElement.id, 'up')}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveElement(selectedElement.id, 'down')}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => deleteElement(selectedElement.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {(selectedElement.type === 'header' || selectedElement.type === 'paragraph') && (
          <>
            <div className="space-y-2">
              <Label>Text Content</Label>
              {selectedElement.type === 'paragraph' ? (
                <textarea
                  value={selectedElement.content || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              ) : (
                <Input
                  value={selectedElement.content || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                />
              )}
              <p className="text-xs text-muted-foreground">Use {'{{variable}}'} for dynamic content</p>
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <InputWithUnit
                value={selectedElement.styles.fontSize}
                onChange={(v) => handleStyleChange('fontSize', v)}
              />
            </div>

            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select
                value={String(selectedElement.styles.fontWeight || 400)}
                onValueChange={(v) => handleStyleChange('fontWeight', Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">Regular</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semibold</SelectItem>
                  <SelectItem value="700">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedElement.styles.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="h-9 w-14 rounded border border-input p-1"
                />
                <Input
                  value={selectedElement.styles.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Align</Label>
              <Select
                value={selectedElement.styles.textAlign || 'left'}
                onValueChange={(v) => handleStyleChange('textAlign', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedElement.type === 'paragraph' && (
              <div className="space-y-2">
                <Label>Line Height</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedElement.styles.lineHeight || 1.5}
                  onChange={(e) => handleStyleChange('lineHeight', Number(e.target.value))}
                />
              </div>
            )}
          </>
        )}

        {selectedElement.type === 'separator' && (
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedElement.styles.backgroundColor || '#000000'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="h-9 w-14 rounded border border-input p-1"
              />
              <Input
                value={selectedElement.styles.backgroundColor || '#000000'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        )}

        {selectedElement.type === 'div' && (
          <>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedElement.styles.backgroundColor === 'transparent' ? '#ffffff' : (selectedElement.styles.backgroundColor || '#ffffff')}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="h-9 w-14 rounded border border-input p-1"
                />
                <Input
                  value={selectedElement.styles.backgroundColor || 'transparent'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Border Width</Label>
              <InputWithUnit
                value={selectedElement.styles.borderWidth}
                onChange={(v) => handleStyleChange('borderWidth', v)}
              />
            </div>

            <div className="space-y-2">
              <Label>Border Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedElement.styles.borderColor || '#cccccc'}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="h-9 w-14 rounded border border-input p-1"
                />
                <Input
                  value={selectedElement.styles.borderColor || '#cccccc'}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Border Radius</Label>
              <InputWithUnit
                value={selectedElement.styles.borderRadius}
                onChange={(v) => handleStyleChange('borderRadius', v)}
              />
            </div>

            <div className="space-y-2">
              <Label>Width</Label>
              <InputWithUnit
                value={selectedElement.styles.width}
                onChange={(v) => handleStyleChange('width', v)}
                units={['px', '%', 'em', 'rem']}
              />
            </div>

            <div className="space-y-2">
              <Label>Height</Label>
              <InputWithUnit
                value={selectedElement.styles.height}
                onChange={(v) => handleStyleChange('height', v)}
                units={['px', '%', 'em', 'rem']}
              />
            </div>

            <div className="space-y-2">
              <Label>Min Height</Label>
              <InputWithUnit
                value={selectedElement.styles.minHeight}
                onChange={(v) => handleStyleChange('minHeight', v)}
              />
            </div>

            <div className="space-y-2">
              <Label>Padding</Label>
              <InputWithUnit
                value={selectedElement.styles.padding}
                onChange={(v) => handleStyleChange('padding', v)}
              />
            </div>

            <div className="space-y-2">
              <Label>Margin</Label>
              <InputWithUnit
                value={selectedElement.styles.margin}
                onChange={(v) => handleStyleChange('margin', v)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}