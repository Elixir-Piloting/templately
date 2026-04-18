'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const separatorElement: ElementConfig = {
  type: 'separator',
  label: 'Separator',
  icon: 'Minus',
  group: 'layout',
  canContain: [],
  defaultContent: '',
  defaultStyles: {
    backgroundColor: '#000000',
    separatorWeight: createStyleValue(2),
    separatorLength: createStyleValue(100),
    separatorLengthOption: 'full',
    separatorOrientation: 'horizontal',
    separatorColor: '#000000',
    widthOption: 'full',
    display: 'flex',
    margin: createLinkedSpacing(8),
    padding: createLinkedSpacing(0),
  },
  tabs: [
    {
      id: 'style',
      label: 'Style',
      fields: [
        { key: 'separatorOrientation', label: 'Orientation', type: 'select', options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ]},
        { key: 'separatorLengthOption', label: 'Length', type: 'select', options: [
          { value: 'full', label: 'Full' },
          { value: 'custom', label: 'Custom' },
        ]},
        { key: 'separatorLength', label: 'Custom Length', type: 'unit', units: ['px', '%', 'em', 'rem'], dependsOn: { key: 'separatorLengthOption', value: 'custom' } },
        { key: 'separatorWeight', label: 'Weight', type: 'unit' },
        { key: 'separatorColor', label: 'Color', type: 'color' },
        { key: 'margin', label: 'Margin', type: 'spacing' },
        { key: 'padding', label: 'Padding', type: 'spacing' },
      ],
    },
  ],
  render: (element: TemplateElement) => {
    const isHorizontal = element.styles.separatorOrientation !== 'vertical';
    const isFull = element.styles.separatorLengthOption !== 'custom';
    const length = isFull ? (isHorizontal ? '100%' : '100%') : (element.styles.separatorLength ? `${element.styles.separatorLength.value}${element.styles.separatorLength.unit}` : '100%');
    return (
      <div
        style={{
          width: isHorizontal ? length : undefined,
          height: !isHorizontal ? length : undefined,
          backgroundColor: element.styles.separatorColor || '#000000',
          [isHorizontal ? 'height' : 'width']: element.styles.separatorWeight ? `${element.styles.separatorWeight.value}${element.styles.separatorWeight.unit}` : '2px',
        }}
      />
    );
  },
};