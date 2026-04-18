'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputWithUnit } from './InputWithUnit';
import { WidthOption, HeightOption, StyleValue } from '@/lib/types';

interface DimensionsInputProps {
  width: StyleValue | undefined;
  widthOption: WidthOption | undefined;
  onWidthChange: (value: StyleValue) => void;
  onWidthOptionChange: (option: WidthOption) => void;
  height: StyleValue | undefined;
  heightOption: HeightOption | undefined;
  onHeightChange: (value: StyleValue) => void;
  onHeightOptionChange: (option: HeightOption) => void;
}

function styleValueToNumber(value: StyleValue | undefined): number {
  return value?.value ?? 0;
}

export function DimensionsInput({ 
  width, 
  widthOption, 
  onWidthChange, 
  onWidthOptionChange,
  height, 
  heightOption, 
  onHeightChange,
  onHeightOptionChange 
}: DimensionsInputProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Width</label>
        <div className="flex gap-1">
          <Select
            value={widthOption || 'custom'}
            onValueChange={(v) => onWidthOptionChange(v as WidthOption)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="fit">Fit</SelectItem>
            </SelectContent>
          </Select>
          {(widthOption === 'custom' || !widthOption) && (
            <InputWithUnit
              value={width}
              onChange={onWidthChange}
              units={['px', '%', 'em', 'rem']}
            />
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Height</label>
        <div className="flex gap-1">
          <Select
            value={heightOption || 'auto'}
            onValueChange={(v) => onHeightOptionChange(v as HeightOption)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="fit">Fit</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
          {(heightOption === 'custom' || !heightOption) && (
            <InputWithUnit
              value={height}
              onChange={onHeightChange}
              units={['px', '%', 'em', 'rem']}
            />
          )}
        </div>
      </div>
    </div>
  );
}