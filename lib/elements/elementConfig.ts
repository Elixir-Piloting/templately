'use client';

import { ElementType, TemplateElement, StyleValue, SpacingValue, WidthOption, HeightOption, LayoutMode } from '@/lib/types';

export interface ControlField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'color' | 'unit' | 'spacing' | 'dimensions';
  options?: { value: string; label: string }[];
  units?: StyleValue['unit'][];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  dependsOn?: { key: string; value: unknown };
}

export interface ControlTab {
  id: string;
  label: string;
  fields: ControlField[];
}

export interface ElementConfig {
  type: ElementType;
  label: string;
  icon: string;
  canContain: ElementType[];
  defaultContent?: string;
  defaultStyles: Partial<TemplateElement['styles']>;
  tabs: ControlTab[];
  render: (element: TemplateElement) => React.ReactNode;
}

export type ElementRegistry = Record<ElementType, ElementConfig>;

export function getElementConfig(registry: ElementRegistry, type: ElementType): ElementConfig | undefined {
  return registry[type];
}

export function getAllElementTypes(registry: ElementRegistry): ElementType[] {
  return Object.keys(registry) as ElementType[];
}