// typescript
// file: `src/entities/object/utils/ImageObjectUtils.ts`
import type { ImageObject } from '../types/ObjectTypes.ts';
import {
    deepCloneNestedBase,
    cloneCrop,
    mergePartialFiltersSafe,
} from '../factory/helpers.ts';

/**
 * Small helper to apply a shallow top-level change while preserving cloned nested fields.
 * Reuses deepCloneNestedBase from helpers to avoid duplication.
 */
function withClonedNested<T extends ImageObject>(
    obj: T,
    changes: Partial<T>
): T {
    const base = deepCloneNestedBase(obj) as T;
    return { ...base, ...changes };
}

export function updateImageSource(obj: ImageObject, src: string): ImageObject {
    return withClonedNested(obj, { src });
}

export function updateImageFit(
    obj: ImageObject,
    fit: 'contain' | 'cover' | 'fill' | 'tile'
): ImageObject {
    return withClonedNested(obj, { fit });
}

export function updateImageFilters(
    obj: ImageObject,
    filters: Partial<ImageObject['filters']> | undefined
): ImageObject {
    const base = deepCloneNestedBase(obj) as ImageObject;
    return {
        ...base,
        filters: mergePartialFiltersSafe(obj.filters, filters),
    };
}

export function updateImageCrop(
    obj: ImageObject,
    crop: ImageObject['crop'] | undefined
): ImageObject {
    return withClonedNested(obj, { crop: cloneCrop(crop) });
}
