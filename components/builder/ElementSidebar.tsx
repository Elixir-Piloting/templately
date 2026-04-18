'use client';

import { ElementType } from '@/lib/types';
import { useBuilderStore } from '@/lib/store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputWithUnit } from './InputWithUnit';
import { Layout, Type, Minus, Square, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

function findElementById(elements: any[], id: string): any {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

const ELEMENT_ICONS: Record<ElementType, React.ReactNode> = {
  header: <Type className="h-4 w-4" />,
  paragraph: <Layout className="h-4 w-4" />,
  separator: <Minus className="h-4 w-4" />,
  div: <Square className="h-4 w-4" />,
};

const ELEMENTS: { type: ElementType; label: string }[] = [
  { type: 'header', label: 'Header' },
  { type: 'paragraph', label: 'Paragraph' },
  { type: 'separator', label: 'Separator' },
  { type: 'div', label: 'Div (Container)' },
];

export function ElementSidebar() {
  const { template, selectedElementId, updateElement, deleteElement, moveElement, addElement } = useBuilderStore();
  const selectedElement = selectedElementId ? findElementById(template.elements, selectedElementId) : null;

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData('element-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleElementClick = (type: ElementType) => {
    addElement(type);
  };

  const handleStyleChange = (key: string, value: unknown) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [key]: value,
      },
    });
  };

  const handleContentChange = (content: string) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { content });
  };

  if (selectedElement) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium capitalize">{selectedElement.type}</span>
            <div className="flex gap-1">
              <button
                className="p-1.5 hover:bg-muted rounded"
                onClick={() => moveElement(selectedElement.id, 'up')}
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                className="p-1.5 hover:bg-muted rounded"
                onClick={() => moveElement(selectedElement.id, 'down')}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                className="p-1.5 hover:bg-muted rounded text-destructive"
                onClick={() => deleteElement(selectedElement.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="content" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start px-4 py-2 h-auto bg-transparent border-b rounded-none">
            <TabsTrigger value="content" className="data-[state=active]:bg-accent">Content</TabsTrigger>
            <TabsTrigger value="style" className="data-[state=active]:bg-accent">Style</TabsTrigger>
            <TabsTrigger value="layout" className="data-[state=active]:bg-accent">Layout</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto p-4">
            <TabsContent value="content" className="space-y-4 mt-0">
              {(selectedElement.type === 'header' || selectedElement.type === 'paragraph') && (
                <>
                  <div className="space-y-2">
                    <Label>Text Content</Label>
                    {selectedElement.type === 'paragraph' ? (
                      <textarea
                        value={selectedElement.content || ''}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    ) : (
                      <Input
                        value={selectedElement.content || ''}
                        onChange={(e) => handleContentChange(e.target.value)}
                      />
                    )}
                    <p className="text-xs text-muted-foreground">Use {'{{variable}}'} for dynamic content</p>
                  </div>
                </>
              )}
              {selectedElement.type === 'div' && (
                <p className="text-sm text-muted-foreground">Container - drag elements into it on canvas</p>
              )}
              {selectedElement.type === 'separator' && (
                <p className="text-sm text-muted-foreground">Separator has no content</p>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-0">
              {(selectedElement.type === 'header' || selectedElement.type === 'paragraph') && (
                <>
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <InputWithUnit value={selectedElement.styles.fontSize} onChange={(v) => handleStyleChange('fontSize', v)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Font Weight</Label>
                    <Select
                      value={String(selectedElement.styles.fontWeight || 400)}
                      onValueChange={(v) => handleStyleChange('fontWeight', Number(v))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <InputWithUnit value={selectedElement.styles.borderWidth} onChange={(v) => handleStyleChange('borderWidth', v)} />
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
                    <InputWithUnit value={selectedElement.styles.borderRadius} onChange={(v) => handleStyleChange('borderRadius', v)} />
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="layout" className="space-y-4 mt-0">
              {selectedElement.type === 'div' && (
                <>
                  <div className="space-y-2">
                    <Label>Width</Label>
                    <InputWithUnit value={selectedElement.styles.width} onChange={(v) => handleStyleChange('width', v)} units={['px', '%', 'em', 'rem']} />
                  </div>
                  <div className="space-y-2">
                    <Label>Height</Label>
                    <InputWithUnit value={selectedElement.styles.height} onChange={(v) => handleStyleChange('height', v)} units={['px', '%', 'em', 'rem']} />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Height</Label>
                    <InputWithUnit value={selectedElement.styles.minHeight} onChange={(v) => handleStyleChange('minHeight', v)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Padding</Label>
                    <InputWithUnit value={selectedElement.styles.padding} onChange={(v) => handleStyleChange('padding', v)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Margin</Label>
                    <InputWithUnit value={selectedElement.styles.margin} onChange={(v) => handleStyleChange('margin', v)} />
                  </div>
                </>
              )}
              {(selectedElement.type === 'header' || selectedElement.type === 'paragraph') && (
                <>
                  <div className="space-y-2">
                    <Label>Width</Label>
                    <InputWithUnit value={selectedElement.styles.width} onChange={(v) => handleStyleChange('width', v)} units={['px', '%', 'em', 'rem']} />
                  </div>
                </>
              )}
              {selectedElement.type === 'separator' && (
                <p className="text-sm text-muted-foreground">Separator has no layout options</p>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Elements</h3>
      {ELEMENTS.map((element) => (
        <div
          key={element.type}
          draggable
          onDragStart={(e) => handleDragStart(e, element.type)}
          onClick={() => handleElementClick(element.type)}
          className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg cursor-grab hover:bg-accent hover:border-primary transition-colors"
        >
          <div className="text-muted-foreground">{ELEMENT_ICONS[element.type]}</div>
          <span className="text-sm font-medium">{element.label}</span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground mt-4">
        Click or drag elements onto the canvas
      </p>
    </div>
  );
}