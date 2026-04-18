'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputWithUnit } from './InputWithUnit';
import { LayoutMode, StyleValue } from '@/lib/types';

interface LayoutControlsProps {
  display: LayoutMode | undefined;
  onDisplayChange: (display: LayoutMode) => void;
  flexDirection: 'row' | 'column' | 'row-reverse' | 'column-reverse' | undefined;
  onFlexDirectionChange: (direction: 'row' | 'column' | 'row-reverse' | 'column-reverse') => void;
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse' | undefined;
  onFlexWrapChange: (wrap: 'nowrap' | 'wrap' | 'wrap-reverse') => void;
  justifyContent: string | undefined;
  onJustifyContentChange: (value: string) => void;
  alignItems: string | undefined;
  onAlignItemsChange: (value: string) => void;
  gap: StyleValue | undefined;
  onGapChange: (value: StyleValue) => void;
  gridTemplateColumns: string | undefined;
  onGridColumnsChange: (value: string) => void;
  gridTemplateRows: string | undefined;
  onGridRowsChange: (value: string) => void;
}

export function LayoutControls({
  display,
  onDisplayChange,
  flexDirection,
  onFlexDirectionChange,
  flexWrap,
  onFlexWrapChange,
  justifyContent,
  onJustifyContentChange,
  alignItems,
  onAlignItemsChange,
  gap,
  onGapChange,
  gridTemplateColumns,
  onGridColumnsChange,
  gridTemplateRows,
  onGridRowsChange,
}: LayoutControlsProps) {
  const isFlex = display === 'flex' || !display;
  const isGrid = display === 'grid';

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Display</label>
        <Select
          value={display || 'flex'}
          onValueChange={(v) => onDisplayChange(v as LayoutMode)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="block">Block</SelectItem>
            <SelectItem value="flex">Flex</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isFlex && (
        <>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Flex Direction</label>
            <Select
              value={flexDirection || 'column'}
              onValueChange={(v) => onFlexDirectionChange(v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">Row</SelectItem>
                <SelectItem value="column">Column</SelectItem>
                <SelectItem value="row-reverse">Row Reverse</SelectItem>
                <SelectItem value="column-reverse">Column Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Flex Wrap</label>
            <Select
              value={flexWrap || 'nowrap'}
              onValueChange={(v) => onFlexWrapChange(v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nowrap">No Wrap</SelectItem>
                <SelectItem value="wrap">Wrap</SelectItem>
                <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Justify Content</label>
            <Select
              value={justifyContent || 'flex-start'}
              onValueChange={onJustifyContentChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flex-start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="flex-end">End</SelectItem>
                <SelectItem value="space-between">Space Between</SelectItem>
                <SelectItem value="space-around">Space Around</SelectItem>
                <SelectItem value="space-evenly">Space Evenly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Align Items</label>
            <Select
              value={alignItems || 'stretch'}
              onValueChange={onAlignItemsChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stretch">Stretch</SelectItem>
                <SelectItem value="flex-start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="flex-end">End</SelectItem>
                <SelectItem value="baseline">Baseline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {isGrid && (
        <>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Grid Template Columns</label>
            <Input
              value={gridTemplateColumns || ''}
              onChange={(e) => onGridColumnsChange(e.target.value)}
              placeholder="1fr 1fr 1fr"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Grid Template Rows</label>
            <Input
              value={gridTemplateRows || ''}
              onChange={(e) => onGridRowsChange(e.target.value)}
              placeholder="auto"
            />
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Gap</label>
        <InputWithUnit
          value={gap}
          onChange={onGapChange}
        />
      </div>
    </div>
  );
}