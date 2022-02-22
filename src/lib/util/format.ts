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

import parseISO from 'date-fns/parseISO';
import dfnFormat from 'date-fns/format';
import kebabCase from 'lodash/fp/kebabCase';

export function format(date: Date, template: string) {
  try {
    return dfnFormat(date, template);
  } catch (err) {
    console.error('Invalid date given, could not parse:', date);
    return '';
  }
}

export function asDate(date: Date | string): Date {
  return typeof date === 'string' ? parseISO(date) : date;
}

export function formatDate(date: Date | string): string {
  return format(asDate(date), 'MM/dd/yyyy');
}

export function formatTime(date: Date | string): string {
  return format(asDate(date), 'h:mm aa');
}

export function formatDateTime(date: Date | string): string {
  return format(asDate(date), 'MM/dd/yyyy h:mm aa');
}

export function asFilename(str: string): string {
  return kebabCase(str);
}
