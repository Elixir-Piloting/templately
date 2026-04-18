'use client';

import { create } from 'zustand';
import { Template, TemplateElement, createDefaultTemplate, createElement, ElementType } from '@/lib/types';

interface BuilderState {
  template: Template;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  draggingElementId: string | null;
  dropTargetId: string | null;
  setTemplate: (template: Template) => void;
  addElement: (type: ElementType, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<TemplateElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setHoveredElement: (id: string | null) => void;
  setDraggingElement: (id: string | null) => void;
  setDropTarget: (id: string | null) => void;
  updatePage: (updates: Partial<Template['page']>) => void;
  updateLayout: (updates: Partial<Template['layout']>) => void;
  moveElement: (elementId: string, direction: 'up' | 'down') => void;
  moveElementInto: (elementId: string, targetId: string) => void;
  moveElementToIndex: (elementId: string, newIndex: number, targetParentId: string | null) => void;
}

function findElementById(elements: TemplateElement[], id: string): TemplateElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

function updateElementInTree(elements: TemplateElement[], id: string, updates: Partial<TemplateElement>): TemplateElement[] {
  return elements.map(el => {
    if (el.id === id) {
      return { ...el, ...updates };
    }
    if (el.children) {
      return { ...el, children: updateElementInTree(el.children, id, updates) };
    }
    return el;
  });
}

function removeElementFromTree(elements: TemplateElement[], id: string): TemplateElement[] {
  return elements
    .filter(el => el.id !== id)
    .map(el => {
      if (el.children) {
        return { ...el, children: removeElementFromTree(el.children, id) };
      }
      return el;
    });
}

function findParentAndIndex(elements: TemplateElement[], id: string, parent: TemplateElement | null = null): { parent: TemplateElement | null; index: number; elements: TemplateElement[] } {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === id) {
      return { parent, index: i, elements };
    }
    if (elements[i].children) {
      const result = findParentAndIndex(elements[i].children!, id, elements[i]);
      if (result.index !== -1) return result;
    }
  }
  return { parent: null, index: -1, elements: [] };
}

export const useBuilderStore = create<BuilderState>((set) => ({
  template: createDefaultTemplate(),
  selectedElementId: null,
  hoveredElementId: null,
  draggingElementId: null,
  dropTargetId: null,
  setTemplate: (template) => set({ template }),
  
  addElement: (type, parentId) =>
    set((state) => {
      const newElement = createElement(type);
      if (!parentId) {
        return {
          template: {
            ...state.template,
            elements: [...state.template.elements, newElement],
          },
        };
      }
      return {
        template: {
          ...state.template,
          elements: updateElementInTree(state.template.elements, parentId, {
            children: [...(findElementById(state.template.elements, parentId)?.children || []), newElement],
          }),
        },
      };
    }),
  
  updateElement: (id, updates) =>
    set((state) => ({
      template: {
        ...state.template,
        elements: updateElementInTree(state.template.elements, id, updates),
      },
    })),
  
  deleteElement: (id) =>
    set((state) => ({
      template: {
        ...state.template,
        elements: removeElementFromTree(state.template.elements, id),
      },
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    })),
  
  selectElement: (id) => set({ selectedElementId: id }),
  setHoveredElement: (id) => set({ hoveredElementId: id }),
  setDraggingElement: (id) => set({ draggingElementId: id, dropTargetId: null }),
  setDropTarget: (id) => set({ dropTargetId: id }),
  
  updatePage: (updates) =>
    set((state) => ({
      template: {
        ...state.template,
        page: { ...state.template.page, ...updates },
      },
    })),
  
  updateLayout: (updates) =>
    set((state) => ({
      template: {
        ...state.template,
        layout: { ...state.template.layout, ...updates },
      },
    })),

  moveElement: (elementId, direction) =>
    set((state) => {
      const { parent, index, elements } = findParentAndIndex(state.template.elements, elementId);
      if (index === -1) return state;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= elements.length) return state;
      
      const newElements = [...elements];
      [newElements[index], newElements[newIndex]] = [newElements[newIndex], newElements[index]];
      
      if (parent) {
        return {
          template: {
            ...state.template,
            elements: updateElementInTree(state.template.elements, parent.id, { children: newElements }),
          },
        };
      }
      
      return {
        template: {
          ...state.template,
          elements: newElements,
        },
      };
    }),

  moveElementInto: (elementId, targetId) =>
    set((state) => {
      if (elementId === targetId) return state;
      
      const element = findElementById(state.template.elements, elementId);
      const target = findElementById(state.template.elements, targetId);
      if (!element || !target || target.type !== 'div') return state;
      
      const elementsWithout = removeElementFromTree(state.template.elements, elementId);
      
      return {
        template: {
          ...state.template,
          elements: updateElementInTree(elementsWithout, targetId, {
            children: [...(target.children || []), element],
          }),
        },
      };
    }),

  moveElementToIndex: (elementId, newIndex, targetParentId) =>
    set((state) => {
      const element = findElementById(state.template.elements, elementId);
      if (!element) return state;
      
      const elementsWithout = removeElementFromTree(state.template.elements, elementId);
      
      if (targetParentId) {
        const parent = findElementById(state.template.elements, targetParentId);
        if (!parent || parent.type !== 'div') return state;
        
        const targetElements = parent.children || [];
        const newChildren = [
          ...targetElements.slice(0, newIndex),
          element,
          ...targetElements.slice(newIndex)
        ];
        
        return {
          template: {
            ...state.template,
            elements: updateElementInTree(elementsWithout, targetParentId, { children: newChildren }),
          },
          draggingElementId: null,
          dropTargetId: null,
        };
      }
      
      const finalElements = [
        ...elementsWithout.slice(0, newIndex),
        element,
        ...elementsWithout.slice(newIndex)
      ];
      
      return {
        template: {
          ...state.template,
          elements: finalElements,
        },
        draggingElementId: null,
        dropTargetId: null,
      };
    }),
}));