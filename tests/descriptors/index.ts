// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
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

import A from './images/A';
import C from './images/C';
import CAICAI from './images/CAICAI';
import CAIXCI from './images/CAIXCI';
import CIEsigCA from './images/CIE-sig-CA';
import EsigCA from './images/E-sig-CA';
import possiblyMissing from './images/possibly-missing';
import unknownActions from './images/unknown-actions';
import { TestImageDescriptor } from './types';

export const allImages: TestImageDescriptor[] = [
  CAICAI,
  EsigCA,
  A,
  C,
  CAIXCI,
  CIEsigCA,
  possiblyMissing,
  unknownActions,
];
