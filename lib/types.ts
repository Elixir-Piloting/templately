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

export interface ElementStyles {
  fontSize?: StyleValue;
  fontWeight?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  backgroundColor?: string;
  padding?: StyleValue;
  margin?: StyleValue;
  borderWidth?: StyleValue;
  borderColor?: string;
  borderRadius?: StyleValue;
  opacity?: number;
  lineHeight?: number;
  flexGrow?: number;
  flexShrink?: number;
  minHeight?: StyleValue;
  width?: StyleValue;
  height?: StyleValue;
  maxWidth?: StyleValue;
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

function createStyleValue(value: number, unit: StyleValue['unit'] = 'px'): StyleValue {
  return { value, unit };
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

export function createElement(type: ElementType): TemplateElement {
  const baseElement: TemplateElement = {
    id: crypto.randomUUID(),
    type,
    styles: {},
  };

  switch (type) {
    case 'header':
      return {
        ...baseElement,
        content: 'Header Text',
        styles: {
          fontSize: createStyleValue(24),
          fontWeight: 700,
          color: '#000000',
          textAlign: 'left',
        },
      };
    case 'paragraph':
      return {
        ...baseElement,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        styles: {
          fontSize: createStyleValue(14),
          fontWeight: 400,
          color: '#333333',
          textAlign: 'left',
          lineHeight: 1.6,
        },
      };
    case 'separator':
      return {
        ...baseElement,
        content: '',
        styles: {
          backgroundColor: '#000000',
          borderWidth: createStyleValue(0),
          minHeight: createStyleValue(1),
        },
      };
    case 'div':
      return {
        ...baseElement,
        content: '',
        children: [],
        styles: {
          backgroundColor: 'transparent',
          borderWidth: createStyleValue(1),
          borderColor: '#cccccc',
          borderRadius: createStyleValue(4),
          minHeight: createStyleValue(50),
        },
      };
    default:
      return baseElement;
  }
}