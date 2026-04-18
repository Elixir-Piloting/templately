'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const imageElement: ElementConfig = {
  type: 'image',
  label: 'Image',
  icon: 'Image',
  group: 'content',
  canContain: [],
  defaultContent: '',
  defaultStyles: {
    src: 'https://via.placeholder.com/300x200',
    alt: 'Image',
    objectFit: 'cover',
    borderRadius: createStyleValue(0),
    widthOption: 'full',
    heightOption: 'auto',
    margin: createLinkedSpacing(0),
    padding: createLinkedSpacing(0),
  },
  tabs: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { key: 'src', label: 'Image URL', type: 'text' },
        { key: 'alt', label: 'Alt Text', type: 'text' },
        { key: 'objectFit', label: 'Object Fit', type: 'select', options: [
          { value: 'cover', label: 'Cover' },
          { value: 'contain', label: 'Contain' },
          { value: 'fill', label: 'Fill' },
        ]},
      ],
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        { key: 'borderRadius', label: 'Border Radius', type: 'unit' },
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
    const width = element.styles.widthOption === 'full' ? '100%' : (element.styles.width ? `${element.styles.width.value}${element.styles.width.unit}` : 'auto');
    const height = element.styles.heightOption === 'auto' ? 'auto' : (element.styles.height ? `${element.styles.height.value}${element.styles.height.unit}` : '200px');
    const borderRadius = element.styles.borderRadius ? `${element.styles.borderRadius.value}${element.styles.borderRadius.unit}` : '0';
    
    const objectFitVal = String(element.styles.objectFit || 'cover');

    return (
      <img
        src={String(element.styles.src || 'https://via.placeholder.com/300x200')}
        alt={String(element.styles.alt || 'Image')}
        style={{
          width,
          height,
          objectFit: objectFitVal,
          borderRadius,
          display: 'block',
        } as React.CSSProperties}
      />
    );
  },
};