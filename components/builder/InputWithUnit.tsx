'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StyleValue } from '@/lib/types';

interface InputWithUnitProps {
  value: StyleValue | undefined;
  onChange: (value: StyleValue) => void;
  units?: StyleValue['unit'][];
  placeholder?: string;
}

export function InputWithUnit({ value, onChange, units = ['px', '%', 'em', 'rem'], placeholder = '0' }: InputWithUnitProps) {
  const currentValue = value?.value ?? 0;
  const currentUnit = value?.unit ?? 'px';

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        value={currentValue}
        onChange={(e) => onChange({ value: Number(e.target.value), unit: currentUnit })}
        className="flex-1"
        placeholder={placeholder}
      />
      <Select
        value={currentUnit}
        onValueChange={(unit) => onChange({ value: currentValue, unit: unit as StyleValue['unit'] })}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {units.map((unit) => (
            <SelectItem key={unit} value={unit}>
              {unit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}