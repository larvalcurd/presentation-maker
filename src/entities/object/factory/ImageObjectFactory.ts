import type { BaseObject, ImageObject } from '../types/ObjectTypes.ts';
import { createBaseObject } from './BaseObjectFactory.ts';
import { applyPatch } from './helpers.ts';

export function createImageObject(
    params: {
        x: number;
        y: number;
        width: number;
        height: number;
        src: string;
        preserveAspect?: boolean;
        fit?: 'contain' | 'cover' | 'fill' | 'tile';
        crop?: Partial<ImageObject['crop']>;
        filters?: Partial<ImageObject['filters']>;
        mask?: ImageObject['mask'];
        rotationOrigin?: ImageObject['rotationOrigin'];
    } & Partial<BaseObject>
): ImageObject {
    const base = createBaseObject(params);
    const original: ImageObject = {
        ...base,
        type: 'image',
        src: '',
        preserveAspect: true,
        fit: 'contain',
        crop: undefined,
        filters: undefined,
        mask: undefined,
        rotationOrigin: 'center',
    };
    return applyPatch(original, params as Partial<ImageObject>);
}

export function createMinimalImage(overrides?: Partial<ImageObject>) {
    return createImageObject({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        src: '',
        ...overrides,
    });
}

// typescript
export function createMaximalImage(overrides?: Partial<ImageObject>) {
    const maximalFilters = {
        brightness: 1.2,
        contrast: 1.5,
        blur: 2,
        saturation: 1.3,
        grayscale: 0.5,
    };

    // Compute filters: if overrides provide filters, merge them into maximalFilters;
    // otherwise use maximalFilters.
    const mergedFilters = overrides?.filters
        ? { ...maximalFilters, ...overrides.filters }
        : maximalFilters;

    return createImageObject({
        x: 50,
        y: 50,
        width: 400,
        height: 300,
        src: 'big-image.png',
        preserveAspect: false,
        fit: 'cover',
        crop: { x: 0, y: 0, width: 200, height: 150 },
        mask: { shape: 'circle', radius: 50 },
        rotationOrigin: { x: 100, y: 50 },
        locked: true,
        visible: true,
        style: {
            borderRadius: 20,
            borderColor: '#123456',
            borderWidth: 3,
            shadow: { offsetX: 5, offsetY: 5, blur: 10, color: '#333333aa' },
            backgroundColor: '#abcdef',
        },
        transform: { rotate: 45, scaleX: 0.8, scaleY: 0.8, opacity: 0.9 },

        // allow other overrides to replace defaults, but ensure filters uses the merged value
        ...overrides,
        filters: mergedFilters,
    });
}
