'use client';

import { useState } from 'react';
import { ElementType, TemplateElement } from '@/lib/types';
import { useBuilderStore } from '@/lib/store';
import { elementRegistry, ControlField } from '@/lib/elements';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputWithUnit } from './InputWithUnit';
import { InputWithSpacing } from './InputWithSpacing';
import { DimensionsInput } from './DimensionsInput';
import { LayoutMode } from '@/lib/types';
import { Layout, Type, Minus, Square, Trash2, ChevronUp, ChevronDown, Search, ChevronDown as ChevronDownIcon, ChevronRight as ChevronRightIcon, Image, MousePointerClick, ArrowDown, Code, List, Tag } from 'lucide-react';

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  header: <Type className="h-6 w-6" />,
  paragraph: <Layout className="h-6 w-6" />,
  separator: <Minus className="h-6 w-6" />,
  div: <Square className="h-6 w-6" />,
  image: <Image className="h-6 w-6" />,
  button: <MousePointerClick className="h-6 w-6" />,
  spacer: <ArrowDown className="h-6 w-6" />,
  code: <Code className="h-6 w-6" />,
  list: <List className="h-6 w-6" />,
  badge: <Tag className="h-6 w-6" />,
};

const GROUP_LABELS: Record<string, string> = {
  content: 'Content',
  layout: 'Layout',
};

function findElementById(elements: TemplateElement[], id: string): TemplateElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function ElementSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['content', 'layout']));
  
  const { template, selectedElementId, updateElement, deleteElement, moveElement, addElement } = useBuilderStore();
  const selectedElement = selectedElementId ? findElementById(template.elements, selectedElementId) : null;

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData('element-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleElementClick = (type: ElementType) => {
    addElement(type);
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

const elementsByGroup: Record<string, { type: string; label: string; group: string; icon: string }[]> = Object.values(elementRegistry).reduce((acc, element) => {
    const group = element.group || 'content';
    if (!acc[group]) acc[group] = [];
    acc[group].push({ type: element.type, label: element.label, group: element.group, icon: element.icon });
    return acc;
  }, {} as Record<string, { type: string; label: string; group: string; icon: string }[]>);

  const filteredElementsByGroup = Object.entries(elementsByGroup).reduce((acc, [group, elements]) => {
    const filtered = elements.filter(el => 
      el.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[group] = filtered;
    }
    return acc;
  }, {} as Record<string, { type: string; label: string; group: string; icon: string }[]>);

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
    const config = elementRegistry[selectedElement.type];
    if (!config) return null;

    const availableTabs = config.tabs.map(tab => tab.id);
    const defaultTab = availableTabs[0] || 'style';

    const renderField = (field: ControlField) => {
      if (field.dependsOn) {
        const depValue = (selectedElement.styles as any)[field.dependsOn.key];
        if (depValue !== field.dependsOn.value) return null;
      }

      switch (field.type) {
        case 'text':
          return (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                value={selectedElement.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
              />
            </div>
          );
        case 'textarea':
          return (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <textarea
                value={selectedElement.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">Use {'{{variable}}'} for dynamic content</p>
            </div>
          );
        case 'select':
          return (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <Select
                value={String(selectedElement.styles[field.key as keyof typeof selectedElement.styles] || '')}
                onValueChange={(v) => handleStyleChange(field.key, v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {field.options?.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        case 'color':
          const colorValue = selectedElement.styles[field.key as keyof typeof selectedElement.styles] as string || '#000000';
          return (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colorValue}
                  onChange={(e) => handleStyleChange(field.key, e.target.value)}
                  className="h-9 w-14 rounded border border-input p-1"
                />
                <Input
                  value={colorValue}
                  onChange={(e) => handleStyleChange(field.key, e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          );
        case 'unit':
          return (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <InputWithUnit
                value={selectedElement.styles[field.key as keyof typeof selectedElement.styles] as any}
                onChange={(v) => handleStyleChange(field.key, v)}
                units={field.units as any}
              />
            </div>
          );
        case 'spacing':
          return (
            <InputWithSpacing
              key={field.key}
              label={field.label}
              value={selectedElement.styles[field.key as keyof typeof selectedElement.styles] as any}
              onChange={(v) => handleStyleChange(field.key, v)}
            />
          );
        case 'dimensions':
          return (
            <DimensionsInput
              key={field.key}
              width={selectedElement.styles.width}
              widthOption={selectedElement.styles.widthOption}
              onWidthChange={(v) => handleStyleChange('width', v)}
              onWidthOptionChange={(v) => handleStyleChange('widthOption', v)}
              height={selectedElement.styles.height}
              heightOption={selectedElement.styles.heightOption}
              onHeightChange={(v) => handleStyleChange('height', v)}
              onHeightOptionChange={(v) => handleStyleChange('heightOption', v)}
            />
          );
        case 'number':
          return (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                value={selectedElement.styles[field.key as keyof typeof selectedElement.styles] as number || ''}
                onChange={(e) => handleStyleChange(field.key, Number(e.target.value))}
                placeholder={field.placeholder}
              />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium capitalize">{config.label}</span>
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
            {config.tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="data-[state=active]:bg-accent">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-auto p-4">
            {config.tabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-4 mt-0">
                {tab.fields.map(field => renderField(field))}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {Object.entries(filteredElementsByGroup).map(([group, elements]) => (
        <div key={group} className="space-y-2">
          <button
            onClick={() => toggleGroup(group)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {expandedGroups.has(group) ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
            {GROUP_LABELS[group] || group}
            <span className="text-xs text-muted-foreground">({elements.length})</span>
          </button>
          
          {expandedGroups.has(group) && (
            <div className="grid grid-cols-2 gap-2">
              {elements.map((element) => (
                <div
                  key={element.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, element.type as ElementType)}
                  onClick={() => handleElementClick(element.type as ElementType)}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-background border border-border rounded-lg cursor-grab hover:bg-accent hover:border-primary transition-colors"
                >
                  <div className="text-muted-foreground">{ELEMENT_ICONS[element.type as ElementType]}</div>
                  <span className="text-xs font-medium">{element.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      <p className="text-xs text-muted-foreground mt-4">Click or drag elements onto the canvas</p>
    </div>
  );
}