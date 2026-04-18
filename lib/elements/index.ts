'use client';

import { ElementRegistry } from './elementConfig';
import { headerElement } from './headerElement';
import { paragraphElement } from './paragraphElement';
import { separatorElement } from './separatorElement';
import { divElement } from './divElement';

export const elementRegistry: ElementRegistry = {
  header: headerElement,
  paragraph: paragraphElement,
  separator: separatorElement,
  div: divElement,
};

export { headerElement, paragraphElement, separatorElement, divElement };
export type { ElementConfig, ControlField, ControlTab } from './elementConfig';