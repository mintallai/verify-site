import type { Props as TippyProps, Tippy } from 'tippy.js';
import tippyjs from 'tippy.js';

const defaultProps: Partial<TippyProps> = {
  allowHTML: true,
  placement: 'top',
  theme: 'cai',
};

interface ITippyOpts {
  hasPadding: boolean;
}

const defaultOpts: ITippyOpts = {
  hasPadding: true,
};

export function tippy(
  node: HTMLElement,
  props: Partial<TippyProps>,
  options?: Partial<ITippyOpts>,
) {
  const { content, ...tippyProps } = props;
  const opts = { ...defaultOpts, ...options };
  const contentHTML = opts.hasPadding
    ? `<div class="p-3 pt-2">${content}</div>`
    : content;
  return tippyjs(node, {
    ...defaultProps,
    ...tippyProps,
    content: contentHTML,
  });
}

export type { Props as TippyProps } from 'tippy.js';
