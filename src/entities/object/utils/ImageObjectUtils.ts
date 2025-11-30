import type { ImageObject } from '../types/ObjectTypes.ts';
import { cloneTransform, cloneFilters, cloneCrop } from '../factory/helpers.ts';

function copyNested(object: ImageObject): ImageObject {
    return {
        ...object,
        transform: cloneTransform(object.transform),
        filters: cloneFilters(object.filters),
        crop: cloneCrop(object.crop),
    };
}

export function updateImageSource(obj: ImageObject, src: string): ImageObject {
    return { ...copyNested(obj), src };
}

export function updateImageFit(
    obj: ImageObject,
    fit: 'contain' | 'cover' | 'fill' | 'tile'
): ImageObject {
    return { ...copyNested(obj), fit };
}

export function updateImageFilters(
    obj: ImageObject,
    filters: Partial<ImageObject['filters']>
): ImageObject {
    return { ...copyNested(obj), filters: { ...obj.filters, ...filters } };
}

export function updateImageCrop(
    obj: ImageObject,
    crop: ImageObject['crop']
): ImageObject {
    return { ...copyNested(obj), crop };
}
