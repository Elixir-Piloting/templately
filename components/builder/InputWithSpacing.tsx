'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SpacingValue, StyleValue } from '@/lib/types';
import { Link2, Unlink2 } from 'lucide-react';

interface InputWithSpacingProps {
  label: string;
  value: SpacingValue | undefined;
  onChange: (value: SpacingValue) => void;
}

function styleValueToNumber(value: StyleValue | undefined): number {
  return value?.value ?? 0;
}

export function InputWithSpacing({ label, value, onChange }: InputWithSpacingProps) {
  const top = styleValueToNumber(value?.top);
  const right = styleValueToNumber(value?.right);
  const bottom = styleValueToNumber(value?.bottom);
  const left = styleValueToNumber(value?.left);
  const linked = value?.linked ?? true;

  const unit = value?.top?.unit ?? 'px';

  const handleChange = (field: 'top' | 'right' | 'bottom' | 'left', newValue: number) => {
    if (linked) {
      onChange({
        top: { value: newValue, unit },
        right: { value: newValue, unit },
        bottom: { value: newValue, unit },
        left: { value: newValue, unit },
        linked: true,
      });
    } else {
      onChange({
        ...value!,
        [field]: { value: newValue, unit },
      });
    }
  };

  const toggleLink = () => {
    if (linked) {
      onChange({
        ...value!,
        linked: false,
      });
    } else {
      onChange({
        top: { value: top, unit },
        right: { value: top, unit },
        bottom: { value: top, unit },
        left: { value: top, unit },
        linked: true,
      });
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground">{label}</label>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={toggleLink}
        >
          {linked ? <Link2 className="h-3 w-3" /> : <Unlink2 className="h-3 w-3" />}
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <div>
          <input
            type="number"
            value={top}
            onChange={(e) => handleChange('top', Number(e.target.value))}
            className="w-full h-8 text-xs px-2 border rounded"
            placeholder="T"
          />
        </div>
        <div>
          <input
            type="number"
            value={linked ? top : right}
            onChange={(e) => handleChange('right', Number(e.target.value))}
            className="w-full h-8 text-xs px-2 border rounded"
            placeholder="R"
            disabled={linked}
          />
        </div>
        <div>
          <input
            type="number"
            value={linked ? top : bottom}
            onChange={(e) => handleChange('bottom', Number(e.target.value))}
            className="w-full h-8 text-xs px-2 border rounded"
            placeholder="B"
            disabled={linked}
          />
        </div>
        <div>
          <input
            type="number"
            value={linked ? top : left}
            onChange={(e) => handleChange('left', Number(e.target.value))}
            className="w-full h-8 text-xs px-2 border rounded"
            placeholder="L"
            disabled={linked}
          />
        </div>
      </div>
    </div>
  );
}