import type { Props as TippyProps } from 'tippy.js';
import tippyjs, { followCursor } from 'tippy.js';

const defaultProps: Partial<TippyProps> = {
  allowHTML: true,
  placement: 'top',
  theme: 'cai',
  plugins: [followCursor],
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
  const contentHTML =
    opts.hasPadding && !(content instanceof HTMLElement)
      ? `<div class="p-3 pt-2">${content}</div>`
      : content;
  return tippyjs(node, {
    ...defaultProps,
    ...tippyProps,
    content: contentHTML,
  });
}

export type { Props as TippyProps, ReferenceElement } from 'tippy.js';
