'use client';

import { useRef, useState, useCallback } from 'react';
import { useBuilderStore } from '@/lib/store';
import { TemplateElement, StyleValue, SpacingValue, ElementType, WidthOption, HeightOption, LayoutMode } from '@/lib/types';
import { GripVertical } from 'lucide-react';

function styleValueToString(value: StyleValue | undefined, fallback = 'auto'): string {
  if (!value) return fallback;
  return `${value.value}${value.unit}`;
}

function styleValueToNumber(value: StyleValue | undefined): number {
  return value?.value ?? 0;
}

function spacingToString(value: SpacingValue | undefined): string {
  if (!value) return '';
  const top = value.top ? styleValueToString(value.top, '0') : '0';
  const right = value.right ? styleValueToString(value.right, '0') : '0';
  const bottom = value.bottom ? styleValueToString(value.bottom, '0') : '0';
  const left = value.left ? styleValueToString(value.left, '0') : '0';
  return `${top} ${right} ${bottom} ${left}`;
}

function getWidthStyle(styles: any): string | undefined {
  const option = styles.widthOption;
  if (option === 'full') return '100%';
  if (option === 'fit') return 'fit-content';
  if (option === 'custom' || !option) {
    return styles.width ? styleValueToString(styles.width) : undefined;
  }
  return undefined;
}

function getHeightStyle(styles: any): string | undefined {
  const option = styles.heightOption;
  if (option === 'full') return '100%';
  if (option === 'fit') return 'fit-content';
  if (option === 'auto') return 'auto';
  if (option === 'custom' || !option) {
    return styles.height ? styleValueToString(styles.height) : undefined;
  }
  return undefined;
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
          const targetIndex = template.elements.findIndex(el => el.id === targetId);
          const newIndex = position === 'before' ? targetIndex : targetIndex + 1;
          moveElementToIndex(draggedId, newIndex, null);
        } else {
          moveElementToIndex(draggedId, template.elements.length, null);
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
        moveElementToIndex(draggedId, template.elements.length, null);
      }
      
      setIsDragOver(false);
      setDraggingElement(null);
      setDropTarget(null);
    },
    [addElement, moveElementToIndex, template.elements.length, setDraggingElement, setDropTarget]
  );

  const renderElement = (element: TemplateElement): React.ReactNode => {
    const isSelected = element.id === selectedElementId;
    const isHovered = element.id === hoveredElementId;
    const isDragging = element.id === draggingElementId;
    const isDropTarget = element.id === dropTargetId;

    const showDropBefore = isDropTarget && dragOverPosition === 'before' && element.type !== 'div';
    const showDropAfter = isDropTarget && dragOverPosition === 'after' && element.type !== 'div';
    const showDropInside = isDropTarget && dragOverPosition === 'inside' && element.type === 'div';

    let elementStyle: React.CSSProperties = {};
    let children: React.ReactNode = null;

    if (element.type === 'header') {
      elementStyle = {
        width: getWidthStyle(element.styles),
        height: getHeightStyle(element.styles),
        fontSize: element.styles.fontSize ? styleValueToString(element.styles.fontSize) : undefined,
        fontWeight: element.styles.fontWeight,
        color: element.styles.color,
        textAlign: element.styles.textAlign,
        margin: spacingToString(element.styles.margin),
      };
      children = <span>{element.content}</span>;
    } else if (element.type === 'paragraph') {
      elementStyle = {
        width: getWidthStyle(element.styles),
        height: getHeightStyle(element.styles),
        fontSize: element.styles.fontSize ? styleValueToString(element.styles.fontSize) : undefined,
        fontWeight: element.styles.fontWeight,
        color: element.styles.color,
        textAlign: element.styles.textAlign,
        lineHeight: element.styles.lineHeight,
        wordBreak: 'break-word',
        margin: spacingToString(element.styles.margin),
      };
      children = <span>{element.content}</span>;
    } else if (element.type === 'separator') {
      const isVertical = element.styles.separatorOrientation === 'vertical';
      elementStyle = {
        width: isVertical ? styleValueToString(element.styles.separatorWeight, '2px') : getWidthStyle(element.styles),
        height: isVertical ? getWidthStyle(element.styles) : styleValueToString(element.styles.separatorWeight, '2px'),
        minWidth: isVertical ? undefined : '1px',
        minHeight: isVertical ? '1px' : undefined,
        backgroundColor: element.styles.separatorColor || '#000',
        margin: spacingToString(element.styles.margin),
      };
      children = null;
    } else if (element.type === 'div') {
      const display = element.styles.display || 'flex';
      
      elementStyle = {
        width: getWidthStyle(element.styles),
        height: getHeightStyle(element.styles),
        backgroundColor: element.styles.backgroundColor === 'transparent' ? 'transparent' : element.styles.backgroundColor,
        borderWidth: element.styles.borderWidth ? styleValueToNumber(element.styles.borderWidth) + 'px' : '1px',
        borderStyle: element.styles.borderStyle || 'solid',
        borderColor: element.styles.borderColor || '#ccc',
        borderRadius: element.styles.borderRadius ? styleValueToString(element.styles.borderRadius) : '4px',
        display,
        flexDirection: element.styles.flexDirection || 'column',
        flexWrap: element.styles.flexWrap || 'nowrap',
        justifyContent: element.styles.justifyContent || 'flex-start',
        alignItems: element.styles.alignItems || 'stretch',
        gap: element.styles.gap ? styleValueToString(element.styles.gap, '0') : '8px',
        gridTemplateColumns: element.styles.gridTemplateColumns,
        gridTemplateRows: element.styles.gridTemplateRows,
        padding: spacingToString(element.styles.padding),
        margin: spacingToString(element.styles.margin),
        minHeight: element.styles.minHeight ? styleValueToString(element.styles.minHeight, '50px') : '50px',
      };
      
      children = (
        <div className="flex flex-col gap-2 p-1">
          {element.children && element.children.length > 0 ? (
            element.children.map(child => renderElement(child))
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
          style={elementStyle}
          className={`relative cursor-pointer transition-all ${
            isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : isHovered ? 'ring-2 ring-blue-300 ring-offset-1' : ''
          } ${isDragging ? 'opacity-50' : ''} ${showDropInside ? 'ring-2 ring-blue-500 ring-inset bg-blue-500/5' : ''}`}
        >
          {(isHovered || isSelected) && (
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 p-1 cursor-grab hover:bg-muted rounded z-10">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {children}
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
            margin: 0,
            minHeight: '100%',
            boxSizing: 'border-box',
            marginTop: template.page.margins.top,
            marginBottom: template.page.margins.bottom,
            marginLeft: template.page.margins.left,
            marginRight: template.page.margins.right,
          }}
        >
          {template.elements.map((element) => renderElement(element))}
        </div>
      </div>
    </div>
  );
}