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

export type Disposable<T> = {
  // Disposer function that should be called when this resource is no longer being used
  dispose: () => void;
} & T;

type LoadableStateNone = {
  state: 'none';
};

type LoadableStateLoading = {
  state: 'loading';
};

type LoadableStateSuccess<T> = { state: 'success' } & T;

export type Loadable<T> =
  | LoadableStateNone
  | LoadableStateLoading
  | LoadableStateSuccess<T>;
