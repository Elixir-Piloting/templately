'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const headerElement: ElementConfig = {
  type: 'header',
  label: 'Header',
  icon: 'Type',
  group: 'content',
  canContain: [],
  defaultContent: 'Header Text',
  defaultStyles: {
    fontSize: createStyleValue(24),
    fontWeight: 700,
    color: '#000000',
    textAlign: 'left',
    widthOption: 'fit',
    heightOption: 'auto',
    display: 'block',
    margin: createLinkedSpacing(0),
    padding: createLinkedSpacing(0),
  },
  tabs: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { key: 'content', label: 'Text', type: 'text' },
        { key: 'fontSize', label: 'Font Size', type: 'unit' },
        { key: 'fontWeight', label: 'Font Weight', type: 'select', options: [
          { value: '400', label: 'Regular' },
          { value: '500', label: 'Medium' },
          { value: '600', label: 'Semibold' },
          { value: '700', label: 'Bold' },
        ]},
        { key: 'color', label: 'Color', type: 'color' },
        { key: 'textAlign', label: 'Text Align', type: 'select', options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]},
      ],
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        { key: 'margin', label: 'Margin', type: 'spacing' },
        { key: 'padding', label: 'Padding', type: 'spacing' },
      ],
    },
    {
      id: 'size',
      label: 'Size',
      fields: [
        { key: 'dimensions', label: 'Dimensions', type: 'dimensions' },
      ],
    },
  ],
  render: (element: TemplateElement) => {
    return (
      <h2
        style={{
          fontSize: element.styles.fontSize ? `${element.styles.fontSize.value}${element.styles.fontSize.unit}` : '24px',
          fontWeight: element.styles.fontWeight || 700,
          color: element.styles.color || '#000000',
          textAlign: element.styles.textAlign || 'left',
        }}
      >
        {element.content || 'Header Text'}
      </h2>
    );
  },
};