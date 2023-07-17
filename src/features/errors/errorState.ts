// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
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

import { format } from 'svelte-i18n';
import { derived, writable } from 'svelte/store';
import type { ErrorDescriptor } from './errors';

export function createError() {
  const messageId = writable<string | null>(null);
  const { subscribe } = derived(
    [messageId, format],
    ([$messageId, $format]) => {
      if (!$messageId) {
        return null;
      }

      return $format($messageId);
    },
  );

  return {
    subscribe,
    trigger: ({ messageStringId, duration }: ErrorDescriptor) => {
      messageId.set(messageStringId);

      setTimeout(() => {
        messageId.set(null);
      }, duration);
    },
  };
}
