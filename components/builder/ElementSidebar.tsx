'use client';

import { ElementType } from '@/lib/types';
import { useBuilderStore } from '@/lib/store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputWithUnit } from './InputWithUnit';
import { InputWithSpacing } from './InputWithSpacing';
import { DimensionsInput } from './DimensionsInput';
import { LayoutMode } from '@/lib/types';
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
      styles: { ...selectedElement.styles, [key]: value },
    });
  };

  const handleContentChange = (content: string) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { content });
  };

  if (selectedElement) {
    const isText = selectedElement.type === 'header' || selectedElement.type === 'paragraph';
    const isContainer = selectedElement.type === 'div';
    const isSeparator = selectedElement.type === 'separator';

    const defaultTab = isContainer ? 'layout' : (isText ? 'content' : 'style');

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium capitalize">{selectedElement.type}</span>
            <div className="flex gap-1">
              <button className="p-1.5 hover:bg-muted rounded" onClick={() => moveElement(selectedElement.id, 'up')}>
                <ChevronUp className="h-4 w-4" />
              </button>
              <button className="p-1.5 hover:bg-muted rounded" onClick={() => moveElement(selectedElement.id, 'down')}>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button className="p-1.5 hover:bg-muted rounded text-destructive" onClick={() => deleteElement(selectedElement.id)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start px-2 py-2 h-auto bg-transparent border-b rounded-none flex-wrap">
            {isText && <TabsTrigger value="content" className="data-[state=active]:bg-accent">Content</TabsTrigger>}
            {!isSeparator && <TabsTrigger value="style" className="data-[state=active]:bg-accent">Style</TabsTrigger>}
            {(isText || isContainer) && <TabsTrigger value="size" className="data-[state=active]:bg-accent">Size</TabsTrigger>}
            {isContainer && <TabsTrigger value="layout" className="data-[state=active]:bg-accent">Layout</TabsTrigger>}
            {isSeparator && <TabsTrigger value="style" className="data-[state=active]:bg-accent">Style</TabsTrigger>}
          </TabsList>

          <div className="flex-1 overflow-auto p-4">
            {isText && (
              <TabsContent value="content" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Text</Label>
                  {selectedElement.type === 'paragraph' ? (
                    <textarea
                      value={selectedElement.content || ''}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  ) : (
                    <Input value={selectedElement.content || ''} onChange={(e) => handleContentChange(e.target.value)} />
                  )}
                  <p className="text-xs text-muted-foreground">Use {'{{variable}}'} for dynamic content</p>
                </div>
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <InputWithUnit value={selectedElement.styles.fontSize} onChange={(v) => handleStyleChange('fontSize', v)} />
                </div>
                <div className="space-y-2">
                  <Label>Font Weight</Label>
                  <Select value={String(selectedElement.styles.fontWeight || 400)} onValueChange={(v) => handleStyleChange('fontWeight', Number(v))}>
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
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={selectedElement.styles.color || '#000000'} onChange={(e) => handleStyleChange('color', e.target.value)} className="h-9 w-14 rounded border border-input p-1" />
                    <Input value={selectedElement.styles.color || '#000000'} onChange={(e) => handleStyleChange('color', e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Text Align</Label>
                  <Select value={selectedElement.styles.textAlign || 'left'} onValueChange={(v) => handleStyleChange('textAlign', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedElement.type === 'paragraph' && (
                  <div className="space-y-2">
                    <Label>Line Height</Label>
                    <Input type="number" step="0.1" value={selectedElement.styles.lineHeight || 1.5} onChange={(e) => handleStyleChange('lineHeight', Number(e.target.value))} />
                  </div>
                )}
                <InputWithSpacing label="Margin" value={selectedElement.styles.margin} onChange={(v) => handleStyleChange('margin', v)} />
                <InputWithSpacing label="Padding" value={selectedElement.styles.padding} onChange={(v) => handleStyleChange('padding', v)} />
              </TabsContent>
            )}

            {(isText || isContainer) && (
              <TabsContent value="size" className="space-y-4 mt-0">
                <DimensionsInput
                  width={selectedElement.styles.width}
                  widthOption={selectedElement.styles.widthOption}
                  onWidthChange={(v) => handleStyleChange('width', v)}
                  onWidthOptionChange={(v) => handleStyleChange('widthOption', v)}
                  height={selectedElement.styles.height}
                  heightOption={selectedElement.styles.heightOption}
                  onHeightChange={(v) => handleStyleChange('height', v)}
                  onHeightOptionChange={(v) => handleStyleChange('heightOption', v)}
                />
              </TabsContent>
            )}

            {isContainer && (
              <TabsContent value="layout" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Display</Label>
                  <Select value={selectedElement.styles.display || 'flex'} onValueChange={(v) => handleStyleChange('display', v as LayoutMode)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="flex">Flex</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(selectedElement.styles.display === 'flex' || !selectedElement.styles.display) && (
                  <>
                    <div className="space-y-2">
                      <Label>Direction</Label>
                      <Select value={selectedElement.styles.flexDirection || 'column'} onValueChange={(v) => handleStyleChange('flexDirection', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="row">Row</SelectItem>
                          <SelectItem value="column">Column</SelectItem>
                          <SelectItem value="row-reverse">Row Reverse</SelectItem>
                          <SelectItem value="column-reverse">Column Reverse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Wrap</Label>
                      <Select value={selectedElement.styles.flexWrap || 'nowrap'} onValueChange={(v) => handleStyleChange('flexWrap', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nowrap">No Wrap</SelectItem>
                          <SelectItem value="wrap">Wrap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Justify</Label>
                      <Select value={selectedElement.styles.justifyContent || 'flex-start'} onValueChange={(v) => handleStyleChange('justifyContent', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flex-start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="flex-end">End</SelectItem>
                          <SelectItem value="space-between">Space Between</SelectItem>
                          <SelectItem value="space-around">Space Around</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Align</Label>
                      <Select value={selectedElement.styles.alignItems || 'stretch'} onValueChange={(v) => handleStyleChange('alignItems', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stretch">Stretch</SelectItem>
                          <SelectItem value="flex-start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="flex-end">End</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Gap</Label>
                      <InputWithUnit value={selectedElement.styles.gap} onChange={(v) => handleStyleChange('gap', v)} />
                    </div>
                  </>
                )}

                {selectedElement.styles.display === 'grid' && (
                  <>
                    <div className="space-y-2">
                      <Label>Columns</Label>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={selectedElement.styles.gridColumns || ''}
                        onChange={(e) => handleStyleChange('gridColumns', e.target.value)}
                        placeholder="2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rows</Label>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={selectedElement.styles.gridRows || ''}
                        onChange={(e) => handleStyleChange('gridRows', e.target.value)}
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Column Gap</Label>
                      <InputWithUnit value={selectedElement.styles.gridColumnGap} onChange={(v) => handleStyleChange('gridColumnGap', v)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Row Gap</Label>
                      <InputWithUnit value={selectedElement.styles.gridRowGap} onChange={(v) => handleStyleChange('gridRowGap', v)} />
                    </div>
                  </>
                )}

                <InputWithSpacing label="Margin" value={selectedElement.styles.margin} onChange={(v) => handleStyleChange('margin', v)} />
                <InputWithSpacing label="Padding" value={selectedElement.styles.padding} onChange={(v) => handleStyleChange('padding', v)} />
              </TabsContent>
            )}

            {(!isText && !isContainer) && (
              <TabsContent value="style" className="space-y-4 mt-0">
                {isSeparator ? (
                  <>
                    <div className="space-y-2">
                      <Label>Orientation</Label>
                      <Select value={selectedElement.styles.separatorOrientation || 'horizontal'} onValueChange={(v) => handleStyleChange('separatorOrientation', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="horizontal">Horizontal</SelectItem>
                          <SelectItem value="vertical">Vertical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Weight</Label>
                      <InputWithUnit value={selectedElement.styles.separatorWeight} onChange={(v) => handleStyleChange('separatorWeight', v)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Length</Label>
                      <InputWithUnit value={selectedElement.styles.separatorLength} onChange={(v) => handleStyleChange('separatorLength', v)} units={['px', '%', 'em', 'rem']} />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex gap-2">
                        <input type="color" value={selectedElement.styles.separatorColor || '#000000'} onChange={(e) => handleStyleChange('separatorColor', e.target.value)} className="h-9 w-14 rounded border border-input p-1" />
                        <Input value={selectedElement.styles.separatorColor || '#000000'} onChange={(e) => handleStyleChange('separatorColor', e.target.value)} className="flex-1" />
                      </div>
                    </div>
                  </>
                ) : null}
                <InputWithSpacing label="Margin" value={selectedElement.styles.margin} onChange={(v) => handleStyleChange('margin', v)} />
                <InputWithSpacing label="Padding" value={selectedElement.styles.padding} onChange={(v) => handleStyleChange('padding', v)} />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Elements</h3>
      {ELEMENTS.map((element) => (
        <div key={element.type} draggable onDragStart={(e) => handleDragStart(e, element.type)} onClick={() => handleElementClick(element.type)} className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg cursor-grab hover:bg-accent hover:border-primary transition-colors">
          <div className="text-muted-foreground">{ELEMENT_ICONS[element.type]}</div>
          <span className="text-sm font-medium">{element.label}</span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground mt-4">Click or drag elements onto the canvas</p>
    </div>
  );
}