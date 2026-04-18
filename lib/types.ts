export type ElementType = 'header' | 'paragraph' | 'separator' | 'div';

export interface TemplateElement {
  id: string;
  type: ElementType;
  content?: string;
  children?: TemplateElement[];
  styles: ElementStyles;
}

export interface StyleValue {
  value: number;
  unit: 'px' | '%' | 'em' | 'rem';
}

export interface SpacingValue {
  top: StyleValue;
  right: StyleValue;
  bottom: StyleValue;
  left: StyleValue;
  linked: boolean;
}

export type WidthOption = 'custom' | 'full' | 'fit';
export type HeightOption = 'custom' | 'full' | 'fit' | 'auto';
export type LayoutMode = 'flex' | 'grid' | 'block';

export interface ElementStyles {
  fontSize?: StyleValue;
  fontWeight?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  backgroundColor?: string;
  
  padding?: SpacingValue;
  margin?: SpacingValue;
  
  borderWidth?: StyleValue;
  borderColor?: string;
  borderRadius?: StyleValue;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  
  opacity?: number;
  lineHeight?: number;
  
  width?: StyleValue;
  widthOption?: WidthOption;
  height?: StyleValue;
  heightOption?: HeightOption;
  maxWidth?: StyleValue;
  minWidth?: StyleValue;
  minHeight?: StyleValue;
  maxHeight?: StyleValue;
  
  display?: LayoutMode;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: StyleValue;
  
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumnGap?: StyleValue;
  gridRowGap?: StyleValue;
  gridColumns?: number;
  gridRows?: number;
  gap?: StyleValue;
  
  separatorWeight?: StyleValue;
  separatorLength?: StyleValue;
  separatorLengthOption?: 'full' | 'custom';
  separatorOrientation?: 'horizontal' | 'vertical';
  separatorColor?: string;
}

export interface PageConfig {
  width: number;
  height: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface Template {
  id?: string;
  name: string;
  page: PageConfig;
  elements: TemplateElement[];
  layout: {
    direction: 'row' | 'column';
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    gap: StyleValue;
    padding: StyleValue;
  };
  createdAt?: string;
  updatedAt?: string;
}

export function createStyleValue(value: number, unit: StyleValue['unit'] = 'px'): StyleValue {
  return { value, unit };
}

export function createLinkedSpacing(value: number, unit: StyleValue['unit'] = 'px', linked = true): SpacingValue {
  return {
    top: { value, unit },
    right: { value, unit },
    bottom: { value, unit },
    left: { value, unit },
    linked,
  };
}

export function createUnlinkedSpacing(top: number, right: number, bottom: number, left: number, unit: StyleValue['unit'] = 'px'): SpacingValue {
  return {
    top: { value: top, unit },
    right: { value: right, unit },
    bottom: { value: bottom, unit },
    left: { value: left, unit },
    linked: false,
  };
}

export function createDefaultPage(): PageConfig {
  return {
    width: 794,
    height: 1123,
    margins: {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
    },
  };
}

export function createDefaultTemplate(): Template {
  return {
    name: 'Untitled Template',
    page: createDefaultPage(),
    elements: [],
    layout: {
      direction: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      gap: createStyleValue(16),
      padding: createStyleValue(0),
    },
  };
}