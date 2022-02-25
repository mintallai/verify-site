// ADOBE CONFIDENTIAL
// Copyright 2020 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

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
      ? `<div class="p-3">${content}</div>`
      : content;
  return tippyjs(node, {
    ...defaultProps,
    ...tippyProps,
    content: contentHTML,
  });
}

export type { Props as TippyProps, ReferenceElement } from 'tippy.js';
