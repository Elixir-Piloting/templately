'use client';

import { useRef, useState, useCallback } from 'react';
import { useBuilderStore } from '@/lib/store';
import { TemplateElement, StyleValue, SpacingValue, ElementType, WidthOption, HeightOption, LayoutMode } from '@/lib/types';
import { elementRegistry } from '@/lib/elements';
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
    dragOverPosition,
    setDragOverPosition,
    moveElementInto,
    moveElementToIndex
  } = useBuilderStore();
  const [isDragOver, setIsDragOver] = useState(false);

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
          const targetIndex = findElementIndex(template.elements, targetId);
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

  const handleInnerDragOver = useCallback((e: React.DragEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const relX = x / rect.width;
    const relY = y / rect.height;
    
    // Very strict center zone only (35-65%)
    if (relX > 0.35 && relX < 0.65 && relY > 0.35 && relY < 0.65) {
      setDropTarget(elementId);
      setDragOverPosition('inside');
      setIsDragOver(true);
    } else {
      // We're in the margin zone - clear target
      setDropTarget(null);
      setDragOverPosition(null);
    }
  }, [setDropTarget]);

  const handleInnerDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear if we're actually leaving the container, not entering a child
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      setDragOverPosition(null);
      setDropTarget(null);
    }
  }, [setDropTarget]);

  const handleDragOver = useCallback((e: React.DragEvent, elementId: string, position: 'before' | 'after' | 'inside') => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(elementId);
    setDragOverPosition(position);
    setIsDragOver(true);
  }, [setDropTarget]);

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

  const renderElementContent = (element: TemplateElement): React.ReactNode => {
    const config = elementRegistry[element.type];
    if (config?.render) {
      return config.render(element);
    }
    return null;
  };

  const renderElement = (element: TemplateElement, isInside: boolean = false): React.ReactNode => {
    const isSelected = element.id === selectedElementId;
    const isHovered = element.id === hoveredElementId;
    const isDragging = element.id === draggingElementId;
    const isDropTarget = element.id === dropTargetId;
    const config = elementRegistry[element.type];

    const showDropBefore = isDropTarget && dragOverPosition === 'before';
    const showDropAfter = isDropTarget && dragOverPosition === 'after';
    const showDropInside = isDropTarget && dragOverPosition === 'inside';

    let elementStyle: React.CSSProperties = {};
    let children: React.ReactNode = null;
    let innerContainerStyle: React.CSSProperties = {};

    if (element.type === 'header') {
      elementStyle = {
        display: 'block',
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
        display: 'block',
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
      const isFull = element.styles.separatorLengthOption === 'full' || !element.styles.separatorLengthOption;
      const length = isFull ? '100%' : (element.styles.separatorLength ? styleValueToString(element.styles.separatorLength) : '100%');
      elementStyle = {
        display: isVertical ? 'inline-block' : 'block',
        width: isVertical ? undefined : length,
        height: isVertical ? length : undefined,
        minWidth: isVertical ? styleValueToString(element.styles.separatorWeight, '1px') : undefined,
        minHeight: isVertical ? undefined : styleValueToString(element.styles.separatorWeight, '1px'),
        backgroundColor: element.styles.separatorColor || '#000',
        margin: spacingToString(element.styles.margin),
      };
      elementStyle[isVertical ? 'width' : 'height'] = styleValueToString(element.styles.separatorWeight, '2px');
      children = null;
    } else if (element.type === 'div') {
      const display = element.styles.display || 'flex';
      const flexDir = element.styles.flexDirection || 'column';
      
      elementStyle = {
        display,
        width: getWidthStyle(element.styles),
        height: getHeightStyle(element.styles),
        backgroundColor: element.styles.backgroundColor === 'transparent' ? 'transparent' : element.styles.backgroundColor,
        borderWidth: element.styles.borderWidth ? styleValueToNumber(element.styles.borderWidth) + 'px' : '1px',
        borderStyle: element.styles.borderStyle || 'solid',
        borderColor: element.styles.borderColor || '#ccc',
        borderRadius: element.styles.borderRadius ? styleValueToString(element.styles.borderRadius) : '4px',
        padding: spacingToString(element.styles.padding),
        margin: spacingToString(element.styles.margin),
        minHeight: element.styles.minHeight ? styleValueToString(element.styles.minHeight, '50px') : '50px',
      };

      if (display === 'flex') {
        elementStyle.flexDirection = flexDir;
        elementStyle.flexWrap = element.styles.flexWrap || 'nowrap';
        elementStyle.justifyContent = element.styles.justifyContent || 'flex-start';
        elementStyle.alignItems = element.styles.alignItems || 'stretch';
        elementStyle.gap = element.styles.gap ? styleValueToString(element.styles.gap, '0') : '8px';
      } else if (display === 'grid') {
        const cols = element.styles.gridColumns || 2;
        elementStyle.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        elementStyle.gridColumnGap = element.styles.gridColumnGap ? styleValueToString(element.styles.gridColumnGap) : '8px';
        elementStyle.gridRowGap = element.styles.gridRowGap ? styleValueToString(element.styles.gridRowGap) : '8px';
      }

      innerContainerStyle = {
        display,
        flexDirection: flexDir,
        flexWrap: element.styles.flexWrap || 'nowrap',
        justifyContent: element.styles.justifyContent || 'flex-start',
        alignItems: element.styles.alignItems || 'stretch',
        gap: element.styles.gap ? styleValueToString(element.styles.gap, '0') : '8px',
        padding: '4px',
        minHeight: '50px',
      };

      children = (
        <div
          className="flex-1 container"
          style={innerContainerStyle}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width;
            const relY = (e.clientY - rect.top) / rect.height;
            
            // Only accept drop in strict center (35-65%)
            if (relX > 0.35 && relX < 0.65 && relY > 0.35 && relY < 0.65) {
              setDropTarget(element.id);
              setDragOverPosition('inside');
              setIsDragOver(true);
            } else {
              setDropTarget(null);
              setDragOverPosition(null);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width;
            const relY = (e.clientY - rect.top) / rect.height;
            
            // Only allow drop in strict center
            if (relX > 0.35 && relX < 0.65 && relY > 0.35 && relY < 0.65) {
              handleDrop(e, element.id, 'inside');
            }
          }}
          onDragLeave={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
              setDropTarget(null);
              setDragOverPosition(null);
            }
          }}
        >
          {element.children && element.children.length > 0 ? (
            element.children.map(child => renderElement(child, true))
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs border-2 border-dashed border-muted-foreground/20 rounded">
              Drop here
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
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const relY = (e.clientY - rect.top) / rect.height;
            
            if (element.type === 'div') {
              // For divs: 30-70% Y = inside, <30% = before, >70% = after
              if (relY > 0.3 && relY < 0.7) {
                // Show inside indicator
                setDropTarget(element.id);
                setDragOverPosition('inside');
                setIsDragOver(true);
              } else {
                const position = relY <= 0.3 ? 'before' : 'after';
                setDropTarget(element.id);
                setDragOverPosition(position);
                setIsDragOver(true);
              }
            } else {
              // For non-divs: <50% = before, >50% = after
              const position = relY <= 0.5 ? 'before' : 'after';
              setDropTarget(element.id);
              setDragOverPosition(position);
              setIsDragOver(true);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const relY = (e.clientY - rect.top) / rect.height;
            
            if (element.type === 'div') {
              if (relY > 0.3 && relY < 0.7) {
                handleDrop(e, element.id, 'inside');
              } else {
                const position = relY <= 0.3 ? 'before' : 'after';
                handleDrop(e, element.id, position);
              }
            } else {
              const position = relY <= 0.5 ? 'before' : 'after';
              handleDrop(e, element.id, position);
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
            minHeight: '100%',
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

function findElementIndex(elements: TemplateElement[], id: string): number {
  return elements.findIndex(el => el.id === id);
}