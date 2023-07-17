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

import ImageReducer from 'image-blob-reduce';

const RESIZE_MAX_SIZE = 512;
const RESIZE_JPEG_QUALITY = 0.7;

const imageReducer = ImageReducer();

export async function resizeImage(sourceImage: Blob): Promise<Blob> {
  const resizedCanvas = await imageReducer.toCanvas(sourceImage, {
    max: RESIZE_MAX_SIZE,
  });

  const resizedImage = await exportCanvas(resizedCanvas);

  return resizedImage;
}

async function exportCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob ? resolve(blob) : reject();
      },
      'image/jpeg',
      RESIZE_JPEG_QUALITY,
    );
  });
}
