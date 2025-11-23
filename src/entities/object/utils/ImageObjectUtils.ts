import type { ImageObject } from '../types/ObjectTypes.ts';

function copyTransform(transform: ImageObject['transform']) {
    if (!transform) return transform;
    return { ...transform };
}

function copyFilters(filters: ImageObject['filters']) {
    if (!filters) return filters;
    return { ...filters };
}

function copyCrop(crop: ImageObject['crop']) {
    if (!crop) return crop;
    return { ...crop };
}

function copyNested(object: ImageObject): ImageObject {
    return {
        ...object,
        transform: copyTransform(object.transform),
        filters: copyFilters(object.filters),
        crop: copyCrop(object.crop),
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
