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

import A from './images/A.js';
import C from './images/C.js';
import CAICAI from './images/CAICAI.js';
import CAIXCI from './images/CAIXCI.js';
import CIEsigCA from './images/CIE-sig-CA.js';
import EsigCA from './images/E-sig-CA.js';
import ExportedEClmCAICAI from './images/Exported_E-clm-CAICAI.js';
import missingJumbf from './images/missing-jumbf.js';
import possiblyMissing from './images/possibly-missing.js';
import unknownActions from './images/unknown-actions.js';
import type { TestImageDescriptor } from './types';

export const allImages: TestImageDescriptor[] = [
  CAICAI,
  EsigCA,
  A,
  C,
  CAIXCI,
  CIEsigCA,
  ExportedEClmCAICAI,
  possiblyMissing,
  missingJumbf,
  unknownActions,
];
