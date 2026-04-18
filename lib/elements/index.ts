'use client';

import { ElementRegistry } from './elementConfig';
import { headerElement } from './headerElement';
import { paragraphElement } from './paragraphElement';
import { separatorElement } from './separatorElement';
import { divElement } from './divElement';
import { imageElement } from './imageElement';
import { buttonElement } from './buttonElement';
import { spacerElement } from './spacerElement';
import { codeElement } from './codeElement';
import { listElement } from './listElement';
import { badgeElement } from './badgeElement';

export const elementRegistry: ElementRegistry = {
  header: headerElement,
  paragraph: paragraphElement,
  separator: separatorElement,
  div: divElement,
  image: imageElement,
  button: buttonElement,
  spacer: spacerElement,
  code: codeElement,
  list: listElement,
  badge: badgeElement,
};

export { headerElement, paragraphElement, separatorElement, divElement, imageElement, buttonElement, spacerElement, codeElement, listElement, badgeElement };
export type { ElementConfig, ControlField, ControlTab } from './elementConfig';