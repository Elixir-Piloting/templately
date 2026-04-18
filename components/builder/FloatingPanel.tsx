'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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

function findElementIndex(elements: TemplateElement[], id: string): number {
  return elements.findIndex(el => el.id === id);
}

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

function findParentOfElement(elements: TemplateElement[], childId: string): string | null {
  for (const el of elements) {
    if (el.children && el.children.some(child => child.id === childId)) {
      return el.id;
    }
    if (el.children) {
      const found = findParentOfElement(el.children, childId);
      if (found) return found;
    }
  }
  return null;
}

export function ElementHierarchy() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  const { 
    template, 
    selectedElementId, 
    selectElement, 
    hoveredElementId, 
    setHoveredElement, 
    moveElement,
    moveElementInto,
    moveElementToIndex,
    draggingElementId,
    setDraggingElement,
    dropTargetId,
    setDropTarget,
    dragOverPosition,
    setDragOverPosition
  } = useBuilderStore();

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, elementId: string) => {
    e.dataTransfer.setData('element-id', elementId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingElement(elementId);
  }, [setDraggingElement]);

  const handleDragEnd = useCallback(() => {
    setDraggingElement(null);
    setDropTarget(null);
    setDragOverPosition(null);
  }, [setDraggingElement, setDropTarget, setDragOverPosition]);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string | null, position: 'before' | 'after' | 'inside') => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = e.dataTransfer.getData('element-id');
    if (!draggedId || draggedId === targetId) {
      setDraggingElement(null);
      setDropTarget(null);
      return;
    }

    const currentParentId = findParentOfElement(template.elements, draggedId);
    
    if (targetId && position === 'inside') {
      if (currentParentId && currentParentId !== targetId) {
        moveElementToIndex(draggedId, 0, targetId);
      } else {
        moveElementInto(draggedId, targetId);
      }
    } else if (targetId) {
      const targetIndex = findElementIndex(template.elements, targetId);
      const newIndex = position === 'before' ? targetIndex : targetIndex + 1;
      moveElementToIndex(draggedId, newIndex, null);
    } else {
      moveElementToIndex(draggedId, template.elements.length, null);
    }

    setDraggingElement(null);
    setDropTarget(null);
  }, [moveElementInto, moveElementToIndex, template.elements, setDraggingElement, setDropTarget]);

  const handleDragOver = useCallback((e: React.DragEvent, elementId: string, position: 'before' | 'after' | 'inside') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (elementId === draggingElementId) return;
    
    const targetElement = findElementById(template.elements, elementId);
    const isContainer = targetElement?.type === 'div';
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relY = (e.clientY - rect.top) / rect.height;
    const relX = (e.clientX - rect.left) / rect.width;
    
    if (isContainer && relX > 0.15 && relX < 0.85 && relY > 0.25 && relY < 0.75) {
      setDropTarget(elementId);
      setDragOverPosition('inside');
    } else if (isContainer) {
      const pos = relY < 0.5 ? 'before' : 'after';
      setDropTarget(elementId);
      setDragOverPosition(pos);
    } else {
      const pos = relY < 0.5 ? 'before' : 'after';
      setDropTarget(elementId);
      setDragOverPosition(pos);
    }
  }, [setDropTarget, setDragOverPosition, template.elements, draggingElementId]);

  const renderElement = (element: TemplateElement, depth: number = 0): React.ReactNode => {
    const isSelected = element.id === selectedElementId;
    const isHovered = element.id === hoveredElementId;
    const isDragging = element.id === draggingElementId;
    const isDropTarget = element.id === dropTargetId;
    const isDropTargetBefore = isDropTarget && dragOverPosition === 'before';
    const isDropTargetAfter = isDropTarget && dragOverPosition === 'after';
    const isDropTargetInside = isDropTarget && dragOverPosition === 'inside';
    const isExpanded = expandedIds.has(element.id);
    const hasChildren = element.type === 'div' && element.children && element.children.length > 0;
    const canBeDropTarget = element.type === 'div';

    return (
      <div key={element.id}>
        <div
          className={`flex items-center gap-1 px-1 py-1 cursor-pointer text-sm rounded-sm transition-colors ${
            isSelected ? 'bg-primary text-primary-foreground' : isHovered ? 'bg-muted' : ''
          } ${isDropTargetBefore ? 'border-t-2 border-blue-500' : ''} ${isDropTargetAfter ? 'border-b-2 border-blue-500' : ''} ${isDropTargetInside ? 'ring-2 ring-blue-500 ring-inset bg-blue-500/10' : ''} ${isDragging ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={(e) => {
            e.stopPropagation();
            selectElement(element.id);
          }}
          onMouseEnter={() => setHoveredElement(element.id)}
          onMouseLeave={() => setHoveredElement(null)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const relY = (e.clientY - rect.top) / rect.height;
            
            // 25% from top = inside zone starts, 75% = inside zone ends
            if (canBeDropTarget && relY >= 0.25 && relY <= 0.75) {
              handleDragOver(e, element.id, 'inside');
            } else if (relY < 0.25) {
              handleDragOver(e, element.id, 'before');
            } else {
              handleDragOver(e, element.id, 'after');
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const relY = (e.clientY - rect.top) / rect.height;
            
            if (canBeDropTarget && relY >= 0.25 && relY <= 0.75) {
              handleDrop(e, element.id, 'inside');
            } else if (relY < 0.25) {
              handleDrop(e, element.id, 'before');
            } else {
              handleDrop(e, element.id, 'after');
            }
          }}
        >
          <div
            className="p-0.5 hover:bg-muted-foreground/20 rounded shrink-0 cursor-grab"
            draggable
            onDragStart={(e) => handleDragStart(e, element.id)}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
          >
            {element.type === 'div' ? (
              <button
                className="pointer-events-none"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(element.id);
                }}
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            ) : (
              <GripVertical className="h-3 w-3" />
            )}
          </div>
          <span className="capitalize truncate">{element.type}</span>
          <span className="ml-auto text-xs opacity-60 truncate max-w-[60px]">
            {element.content?.slice(0, 15) || element.id.slice(0, 6)}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {element.children!.map((child) => renderElement(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-1">
      <div className="flex items-center justify-between mb-1 px-1">
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
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDropTarget(null);
          }}
          onDrop={(e) => handleDrop(e, null, 'after')}
        >
          {template.elements.map((element) => renderElement(element))}
        </div>
      )}
    </div>
  );
}