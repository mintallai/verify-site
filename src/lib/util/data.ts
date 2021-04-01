export function arrayBufferToBlob(
  arrayBuffer: ArrayBuffer,
  mimeType = 'image/jpeg',
) {
  return new Blob([arrayBuffer], { type: mimeType });
}

export function arrayBufferToBlobUrl(
  arrayBuffer: ArrayBuffer,
  mimeType = 'image/jpeg',
) {
  const blob = arrayBufferToBlob(arrayBuffer, mimeType);
  return URL.createObjectURL(blob);
}
