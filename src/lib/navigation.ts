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

import { page } from '$app/stores';
import { get } from 'svelte/store';

export function removeParamsFromUrl(params: string[]) {
  const { url } = get(page);

  if (!url) {
    return null;
  }

  const { host, pathname, protocol, searchParams } = url;

  params.forEach((param) => searchParams.delete(param));

  const queryString = searchParams.toString();

  return `${protocol}//${host}${pathname}${
    queryString ? `?${queryString}` : ``
  }`;
}
