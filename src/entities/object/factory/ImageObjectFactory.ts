import type {
    BaseObject,
    ImageCrop,
    ImageFilters,
    ImageMask,
    ImageObject,
} from '../types/ObjectTypes.ts';
import { createBaseObject } from './BaseObjectFactory.ts';
import { applyPatch } from './helpers.ts';
import { DEFAULT_FILTERS, DEFAULT_CROP } from './defaults.ts';

type CreateImageObjectParams = Partial<BaseObject> & {
    x: number;
    y: number;
    width: number;
    height: number;
    src: string;
    preserveAspect?: boolean;
    fit?: 'contain' | 'cover' | 'fill' | 'tile';
    crop?: Partial<ImageCrop>;
    filters?: Partial<ImageFilters>;
    mask?: ImageMask;
    rotationOrigin?: ImageObject['rotationOrigin'];
};

export function createImageObject(
    params: CreateImageObjectParams
): ImageObject {
    const base = createBaseObject(params);

    const original: ImageObject = {
        ...base,
        type: 'image',
        src: params.src,
        preserveAspect: params.preserveAspect ?? true,
        fit: params.fit ?? 'contain',
        crop: params.crop ? { ...DEFAULT_CROP, ...params.crop } : undefined,
        filters: params.filters
            ? { ...DEFAULT_FILTERS, ...params.filters }
            : undefined,
        mask: params.mask ? { ...params.mask } : undefined,
        rotationOrigin: params.rotationOrigin ?? 'center',
    };

    // If nested partials were provided in params (style/transform),
    // apply them via applyPatch so merging semantics are consistent
    // with the rest of the codebase (merge with defaults/original).
    if (params.style !== undefined || params.transform !== undefined) {
        const patched = applyPatch(original, {
            style: params.style,
            transform: params.transform,
        } as Partial<ImageObject>);
        return patched as ImageObject;
    }

    return original;
}

export function createMinimalImage(overrides?: Partial<ImageObject>) {
    return applyPatch(
        createImageObject({
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            src: '',
        }),
        overrides ?? {}
    );
}

export function createMaximalImage(overrides?: Partial<ImageObject>) {
    const maximalFilters: ImageFilters = {
        brightness: 1.2,
        contrast: 1.5,
        blur: 2,
        saturation: 1.3,
        grayscale: 0.5,
    };

    const image = createImageObject({
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
        filters: maximalFilters,
    });

    return overrides ? applyPatch(image, overrides) : image;
}
