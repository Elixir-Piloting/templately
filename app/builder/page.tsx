'use client';

import { useState } from 'react';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { ElementSidebar } from '@/components/builder/ElementSidebar';
import { FloatingPanel, ElementHierarchy } from '@/components/builder/FloatingPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useBuilderStore } from '@/lib/store';
import { Save, Download, Eye, Settings, Plus } from 'lucide-react';

export default function BuilderPage() {
  const { template, setTemplate, updatePage, selectElement } = useBuilderStore();
  const [templateName, setTemplateName] = useState(template.name);
  const [showPageSettings, setShowPageSettings] = useState(false);

  const handleSave = () => {
    const savedTemplate = { ...template, name: templateName };
    console.log('Saving template:', JSON.stringify(savedTemplate, null, 2));
    setTemplate(savedTemplate);
    alert('Template saved! Check console for JSON output.');
  };

  const handleExport = () => {
    const json = JSON.stringify(template, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName || 'template'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    const json = JSON.stringify(template, null, 2);
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Template Preview</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 20px; }
              pre { background: #f4f4f4; padding: 20px; overflow: auto; }
            </style>
          </head>
          <body>
            <h1>Template JSON Preview</h1>
            <pre>${json}</pre>
          </body>
        </html>
      `);
    }
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <header className="h-14 border-b bg-background flex items-center justify-between px-4 shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Templately</h1>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-48 h-8"
              placeholder="Template name"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectElement(null)}
              title="Add element"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant={showPageSettings ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowPageSettings(!showPageSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Page Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </header>

        {showPageSettings && (
          <div className="h-12 border-b bg-muted/30 flex items-center px-4 gap-6 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Size:</span>
              <Input
                type="number"
                value={template.page.width}
                onChange={(e) => updatePage({ width: Number(e.target.value) })}
                className="w-20 h-7 text-sm"
              />
              <span className="text-xs">x</span>
              <Input
                type="number"
                value={template.page.height}
                onChange={(e) => updatePage({ height: Number(e.target.value) })}
                className="w-20 h-7 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Margins:</span>
              <div className="flex items-center gap-1">
                <span className="text-xs">T</span>
                <Input
                  type="number"
                  value={template.page.margins.top}
                  onChange={(e) => updatePage({ margins: { ...template.page.margins, top: Number(e.target.value) } })}
                  className="w-14 h-7 text-sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">B</span>
                <Input
                  type="number"
                  value={template.page.margins.bottom}
                  onChange={(e) => updatePage({ margins: { ...template.page.margins, bottom: Number(e.target.value) } })}
                  className="w-14 h-7 text-sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">L</span>
                <Input
                  type="number"
                  value={template.page.margins.left}
                  onChange={(e) => updatePage({ margins: { ...template.page.margins, left: Number(e.target.value) } })}
                  className="w-14 h-7 text-sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">R</span>
                <Input
                  type="number"
                  value={template.page.margins.right}
                  onChange={(e) => updatePage({ margins: { ...template.page.margins, right: Number(e.target.value) } })}
                  className="w-14 h-7 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Layout:</span>
              <select
                value={template.layout.direction}
                onChange={(e) => useBuilderStore.getState().updateLayout({ direction: e.target.value as 'row' | 'column' })}
                className="h-7 text-sm rounded border px-2"
              >
                <option value="column">Column</option>
                <option value="row">Row</option>
              </select>
              <select
                value={template.layout.justifyContent}
                onChange={(e) => useBuilderStore.getState().updateLayout({ justifyContent: e.target.value as typeof template.layout.justifyContent })}
                className="h-7 text-sm rounded border px-2"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
                <option value="space-evenly">Space Evenly</option>
              </select>
              <select
                value={template.layout.alignItems}
                onChange={(e) => useBuilderStore.getState().updateLayout({ alignItems: e.target.value as typeof template.layout.alignItems })}
                className="h-7 text-sm rounded border px-2"
              >
                <option value="stretch">Stretch</option>
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="baseline">Baseline</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="w-64 border-r shrink-0">
            <ElementSidebar />
          </ScrollArea>

          <BuilderCanvas />
        </div>

        <FloatingPanel>
          <ElementHierarchy />
        </FloatingPanel>
      </div>
    </TooltipProvider>
  );
}