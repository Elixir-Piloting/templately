'use client';

import React from 'react';
import { ElementConfig } from './elementConfig';
import { TemplateElement, createStyleValue, createLinkedSpacing } from '@/lib/types';

export const divElement: ElementConfig = {
  type: 'div',
  label: 'Div (Container)',
  icon: 'Square',
  group: 'layout',
  canContain: ['header', 'paragraph', 'separator', 'div'],
  defaultContent: '',
  defaultStyles: {
    backgroundColor: 'transparent',
    borderWidth: createStyleValue(1),
    borderColor: '#cccccc',
    borderRadius: createStyleValue(4),
    borderStyle: 'solid',
    minHeight: createStyleValue(50),
    widthOption: 'full',
    display: 'flex',
    flexDirection: 'column',
    gap: createStyleValue(8),
    margin: createLinkedSpacing(0),
    padding: createLinkedSpacing(8),
  },
  tabs: [
    {
      id: 'style',
      label: 'Style',
      fields: [
        { key: 'backgroundColor', label: 'Background Color', type: 'color' },
        { key: 'borderWidth', label: 'Border Width', type: 'unit' },
        { key: 'borderColor', label: 'Border Color', type: 'color' },
        { key: 'borderRadius', label: 'Border Radius', type: 'unit' },
        { key: 'borderStyle', label: 'Border Style', type: 'select', options: [
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
        ]},
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
    {
      id: 'layout',
      label: 'Layout',
      fields: [
        { key: 'display', label: 'Display', type: 'select', options: [
          { value: 'block', label: 'Block' },
          { value: 'flex', label: 'Flex' },
          { value: 'grid', label: 'Grid' },
        ]},
        { key: 'flexDirection', label: 'Direction', type: 'select', options: [
          { value: 'row', label: 'Row' },
          { value: 'column', label: 'Column' },
          { value: 'row-reverse', label: 'Row Reverse' },
          { value: 'column-reverse', label: 'Column Reverse' },
        ], dependsOn: { key: 'display', value: 'flex' } },
        { key: 'flexWrap', label: 'Wrap', type: 'select', options: [
          { value: 'nowrap', label: 'No Wrap' },
          { value: 'wrap', label: 'Wrap' },
        ], dependsOn: { key: 'display', value: 'flex' } },
        { key: 'justifyContent', label: 'Justify', type: 'select', options: [
          { value: 'flex-start', label: 'Start' },
          { value: 'center', label: 'Center' },
          { value: 'flex-end', label: 'End' },
          { value: 'space-between', label: 'Space Between' },
          { value: 'space-around', label: 'Space Around' },
        ], dependsOn: { key: 'display', value: 'flex' } },
        { key: 'alignItems', label: 'Align', type: 'select', options: [
          { value: 'stretch', label: 'Stretch' },
          { value: 'flex-start', label: 'Start' },
          { value: 'center', label: 'Center' },
          { value: 'flex-end', label: 'End' },
        ], dependsOn: { key: 'display', value: 'flex' } },
        { key: 'gap', label: 'Gap', type: 'unit', dependsOn: { key: 'display', value: 'flex' } },
        { key: 'gridColumns', label: 'Columns', type: 'number', min: 1, max: 12, dependsOn: { key: 'display', value: 'grid' } },
        { key: 'gridRows', label: 'Rows', type: 'number', min: 1, max: 12, dependsOn: { key: 'display', value: 'grid' } },
        { key: 'gridColumnGap', label: 'Column Gap', type: 'unit', dependsOn: { key: 'display', value: 'grid' } },
        { key: 'gridRowGap', label: 'Row Gap', type: 'unit', dependsOn: { key: 'display', value: 'grid' } },
      ],
    },
  ],
  render: (element: TemplateElement) => {
    return <div className="min-h-[50px]">{element.content}</div>;
  },
};