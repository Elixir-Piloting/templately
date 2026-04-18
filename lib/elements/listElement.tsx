'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const listElement: ElementConfig = {
  type: 'list',
  label: 'List',
  icon: 'List',
  group: 'content',
  canContain: [],
  defaultContent: 'Item 1\nItem 2\nItem 3',
  defaultStyles: {
    fontSize: createStyleValue(14),
    fontWeight: 400,
    color: '#333333',
    listStyleType: 'disc',
    listPosition: 'inside',
    lineHeight: 1.8,
    margin: createLinkedSpacing(8),
    padding: createLinkedSpacing(0),
  },
  tabs: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { key: 'content', label: 'Items (one per line)', type: 'textarea' },
        { key: 'fontSize', label: 'Font Size', type: 'unit' },
        { key: 'fontWeight', label: 'Font Weight', type: 'select', options: [
          { value: '400', label: 'Regular' },
          { value: '600', label: 'Bold' },
        ]},
        { key: 'color', label: 'Color', type: 'color' },
        { key: 'lineHeight', label: 'Line Height', type: 'number', min: 0.5, max: 3, step: 0.1 },
      ],
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        { key: 'listStyleType', label: 'Bullet Style', type: 'select', options: [
          { value: 'disc', label: 'Disc' },
          { value: 'circle', label: 'Circle' },
          { value: 'square', label: 'Square' },
          { value: 'none', label: 'None' },
        ]},
        { key: 'margin', label: 'Margin', type: 'spacing' },
        { key: 'padding', label: 'Padding', type: 'spacing' },
      ],
    },
  ],
  render: (element: TemplateElement) => {
    const items = (element.content || 'Item 1\nItem 2\nItem 3').split('\n').filter(item => item.trim());
    return (
      <ul
        style={{
          fontSize: element.styles.fontSize ? `${element.styles.fontSize.value}${element.styles.fontSize.unit}` : '14px',
          fontWeight: element.styles.fontWeight || 400,
          color: element.styles.color || '#333333',
          listStyleType: String(element.styles.listStyleType || 'disc'),
          lineHeight: element.styles.lineHeight || 1.8,
          margin: element.styles.margin ? `${element.styles.margin.top.value}${element.styles.margin.top.unit} 0` : '8px 0',
          padding: element.styles.padding ? `${element.styles.padding.top.value}${element.styles.padding.top.unit}` : '0',
        }}
      >
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  },
};