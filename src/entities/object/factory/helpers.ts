import type {
    BaseObject,
    SlideObject,
    ImageObject,
    ObjectTransform,
    ObjectStyle,
    TextObject,
    ObjectShadow,
    ImageCrop,
    ImageFilters,
    ImageMask,
} from '../types/ObjectTypes.ts';
import {
    DEFAULT_STYLE,
    DEFAULT_TRANSFORM,
    DEFAULT_FILTERS,
    DEFAULT_CROP,
} from './defaults.ts';

// Generic helpers
function mergeWithDefaults<T>(defaults: T, partial?: Partial<T>): T {
    return { ...defaults, ...(partial ?? {}) };
}

function mergeWithDefaultsOptional<T>(
    defaults: T,
    partial?: Partial<T>
): T | undefined {
    if (partial === undefined) return undefined;
    return { ...defaults, ...partial };
}

// ----- Style -----
export function cloneStyle(style?: ObjectStyle): ObjectStyle | undefined {
    if (!style) return undefined;
    return {
        ...style,
        shadow: style.shadow ? { ...style.shadow } : undefined,
    };
}

export function mergeStyleWithDefaults(
    style?: Partial<ObjectStyle>
): ObjectStyle {
    const shadow =
        style?.shadow !== undefined
            ? mergeWithDefaults(
                  DEFAULT_STYLE.shadow ?? ({} as ObjectShadow),
                  style.shadow
              )
            : DEFAULT_STYLE.shadow;

    return {
        ...DEFAULT_STYLE,
        ...(style ?? {}),
        shadow,
    };
}

// ----- Transform -----
export function cloneTransform(
    transform?: ObjectTransform
): ObjectTransform | undefined {
    if (!transform) return undefined;
    return { ...transform };
}

export function mergeTransformWithDefaults(
    transform?: Partial<ObjectTransform>
): ObjectTransform {
    return mergeWithDefaults(DEFAULT_TRANSFORM, transform);
}

// ----- Image filters -----
export function cloneFilters(filters?: ImageFilters): ImageFilters | undefined {
    if (!filters) return undefined;
    return { ...filters };
}

export function mergeFiltersWithDefaults(
    filters?: Partial<ImageFilters>
): ImageFilters | undefined {
    return mergeWithDefaultsOptional(DEFAULT_FILTERS, filters);
}

// ----- Crop -----
export function cloneCrop(crop?: ImageCrop): ImageCrop | undefined {
    if (!crop) return undefined;
    return { ...crop };
}

export function mergeCropWithDefaults(
    crop?: Partial<ImageCrop>
): ImageCrop | undefined {
    return mergeWithDefaultsOptional(DEFAULT_CROP, crop);
}

// ----- Mask -----
export function cloneMask(mask?: ImageMask): ImageMask | undefined {
    if (!mask) return undefined;
    return {
        ...mask,
        points: mask.points ? mask.points.map((p) => ({ ...p })) : undefined,
    };
}

// ----- Deep clone base (preserve concrete type) -----
export function deepCloneNestedBase<T extends BaseObject>(base: T): T {
    const baseClone = {
        ...base,
        style: cloneStyle(base.style),
        transform: cloneTransform(base.transform),
    } as T;

    const maybeSlide = base as unknown as SlideObject;
    if (maybeSlide.type === 'image') {
        const img = base as unknown as ImageObject;
        return {
            ...baseClone,
            crop: cloneCrop(img.crop),
            filters: cloneFilters(img.filters),
            mask: cloneMask(img.mask),
        } as unknown as T;
    }

    return baseClone;
}

function hasOwnProp<T extends object, K extends PropertyKey>(
    obj: T,
    prop: K
): obj is T & Record<K, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function assignIfHasOwn<T, K extends keyof T>(
    target: T,
    source: Partial<T>,
    key: K
): void {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
        (target as unknown as Record<K, T[K]>)[key] = (
            source as Record<K, T[K]>
        )[key];
    }
}

// Unified merge function for nested objects when patch explicitly provided
function mergeNestedWithPatch<T>(
    original: T | undefined,
    patch: Partial<T> | undefined,
    defaults: T
): T | undefined {
    // patch === undefined => explicit removal
    if (patch === undefined) return undefined;

    if (original === undefined) {
        return { ...defaults, ...(patch as Partial<T>) } as T;
    }

    return {
        ...defaults,
        ...(original as Partial<T>),
        ...(patch as Partial<T>),
    } as T;
}

export function applyPatchBase(
    original: BaseObject,
    patch: Partial<BaseObject>
): BaseObject {
    const result: BaseObject = { ...original };

    // Handle style
    if (hasOwnProp(patch, 'style')) {
        result.style = mergeNestedWithPatch(
            original.style,
            patch.style,
            DEFAULT_STYLE
        );
    } else if (original.style) {
        result.style = cloneStyle(original.style);
    }

    // Handle transform
    if (hasOwnProp(patch, 'transform')) {
        result.transform = mergeNestedWithPatch(
            original.transform,
            patch.transform,
            DEFAULT_TRANSFORM
        );
    } else if (original.transform) {
        result.transform = cloneTransform(original.transform);
    }

    // Handle scalar fields
    const scalarFields: (keyof BaseObject)[] = [
        'id',
        'x',
        'y',
        'zIndex',
        'width',
        'height',
        'locked',
        'visible',
    ];
    scalarFields.forEach((field) => {
        assignIfHasOwn(result, patch, field);
    });

    return result;
}

export function applyPatch(
    original: ImageObject,
    patch: Partial<ImageObject>
): ImageObject;
export function applyPatch(
    original: TextObject,
    patch: Partial<TextObject>
): TextObject;
export function applyPatch(
    original: BaseObject,
    patch: Partial<BaseObject>
): BaseObject;

export function applyPatch(
    original: BaseObject | TextObject | ImageObject,
    patch: Partial<BaseObject> | Partial<TextObject> | Partial<ImageObject>
): BaseObject | TextObject | ImageObject {
    // Start with applyPatchBase for common fields
    const baseResult = applyPatchBase(original, patch as Partial<BaseObject>);

    if ('type' in original && original.type === 'image') {
        const orig = original as ImageObject;
        const p = patch as Partial<ImageObject>;
        const result: ImageObject = { ...(baseResult as ImageObject) };

        // Handle image-specific scalar fields
        const imageFields: (keyof ImageObject)[] = [
            'src',
            'preserveAspect',
            'fit',
            'rotationOrigin',
        ];
        imageFields.forEach((field) => assignIfHasOwn(result, p, field));

        // Handle crop
        if (hasOwnProp(p, 'crop')) {
            result.crop = mergeNestedWithPatch(orig.crop, p.crop, DEFAULT_CROP);
        } else if (orig.crop) {
            result.crop = cloneCrop(orig.crop);
        }

        // Handle filters
        if (hasOwnProp(p, 'filters')) {
            result.filters = mergeNestedWithPatch(
                orig.filters,
                p.filters,
                DEFAULT_FILTERS
            );
        } else if (orig.filters) {
            result.filters = cloneFilters(orig.filters);
        }

        // Handle mask
        if (hasOwnProp(p, 'mask')) {
            result.mask = p.mask === undefined ? undefined : cloneMask(p.mask);
        } else if (orig.mask) {
            result.mask = cloneMask(orig.mask);
        }

        return result;
    }

    if ('type' in original && original.type === 'text') {
        const p = patch as Partial<TextObject>;
        const result: TextObject = { ...(baseResult as TextObject) };

        // Handle text-specific fields
        const textFields: (keyof TextObject)[] = [
            'content',
            'fontFamily',
            'fontSize',
            'color',
            'fontWeight',
            'fontStyle',
            'textAlign',
            'lineHeight',
            'letterSpacing',
        ];
        textFields.forEach((field) => assignIfHasOwn(result, p, field));

        return result;
    }

    return baseResult;
}
