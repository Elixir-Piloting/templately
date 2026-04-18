'use client';

import { ElementType } from './types';
import { elementRegistry } from './elements';

export function createElement(type: ElementType) {
  const config = elementRegistry[type];
  if (!config) {
    throw new Error(`Unknown element type: ${type}`);
  }

  return {
    id: crypto.randomUUID(),
    type,
    content: config.defaultContent || '',
    children: config.canContain.length > 0 ? [] : undefined,
    styles: { ...config.defaultStyles },
  };
}