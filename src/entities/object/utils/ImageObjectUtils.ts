import type { ImageObject } from '../types/ObjectTypes.ts';
import { cloneTransform, cloneFilters, cloneCrop } from '../factory/helpers.ts';

/**
 * Shallow-clone the object and clone nested mutable fields.
 * Keeps immutability guarantees for callers.
 */
function cloneWithNested(obj: ImageObject): ImageObject {
    return {
        ...obj,
        transform: cloneTransform(obj.transform),
        filters: cloneFilters(obj.filters),
        crop: cloneCrop(obj.crop),
    };
}

/**
 * Safely merge existing filters with a partial patch.
 * - If `patch` is null/undefined -> returns a clone of `existing` (maybe undefined).
 * - If `existing` is present -> return merged clone.
 * - If `existing` is absent -> return a new object from patch.
 */
function mergeFiltersSafe(
    existing: ImageObject['filters'],
    patch?: Partial<ImageObject['filters']>
): ImageObject['filters'] | undefined {
    if (!patch) {
        return cloneFilters(existing);
    }
    return existing
        ? { ...existing, ...(patch as object) }
        : { ...(patch as object) };
}

/**
 * Small helper to apply a shallow top-level change while preserving cloned nested fields.
 */
function withClonedNested<T extends ImageObject>(
    obj: T,
    changes: Partial<T>
): T {
    return { ...(cloneWithNested(obj) as T), ...changes };
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
    const base = cloneWithNested(obj);
    return {
        ...base,
        filters: mergeFiltersSafe(obj.filters, filters),
    };
}

export function updateImageCrop(
    obj: ImageObject,
    crop: ImageObject['crop'] | undefined
): ImageObject {
    // clone incoming crop to avoid sharing references
    return withClonedNested(obj, { crop: cloneCrop(crop) });
}
