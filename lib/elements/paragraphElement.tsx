'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const paragraphElement: ElementConfig = {
  type: 'paragraph',
  label: 'Paragraph',
  icon: 'Layout',
  canContain: [],
  defaultContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  defaultStyles: {
    fontSize: createStyleValue(14),
    fontWeight: 400,
    color: '#333333',
    textAlign: 'left',
    lineHeight: 1.6,
    widthOption: 'full',
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
        { key: 'content', label: 'Text', type: 'textarea' },
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
        { key: 'lineHeight', label: 'Line Height', type: 'number', min: 0.5, max: 3, step: 0.1 },
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
      <p
        style={{
          fontSize: element.styles.fontSize ? `${element.styles.fontSize.value}${element.styles.fontSize.unit}` : '14px',
          fontWeight: element.styles.fontWeight || 400,
          color: element.styles.color || '#333333',
          textAlign: element.styles.textAlign || 'left',
          lineHeight: element.styles.lineHeight || 1.6,
        }}
      >
        {element.content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
      </p>
    );
  },
};