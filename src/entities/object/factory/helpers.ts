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

// --- Tiny generic helpers ---------------------------------------------------
function hasOwnProp<T extends object, K extends PropertyKey>(
    obj: T,
    prop: K
): obj is T & Record<K, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function shallowClone<T extends object | undefined>(v: T): T | undefined {
    return v ? ({ ...v } as T) : undefined;
}

function mergeWithDefaults<T>(defaults: T, partial?: Partial<T>): T {
    return { ...defaults, ...(partial ?? {}) } as T;
}

function mergeWithDefaultsOptional<T>(
    defaults: T,
    partial?: Partial<T>
): T | undefined {
    if (partial === undefined) return undefined;
    return mergeWithDefaults(defaults, partial);
}

function assignIfHasOwn<T, K extends keyof T>(
    target: T,
    source: Partial<T>,
    key: K
): void {
    if (hasOwnProp(source as object, key as unknown as PropertyKey)) {
        // safe typed assignment via indexed access
        (target as T)[key] = source[key] as T[typeof key];
    }
}

/*
 Unified nested-merge semantics used by tests:

 - patch === undefined -> explicit removal (return undefined)
 - patch provided -> ignore any original nested object and return { ...defaults, ...patch }
   (this ensures unspecified fields in the patch fall back to defaults,
    not to values from any original object)
*/
function mergeNestedWithPatch<T extends object>(
    patch: Partial<T> | undefined,
    defaults: T
): T | undefined {
    // patch === undefined -> explicit removal
    if (patch === undefined) return undefined;

    // Build from defaults and apply patch only (ignore original)
    return { ...defaults, ...(patch as Partial<T>) } as T;
}

// --- Style helpers ---------------------------------------------------------
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

// --- Transform helpers -----------------------------------------------------
export function cloneTransform(
    transform?: ObjectTransform
): ObjectTransform | undefined {
    return shallowClone(transform);
}

export function mergeTransformWithDefaults(
    transform?: Partial<ObjectTransform>
): ObjectTransform {
    return mergeWithDefaults(DEFAULT_TRANSFORM, transform);
}

// --- Image filters helpers -------------------------------------------------
export function cloneFilters(filters?: ImageFilters): ImageFilters | undefined {
    return shallowClone(filters);
}

export function mergeFiltersWithDefaults(
    filters?: Partial<ImageFilters>
): ImageFilters | undefined {
    return mergeWithDefaultsOptional(DEFAULT_FILTERS, filters);
}

/*
 Expected semantics:
 - patch === undefined -> explicit removal (return undefined)
 - original === undefined & patch provided -> return shallow copy of patch (do NOT apply DEFAULT_FILTERS)
 - otherwise merge patch into original preserving other original fields
*/
export function mergePartialFiltersSafe(
    original?: ImageFilters,
    patch?: Partial<ImageFilters> | undefined
): ImageFilters | undefined {
    if (patch === undefined) return undefined;
    if (original === undefined)
        return { ...(patch as ImageFilters) } as ImageFilters;
    return { ...original, ...patch } as ImageFilters;
}

// --- Crop helpers ----------------------------------------------------------
export function cloneCrop(crop?: ImageCrop): ImageCrop | undefined {
    return shallowClone(crop);
}

export function mergeCropWithDefaults(
    crop?: Partial<ImageCrop>
): ImageCrop | undefined {
    return mergeWithDefaultsOptional(DEFAULT_CROP, crop);
}

// --- Mask helpers ----------------------------------------------------------
export function cloneMask(mask?: ImageMask): ImageMask | undefined {
    if (!mask) return undefined;
    return {
        ...mask,
        points: mask.points ? mask.points.map((p) => ({ ...p })) : undefined,
    };
}

// --- Deep clone base preserving concrete type ------------------------------
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

// --- applyPatch helpers ----------------------------------------------------
export function applyPatchBase(
    original: BaseObject,
    patch: Partial<BaseObject>
): BaseObject {
    const result: BaseObject = { ...original };

    // style (special nested merge semantics)
    if (hasOwnProp(patch, 'style')) {
        result.style = mergeNestedWithPatch(patch.style, DEFAULT_STYLE);
    } else if (original.style) {
        result.style = cloneStyle(original.style);
    }

    // transform
    if (hasOwnProp(patch, 'transform')) {
        result.transform = mergeNestedWithPatch(
            patch.transform,
            DEFAULT_TRANSFORM
        );
    } else if (original.transform) {
        result.transform = cloneTransform(original.transform);
    }

    // scalar fields
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
    scalarFields.forEach((field) => assignIfHasOwn(result, patch, field));

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
    const baseResult = applyPatchBase(original, patch as Partial<BaseObject>);

    if ('type' in original && original.type === 'image') {
        const orig = original as ImageObject;
        const p = patch as Partial<ImageObject>;
        const result: ImageObject = { ...(baseResult as ImageObject) };

        const imageFields: (keyof ImageObject)[] = [
            'src',
            'preserveAspect',
            'fit',
            'rotationOrigin',
        ];
        imageFields.forEach((f) => assignIfHasOwn(result, p, f));

        if (hasOwnProp(p, 'crop')) {
            result.crop = mergeNestedWithPatch(p.crop, DEFAULT_CROP);
        } else if (orig.crop) {
            result.crop = cloneCrop(orig.crop);
        }

        if (hasOwnProp(p, 'filters')) {
            // preserve original filters when present; if patch is undefined -> explicit removal
            result.filters = mergePartialFiltersSafe(orig.filters, p.filters);
        } else if (orig.filters) {
            result.filters = cloneFilters(orig.filters);
        }

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
        textFields.forEach((f) => assignIfHasOwn(result, p, f));

        return result;
    }

    return baseResult;
}
