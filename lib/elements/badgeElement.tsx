'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const badgeElement: ElementConfig = {
  type: 'badge',
  label: 'Badge',
  icon: 'Tag',
  group: 'content',
  canContain: [],
  defaultContent: 'Badge',
  defaultStyles: {
    fontSize: createStyleValue(12),
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: '#6b7280',
    borderRadius: createStyleValue(9999),
    padding: createLinkedSpacing(4),
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
          { value: '600', label: 'Semibold' },
          { value: '700', label: 'Bold' },
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
    const padding = element.styles.padding ? `${element.styles.padding.top.value}${element.styles.padding.top.unit}` : '4px';
    const borderRadius = element.styles.borderRadius ? `${element.styles.borderRadius.value}${element.styles.borderRadius.unit}` : '9999px';
    return (
      <span
        style={{
          fontSize: element.styles.fontSize ? `${element.styles.fontSize.value}${element.styles.fontSize.unit}` : '12px',
          fontWeight: element.styles.fontWeight || 600,
          color: element.styles.color || '#ffffff',
          backgroundColor: element.styles.backgroundColor || '#6b7280',
          borderRadius,
          padding,
          display: 'inline-block',
        }}
      >
        {element.content || 'Badge'}
      </span>
    );
  },
};