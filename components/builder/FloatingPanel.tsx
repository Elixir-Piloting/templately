'use client';

import { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '@/lib/store';
import { TemplateElement } from '@/lib/types';
import { ChevronRight, ChevronDown, GripVertical } from 'lucide-react';

interface FloatingPanelProps {
  children: React.ReactNode;
}

export function FloatingPanel({ children }: FloatingPanelProps) {
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [size, setSize] = useState({ width: 280, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeOffset = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, e.clientX - dragOffset.current.x),
          y: Math.max(0, e.clientY - dragOffset.current.y),
        });
      }
      if (isResizing) {
        setSize({
          width: Math.max(200, e.clientX - resizeOffset.current.width),
          height: Math.max(200, e.clientY - resizeOffset.current.height),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const handleDragStart = (e: React.MouseEvent) => {
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    setIsDragging(true);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizeOffset.current = { width: e.clientX - size.width, height: e.clientY - size.height };
    setIsResizing(true);
  };

  if (isCollapsed) {
    return (
      <div
        className="fixed bg-background border rounded-lg shadow-lg z-50"
        style={{ left: position.x, top: position.y }}
      >
        <div
          className="p-2 cursor-move flex items-center gap-2 border-b"
          onMouseDown={handleDragStart}
        >
          <GripVertical className="h-4 w-4" />
          <span className="text-sm font-medium">Elements</span>
          <button
            onClick={() => setIsCollapsed(false)}
            className="ml-auto text-xs hover:text-foreground"
          >
            Expand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bg-background border rounded-lg shadow-lg z-50 flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      <div
        className="p-3 cursor-move flex items-center gap-2 border-b bg-muted/50 rounded-t-lg"
        onMouseDown={handleDragStart}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium flex-1">Elements</span>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Collapse
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}

export function ElementHierarchy() {
  const { template, selectedElementId, selectElement, hoveredElementId, setHoveredElement, moveElement } = useBuilderStore();

  const renderElement = (element: TemplateElement, depth: number = 0): React.ReactNode => {
    const isSelected = element.id === selectedElementId;
    const isHovered = element.id === hoveredElementId;
    const hasChildren = element.type === 'div' && element.children && element.children.length > 0;

    return (
      <div key={element.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer text-sm rounded-sm transition-colors ${
            isSelected ? 'bg-primary text-primary-foreground' : isHovered ? 'bg-muted' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={(e) => {
            e.stopPropagation();
            selectElement(element.id);
          }}
          onMouseEnter={() => setHoveredElement(element.id)}
          onMouseLeave={() => setHoveredElement(null)}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('element-id', element.id);
          }}
        >
          {element.type === 'div' && (
            <button
              className="p-0.5 hover:bg-muted-foreground/20 rounded"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {hasChildren ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          )}
          <span className="capitalize">{element.type}</span>
          <span className="ml-auto text-xs opacity-60 truncate max-w-[80px]">
            {element.content?.slice(0, 20) || element.id.slice(0, 8)}
          </span>
        </div>
        {hasChildren && (
          <div>
            {element.children!.map((child) => renderElement(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-xs font-medium text-muted-foreground">Structure</span>
        <div className="flex gap-1">
          <button
            className="text-xs px-1.5 py-0.5 hover:bg-muted rounded"
            onClick={() => moveElement(selectedElementId || '', 'up')}
            disabled={!selectedElementId}
          >
            Up
          </button>
          <button
            className="text-xs px-1.5 py-0.5 hover:bg-muted rounded"
            onClick={() => moveElement(selectedElementId || '', 'down')}
            disabled={!selectedElementId}
          >
            Down
          </button>
        </div>
      </div>
      {template.elements.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-4">
          No elements yet. Drag elements from the sidebar.
        </div>
      ) : (
        template.elements.map((element) => renderElement(element))
      )}
    </div>
  );
}