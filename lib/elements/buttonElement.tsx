'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const buttonElement: ElementConfig = {
  type: 'button',
  label: 'Button',
  icon: 'MousePointerClick',
  group: 'content',
  canContain: [],
  defaultContent: 'Click Me',
  defaultStyles: {
    fontSize: createStyleValue(16),
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    borderRadius: createStyleValue(6),
    padding: createLinkedSpacing(12),
    widthOption: 'fit',
    textAlign: 'center',
    margin: createLinkedSpacing(0),
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
        { key: 'color', label: 'Text Color', type: 'color' },
        { key: 'backgroundColor', label: 'Background', type: 'color' },
        { key: 'borderRadius', label: 'Border Radius', type: 'unit' },
        { key: 'margin', label: 'Margin', type: 'spacing' },
        { key: 'padding', label: 'Padding', type: 'spacing' },
      ],
    },
  ],
  render: (element: TemplateElement) => {
    const padding = element.styles.padding ? `${element.styles.padding.top.value}${element.styles.padding.top.unit}` : '12px';
    return (
      <button
        style={{
          fontSize: element.styles.fontSize ? `${element.styles.fontSize.value}${element.styles.fontSize.unit}` : '16px',
          fontWeight: element.styles.fontWeight || 600,
          color: element.styles.color || '#ffffff',
          backgroundColor: element.styles.backgroundColor || '#3b82f6',
          borderRadius: element.styles.borderRadius ? `${element.styles.borderRadius.value}${element.styles.borderRadius.unit}` : '6px',
          padding,
          border: 'none',
          cursor: 'pointer',
          display: 'inline-block',
        }}
      >
        {element.content || 'Click Me'}
      </button>
    );
  },
};