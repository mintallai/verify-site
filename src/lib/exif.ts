// ADOBE CONFIDENTIAL
// Copyright 2022 Adobe
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

import mapbox from '@mapbox/mapbox-sdk/lib/classes/mapi-client';
import mapboxStatic from '@mapbox/mapbox-sdk/services/static';
import type { Manifest } from 'c2pa';
import circleToPolygon from 'circle-to-polygon';
import debug from 'debug';
import convertGeo from 'geo-coordinates-parser';
import { MAPBOX_TOKEN } from './config';
import { asDate } from './util/format';

const dbg = debug('exif');

// See precision values here: https://en.wikipedia.org/wiki/Decimal_degrees
export const LOCATION_PRECISION = 2;

export interface ExifTags {
  'dc:creator'?: string;
  'dc:rights'?: string;
  'exif:DateTimeOriginal'?: string;
  'exif:ExposureTime'?: string | number;
  'exif:FNumber'?: number;
  'exif:GPSLatitude'?: string;
  'exif:GPSLongitude'?: string;
}

function findExifValue(exif: ExifTags, locations: string[]) {
  return locations.map((key) => exif[key]).filter((x) => !!x)?.[0];
}

function getExposureDetails(exif: ExifTags) {
  const exposure = [];
  // TODO: Convert this to a fraction if not
  const exposureTime = exif['exif:ExposureTime'];
  const fNumber = exif['exif:FNumber'];
  const isoValue = findExifValue(exif, [
    'exifEX:PhotographicSensitivity',
    'exif:ISOSpeed',
    'exif:ISOSpeedRatings',
  ]);
  const iso = Array.isArray(isoValue) ? isoValue[0] : isoValue;

  if (exposureTime) exposure.push(`${exposureTime} sec`);
  if (fNumber) exposure.push(`f/${fNumber}`);
  if (iso) exposure.push(`ISO ${iso}`);

  return exposure;
}

function getCaptureDetails(exif: ExifTags) {
  return [
    {
      label: 'cameraMake',
      value: findExifValue(exif, ['exif:Make', 'tiff:Make']),
    },
    {
      label: 'cameraModel',
      value: findExifValue(exif, ['exif:Model', 'tiff:Model']),
    },
    {
      label: 'lensMake',
      value: findExifValue(exif, ['exif:LensMake', 'exifEX:LensMake']),
    },
    {
      label: 'lensModel',
      value: findExifValue(exif, ['exif:LensModel', 'exifEX:LensModel']),
    },
    {
      label: 'exposure',
      value: getExposureDetails(exif).join('; '),
    },
  ].filter(({ value }) => !!value);
}

interface ApproximateLocation {
  long: number;
  lat: number;
}

function getApproximateLocation(exif: ExifTags): ApproximateLocation {
  const long = exif['exif:GPSLongitude'];
  const lat = exif['exif:GPSLatitude'];

  if (lat && long) {
    try {
      const approx = convertGeo([lat, long].join(' '), LOCATION_PRECISION);
      dbg('Got approximate location', approx);
      return {
        long: approx.decimalLongitude,
        lat: approx.decimalLatitude,
      };
    } catch (err) {
      dbg('Could not decode location', { lat, long, err });
      return null;
    }
  }

  return null;
}

export function selectExif(manifest: Manifest) {
  const exif = manifest?.assertions?.get('stds.exif')[0]?.data;

  if (exif) {
    const captureDate = exif['exif:DateTimeOriginal'];

    return {
      creator: exif['dc:creator'],
      copyright: exif['dc:rights'],
      captureDate: captureDate ? asDate(captureDate) : null,
      captureDetails: getCaptureDetails(exif),
      location: getApproximateLocation(exif),
    };
  }

  return null;
}

export type ExifSummary = ReturnType<typeof selectExif>;

const defaultMapConfig = {
  ownerId: 'mapbox',
  styleId: 'light-v10',
  width: 271,
  height: 280,
  zoom: 9,
  highRes: true,
  highlightRadiusMeters: 10000,
  highlightEdges: 64,
  path: {
    strokeWidth: 3,
    strokeColor: '2680EB',
    fillColor: '2680EB',
    fillOpacity: 0.05,
  },
};

export function generateMapUrl(
  exif: ExifSummary,
  overrides: Partial<typeof defaultMapConfig> = {},
) {
  if (!exif.location) {
    return null;
  }

  const loc = exif.location;
  const config = { ...defaultMapConfig, ...overrides };
  const position = {
    coordinates: [loc.long, loc.lat] as [number, number],
    zoom: config.zoom,
  };

  // GeoJSON does not support circles natively
  const highlightPoly = circleToPolygon(
    [loc.long, loc.lat],
    config.highlightRadiusMeters,
    config.highlightEdges,
  );
  const coordinates = highlightPoly?.coordinates?.[0] ?? [];
  const overlay = {
    path: {
      coordinates,
      ...config.path,
    },
  };
  const outline = {
    path: {
      coordinates,
      strokeWidth: config.path.strokeWidth + 2,
      strokeColor: 'fff',
    },
  };

  const client = new mapbox({ accessToken: MAPBOX_TOKEN });
  const staticService = mapboxStatic(client);

  const req = staticService.getStaticImage({
    ownerId: config.ownerId,
    styleId: config.styleId,
    width: config.width,
    height: config.height,
    position,
    overlays: [outline, overlay],
    highRes: config.highRes,
  });

  return req.url();
}
