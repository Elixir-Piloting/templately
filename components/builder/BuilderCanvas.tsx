'use client';

import { useRef, useState, useCallback } from 'react';
import { useBuilderStore } from '@/lib/store';
import { TemplateElement, StyleValue, ElementType } from '@/lib/types';
import { GripVertical } from 'lucide-react';

function styleValueToString(value: StyleValue | undefined): string {
  if (!value) return 'auto';
  return `${value.value}${value.unit}`;
}

function styleValueToNumber(value: StyleValue | undefined): number {
  return value?.value ?? 0;
}

export function BuilderCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { 
    template, 
    selectedElementId, 
    selectElement, 
    addElement, 
    hoveredElementId, 
    setHoveredElement,
    draggingElementId,
    setDraggingElement,
    dropTargetId,
    setDropTarget,
    moveElementInto,
    moveElementToIndex
  } = useBuilderStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  const pageWidth = template.page.width;

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-inner')) {
        selectElement(null);
      }
    },
    [selectElement]
  );

  const handleElementClick = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      selectElement(elementId);
    },
    [selectElement]
  );

  const handleDragStart = useCallback((e: React.DragEvent, elementId: string) => {
    e.dataTransfer.setData('element-id', elementId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingElement(elementId);
  }, [setDraggingElement]);

  const handleDragEnd = useCallback(() => {
    setDraggingElement(null);
    setDropTarget(null);
    setDragOverPosition(null);
  }, [setDraggingElement, setDropTarget]);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string | null, position: 'before' | 'after' | 'inside') => {
      e.preventDefault();
      e.stopPropagation();
      
      const draggedId = e.dataTransfer.getData('element-id');
      const elementType = e.dataTransfer.getData('element-type') as ElementType | null;
      
      if (elementType) {
        if (targetId && position === 'inside') {
          addElement(elementType, targetId);
        } else {
          addElement(elementType);
        }
      } else if (draggedId) {
        if (targetId && position === 'inside') {
          moveElementInto(draggedId, targetId);
        } else if (targetId) {
          const targetElement = findElementById(template.elements, targetId);
          if (targetElement) {
            const targetIndex = findElementIndex(template.elements, targetId);
            const newIndex = position === 'before' ? targetIndex : targetIndex + 1;
            moveElementToIndex(draggedId, newIndex, null);
          }
        } else {
          const newIndex = template.elements.length;
          moveElementToIndex(draggedId, newIndex, null);
        }
      }
      
      setIsDragOver(false);
      setDraggingElement(null);
      setDropTarget(null);
      setDragOverPosition(null);
    },
    [addElement, moveElementInto, moveElementToIndex, template.elements, setDraggingElement, setDropTarget]
  );

  const handleDragOver = useCallback((e: React.DragEvent, elementId: string, position: 'before' | 'after' | 'inside') => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(elementId);
    setDragOverPosition(position);
    setIsDragOver(true);
  }, [setDropTarget]);

  const handleInnerDragOver = useCallback((e: React.DragEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(elementId);
    setDragOverPosition('inside');
    setIsDragOver(true);
  }, [setDropTarget]);

  const handleDragLeave = useCallback(() => {
    if (!draggingElementId) {
      setIsDragOver(false);
    }
  }, [draggingElementId]);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      const elementType = e.dataTransfer.getData('element-type') as ElementType | null;
      const draggedId = e.dataTransfer.getData('element-id');
      
      if (elementType) {
        addElement(elementType);
      } else if (draggedId) {
        const newIndex = template.elements.length;
        moveElementToIndex(draggedId, newIndex, null);
      }
      
      setIsDragOver(false);
      setDraggingElement(null);
      setDropTarget(null);
    },
    [addElement, moveElementToIndex, template.elements.length, setDraggingElement, setDropTarget]
  );

  const renderElement = (element: TemplateElement, index: number): React.ReactNode => {
    const isSelected = element.id === selectedElementId;
    const isHovered = element.id === hoveredElementId;
    const isDragging = element.id === draggingElementId;
    const isDropTarget = element.id === dropTargetId;

    const showDropBefore = isDropTarget && dragOverPosition === 'before' && element.type !== 'div';
    const showDropAfter = isDropTarget && dragOverPosition === 'after' && element.type !== 'div';
    const showDropInside = isDropTarget && dragOverPosition === 'inside' && element.type === 'div';

    const baseStyle: React.CSSProperties = {
      display: 'flex',
      boxSizing: 'border-box',
      fontSize: element.styles.fontSize ? styleValueToString(element.styles.fontSize) : undefined,
      fontWeight: element.styles.fontWeight,
      color: element.styles.color,
      textAlign: element.styles.textAlign,
      backgroundColor: element.styles.backgroundColor,
      opacity: element.styles.opacity,
      lineHeight: element.styles.lineHeight,
      flexGrow: element.styles.flexGrow,
      flexShrink: element.styles.flexShrink,
      margin: element.styles.margin ? styleValueToString(element.styles.margin) : undefined,
    };

    let content: React.ReactNode = null;

    if (element.type === 'header') {
      content = (
        <div style={{ ...baseStyle, width: element.styles.width ? styleValueToString(element.styles.width) : undefined }}>
          {element.content}
        </div>
      );
    } else if (element.type === 'paragraph') {
      content = (
        <div style={{ ...baseStyle, width: element.styles.width ? styleValueToString(element.styles.width) : undefined, wordBreak: 'break-word' }}>
          {element.content}
        </div>
      );
    } else if (element.type === 'separator') {
      content = (
        <div
          style={{
            ...baseStyle,
            height: element.styles.borderWidth ? styleValueToString(element.styles.borderWidth) : '2px',
            backgroundColor: element.styles.backgroundColor || '#000',
          }}
        />
      );
    } else if (element.type === 'div') {
      content = (
        <div
          style={{
            ...baseStyle,
            borderWidth: element.styles.borderWidth ? styleValueToNumber(element.styles.borderWidth) + 'px' : '1px',
            borderStyle: 'solid',
            borderColor: element.styles.borderColor || '#ccc',
            borderRadius: element.styles.borderRadius ? styleValueToString(element.styles.borderRadius) : '4px',
            minHeight: element.styles.minHeight ? styleValueToString(element.styles.minHeight) : '50px',
            padding: element.styles.padding ? styleValueToString(element.styles.padding) : undefined,
            margin: element.styles.margin ? styleValueToString(element.styles.margin) : undefined,
            flexDirection: 'column',
            display: 'flex',
          }}
          className={`transition-all ${showDropInside ? 'ring-2 ring-blue-500 ring-inset bg-blue-500/5' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleInnerDragOver(e, element.id);
          }}
          onDrop={(e) => handleDrop(e, element.id, 'inside')}
        >
          {element.children && element.children.length > 0 ? (
            <div className="flex flex-col gap-2 p-1">
              {element.children.map((child, i) => renderElement(child, i))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs border-2 border-dashed border-muted-foreground/20 rounded m-1">
              Drop elements here
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={element.id} className="relative">
        {showDropBefore && (
          <div 
            className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 z-10"
            onDragOver={(e) => handleDragOver(e, element.id, 'before')}
            onDrop={(e) => handleDrop(e, element.id, 'before')}
          />
        )}
        
        <div
          onClick={(e) => handleElementClick(e, element.id)}
          onMouseEnter={() => setHoveredElement(element.id)}
          onMouseLeave={() => setHoveredElement(null)}
          draggable
          onDragStart={(e) => handleDragStart(e, element.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (element.type === 'div') {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const midY = rect.top + rect.height * 0.25;
              const position = e.clientY < midY ? 'before' : 'after';
              handleDragOver(e, element.id, position);
            } else {
              handleDragOver(e, element.id, 'before');
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (element.type === 'div') {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const midY = rect.top + rect.height * 0.25;
              const position = e.clientY < midY ? 'before' : 'after';
              handleDrop(e, element.id, position);
            } else {
              handleDrop(e, element.id, 'before');
            }
          }}
          className={`relative cursor-pointer transition-all ${
            isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : isHovered ? 'ring-2 ring-blue-300 ring-offset-1' : ''
          } ${isDragging ? 'opacity-50' : ''}`}
        >
          {(isHovered || isSelected) && (
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 p-1 cursor-grab hover:bg-muted rounded z-10">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {content}
        </div>
        
        {showDropAfter && (
          <div 
            className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-500 z-10"
            onDragOver={(e) => handleDragOver(e, element.id, 'after')}
            onDrop={(e) => handleDrop(e, element.id, 'after')}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 overflow-auto flex items-start justify-center p-4">
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        onDrop={handleCanvasDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={handleDragLeave}
        className={`bg-white shadow-lg transition-all ${
          isDragOver && !dropTargetId ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        style={{
          width: pageWidth,
          minHeight: template.page.height,
        }}
      >
        <div
          className="canvas-inner"
          style={{
            display: 'flex',
            flexDirection: template.layout.direction,
            justifyContent: template.layout.justifyContent,
            alignItems: template.layout.alignItems,
            gap: template.layout.gap ? styleValueToString(template.layout.gap) : '16px',
            padding: template.layout.padding ? styleValueToString(template.layout.padding) : '0',
            margin: 0,
            minHeight: '100%',
            boxSizing: 'border-box',
            marginTop: template.page.margins.top,
            marginBottom: template.page.margins.bottom,
            marginLeft: template.page.margins.left,
            marginRight: template.page.margins.right,
          }}
        >
          {template.elements.map((element, index) => renderElement(element, index))}
        </div>
      </div>
    </div>
  );
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

function findElementIndex(elements: TemplateElement[], id: string): number {
  return elements.findIndex(el => el.id === id);
}