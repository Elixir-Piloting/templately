'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const spacerElement: ElementConfig = {
  type: 'spacer',
  label: 'Spacer',
  icon: 'ArrowDown',
  group: 'layout',
  canContain: [],
  defaultContent: '',
  defaultStyles: {
    height: createStyleValue(20),
    margin: createLinkedSpacing(0),
  },
  tabs: [
    {
      id: 'style',
      label: 'Style',
      fields: [
        { key: 'height', label: 'Height', type: 'unit' },
        { key: 'margin', label: 'Margin', type: 'spacing' },
      ],
    },
  ],
  render: (element: TemplateElement) => {
    const height = element.styles.height ? `${element.styles.height.value}${element.styles.height.unit}` : '20px';
    return (
      <div
        style={{
          height,
          width: '100%',
        }}
      />
    );
  },
};