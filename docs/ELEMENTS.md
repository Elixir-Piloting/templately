# Element Registry System

## Overview

Elements are defined as config objects that describe their behavior, controls, and rendering. The system allows adding new elements without modifying the core builder code.

## Element Structure

```typescript
interface ElementConfig {
  type: ElementType;           // Unique identifier (e.g., 'header', 'image')
  label: string;               // Display name in UI
  icon: string;                 // Lucide icon name
  group: 'content' | 'layout'; // Category for sidebar grouping
  canContain: ElementType[];    // What elements can be nested inside
  defaultContent?: string;      // Initial text content
  defaultStyles: Partial<TemplateElement['styles']>; // Default styling
  tabs: ControlTab[];          // Property panel tabs with fields
  render: (element: TemplateElement) => React.ReactNode; // How to render
}
```

## Control Field Types

| Type | Description |
|------|-------------|
| `text` | Single line text input |
| `textarea` | Multi-line text input |
| `number` | Numeric input |
| `select` | Dropdown with options |
| `color` | Color picker |
| `unit` | Value + unit (px, %, em, rem) |
| `spacing` | Margin/padding with link toggle |
| `dimensions` | Width/height with full/fit/auto options |

## Field Options

```typescript
interface ControlField {
  key: string;                           // Style property key
  label: string;                         // Field label
  type: ControlFieldType;
  options?: { value: string; label: string }[];  // For select
  units?: StyleValue['unit'][];          // For unit type
  min?: number;                          // For number type
  max?: number;
  step?: number;
  placeholder?: string;
  dependsOn?: { key: string; value: unknown }; // Show only when another field has value
}
```

## Adding a New Element

1. Create `lib/elements/[name]Element.tsx`
2. Define the ElementConfig
3. Add to registry in `lib/elements/index.ts`
4. Add type to `lib/types.ts` ElementType union

### Example: Image Element

```typescript
// lib/elements/imageElement.tsx
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
    widthOption: 'full',
    heightOption: 'auto',
    objectFit: 'cover',
    borderRadius: createStyleValue(0),
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
      ],
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        { key: 'objectFit', label: 'Object Fit', type: 'select', options: [
          { value: 'cover', label: 'Cover' },
          { value: 'contain', label: 'Contain' },
          { value: 'fill', label: 'Fill' },
        ]},
        { key: 'borderRadius', label: 'Border Radius', type: 'unit' },
        { key: 'margin', label: 'Margin', type: 'spacing' },
      ],
    },
  ],
  render: (element: TemplateElement) => (
    <img
      src={element.styles.src || 'https://via.placeholder.com/300'}
      alt={element.styles.alt || ''}
      style={{
        width: element.styles.widthOption === 'full' ? '100%' : 'auto',
        height: element.styles.heightOption === 'auto' ? 'auto' : '200px',
        objectFit: element.styles.objectFit || 'cover',
        borderRadius: element.styles.borderRadius ? `${element.styles.borderRadius.value}${element.styles.borderRadius.unit}` : '0',
      }}
    />
  ),
};
```

## Registering Elements

```typescript
// lib/elements/index.ts
import { elementRegistry } from './elementConfig';
import { headerElement } from './headerElement';
import { imageElement } from './imageElement';

export const elementRegistry: ElementRegistry = {
  header: headerElement,
  image: imageElement,
  // ...other elements
};
```

## Adding Type Definition

```typescript
// lib/types.ts
export type ElementType = 'header' | 'paragraph' | 'separator' | 'div' | 'image';
```