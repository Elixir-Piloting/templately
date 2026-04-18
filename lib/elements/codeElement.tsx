'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const codeElement: ElementConfig = {
  type: 'code',
  label: 'Code Block',
  icon: 'Code',
  group: 'content',
  canContain: [],
  defaultContent: '// Your code here\nconsole.log("Hello World");',
  defaultStyles: {
    fontSize: createStyleValue(14),
    fontFamily: 'monospace',
    color: '#1f2937',
    backgroundColor: '#f3f4f6',
    borderRadius: createStyleValue(4),
    padding: createLinkedSpacing(16),
    widthOption: 'full',
    textAlign: 'left',
    margin: createLinkedSpacing(0),
  },
  tabs: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { key: 'content', label: 'Code', type: 'textarea' },
        { key: 'fontSize', label: 'Font Size', type: 'unit' },
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
    return (
      <pre
        style={{
          fontSize: element.styles.fontSize ? `${element.styles.fontSize.value}${element.styles.fontSize.unit}` : '14px',
          fontFamily: element.styles.fontFamily || 'monospace',
          color: element.styles.color || '#1f2937',
          backgroundColor: element.styles.backgroundColor || '#f3f4f6',
          borderRadius: element.styles.borderRadius ? `${element.styles.borderRadius.value}${element.styles.borderRadius.unit}` : '4px',
          padding: element.styles.padding ? `${element.styles.padding.top.value}${element.styles.padding.top.unit}` : '16px',
          margin: 0,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {element.content || '// Your code here\nconsole.log("Hello World");'}
      </pre>
    );
  },
};