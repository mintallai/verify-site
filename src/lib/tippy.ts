import type { Props as TippyProps } from 'tippy.js';
import tippyjs from 'tippy.js';

const defaultProps: Partial<TippyProps> = {
  placement: 'top',
  theme: 'cai',
};

export function tippy(node: HTMLElement, props: Partial<TippyProps>) {
  return tippyjs(node, { ...defaultProps, ...props });
}
