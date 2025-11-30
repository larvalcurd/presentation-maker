import type {
    BaseObject,
    SlideObject,
    ImageObject,
    ObjectTransform,
    ObjectStyle,
    TextObject,
} from '../types/ObjectTypes.ts';
import {
    DEFAULT_STYLE,
    DEFAULT_TRANSFORM,
    DEFAULT_FILTERS,
    DEFAULT_CROP,
} from './defaults.ts';

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
    const mergedShadow =
        style?.shadow !== undefined
            ? { ...(DEFAULT_STYLE.shadow ?? {}), ...style.shadow }
            : DEFAULT_STYLE.shadow
              ? { ...DEFAULT_STYLE.shadow }
              : undefined;

    return {
        ...DEFAULT_STYLE,
        ...(style ?? {}),
        shadow: mergedShadow,
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
    return { ...DEFAULT_TRANSFORM, ...(transform ?? {}) };
}

// ----- Image filters -----
export function cloneFilters(
    filters?: ImageObject['filters']
): ImageObject['filters'] | undefined {
    if (!filters) return undefined;
    return { ...filters };
}

export function mergeFiltersWithDefaults(
    filters?: Partial<ImageObject['filters']>
): typeof DEFAULT_FILTERS | undefined {
    if (!filters) return undefined;
    return { ...DEFAULT_FILTERS, ...filters };
}

// ----- Crop -----
export function cloneCrop(
    crop?: ImageObject['crop']
): ImageObject['crop'] | undefined {
    if (!crop) return undefined;
    return { ...crop };
}

export function mergeCropWithDefaults(
    crop?: Partial<ImageObject['crop']>
): typeof DEFAULT_CROP | undefined {
    if (!crop) return undefined;
    return { ...DEFAULT_CROP, ...crop };
}

// ----- Mask -----
export function cloneMask(
    mask?: ImageObject['mask']
): ImageObject['mask'] | undefined {
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

export function applyPatchBase(
    original: BaseObject,
    patch: Partial<BaseObject>
): BaseObject {
    const style = hasOwnProp(patch, 'style')
        ? patch.style
            ? mergeStyleWithDefaults(patch.style)
            : undefined
        : cloneStyle(original.style);

    const transform = hasOwnProp(patch, 'transform')
        ? patch.transform
            ? mergeTransformWithDefaults(patch.transform)
            : undefined
        : cloneTransform(original.transform);

    return {
        ...original,
        id: hasOwnProp(patch, 'id') ? (patch.id ?? original.id) : original.id,
        x: hasOwnProp(patch, 'x') ? (patch.x as number) : original.x,
        y: hasOwnProp(patch, 'y') ? (patch.y as number) : original.y,
        zIndex: hasOwnProp(patch, 'zIndex')
            ? (patch.zIndex as number)
            : original.zIndex,
        width: hasOwnProp(patch, 'width')
            ? (patch.width as number)
            : original.width,
        height: hasOwnProp(patch, 'height')
            ? (patch.height as number)
            : original.height,
        locked: hasOwnProp(patch, 'locked')
            ? (patch.locked as boolean)
            : original.locked,
        visible: hasOwnProp(patch, 'visible')
            ? (patch.visible as boolean)
            : original.visible,
        style,
        transform,
    };
}

// Overloads for type safety
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
    // Slide objects (image / text) can reuse base logic first
    if ('type' in original && original.type === 'image') {
        const orig = original as ImageObject;
        const p = patch as Partial<ImageObject>;

        const base = applyPatchBase(orig, p);

        const crop = hasOwnProp(p, 'crop')
            ? p.crop
                ? mergeCropWithDefaults(p.crop)
                : undefined
            : cloneCrop(orig.crop);

        const filters = hasOwnProp(p, 'filters')
            ? p.filters
                ? mergeFiltersWithDefaults(p.filters)
                : undefined
            : cloneFilters(orig.filters);

        const mask = hasOwnProp(p, 'mask')
            ? p.mask
                ? cloneMask(p.mask)
                : undefined
            : cloneMask(orig.mask);

        const src = hasOwnProp(p, 'src') ? (p.src as string) : orig.src;
        const preserveAspect = hasOwnProp(p, 'preserveAspect')
            ? p.preserveAspect
            : orig.preserveAspect;
        const fit = hasOwnProp(p, 'fit') ? p.fit : orig.fit;
        const rotationOrigin = hasOwnProp(p, 'rotationOrigin')
            ? p.rotationOrigin
            : orig.rotationOrigin;

        return {
            ...base,
            type: 'image',
            src,
            preserveAspect,
            fit,
            crop,
            filters,
            mask,
            rotationOrigin,
        } as ImageObject;
    }

    if ('type' in original && original.type === 'text') {
        const orig = original as TextObject;
        const p = patch as Partial<TextObject>;

        const base = applyPatchBase(orig, p);

        const content = hasOwnProp(p, 'content')
            ? (p.content as string)
            : orig.content;
        const fontFamily = hasOwnProp(p, 'fontFamily')
            ? p.fontFamily
            : orig.fontFamily;
        const fontSize = hasOwnProp(p, 'fontSize') ? p.fontSize : orig.fontSize;
        const color = hasOwnProp(p, 'color') ? p.color : orig.color;
        const fontWeight = hasOwnProp(p, 'fontWeight')
            ? p.fontWeight
            : orig.fontWeight;
        const fontStyle = hasOwnProp(p, 'fontStyle')
            ? p.fontStyle
            : orig.fontStyle;
        const textAlign = hasOwnProp(p, 'textAlign')
            ? p.textAlign
            : orig.textAlign;
        const lineHeight = hasOwnProp(p, 'lineHeight')
            ? p.lineHeight
            : orig.lineHeight;
        const letterSpacing = hasOwnProp(p, 'letterSpacing')
            ? p.letterSpacing
            : orig.letterSpacing;

        return {
            ...base,
            type: 'text',
            content,
            fontFamily,
            fontSize,
            color,
            fontWeight,
            fontStyle,
            textAlign,
            lineHeight,
            letterSpacing,
        } as TextObject;
    }

    return applyPatchBase(original, patch as Partial<BaseObject>);
}
