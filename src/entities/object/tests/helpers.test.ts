import { describe, it, expect } from 'vitest';
import type {
    BaseObject,
    ImageObject,
    TextObject,
} from '../types/ObjectTypes.ts';

import {
    DEFAULT_CROP,
    DEFAULT_FILTERS,
    DEFAULT_STYLE,
    DEFAULT_TRANSFORM,
} from '../factory/defaults.ts';
import {
    applyPatch,
    applyPatchBase,
    cloneCrop,
    cloneFilters,
    cloneMask,
    cloneStyle,
    cloneTransform,
    deepCloneNestedBase,
    mergeCropWithDefaults,
    mergeFiltersWithDefaults,
    mergePartialFiltersSafe,
    mergeStyleWithDefaults,
    mergeTransformWithDefaults,
} from '../factory/helpers.ts';

describe('defaults exports', () => {
    it('DEFAULT_STYLE, DEFAULT_TRANSFORM, DEFAULT_FILTERS, DEFAULT_CROP exist', () => {
        expect(DEFAULT_STYLE).toHaveProperty('backgroundColor');
        expect(DEFAULT_TRANSFORM).toHaveProperty('opacity');
        expect(DEFAULT_FILTERS).toHaveProperty('brightness');
        expect(DEFAULT_CROP).toHaveProperty('width');
    });
});

describe('style helpers', () => {
    it('cloneStyle returns deep copy and does not share nested shadow reference', () => {
        const s = {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2,
            backgroundColor: 'red',
            shadow: { offsetX: 1, offsetY: 2, blur: 3, color: 'black' },
        };
        const c = cloneStyle(s);
        expect(c).toEqual(s);
        expect(c).not.toBe(s);
        if (c && c.shadow) {
            expect(c.shadow).not.toBe(s.shadow);
        }
    });

    it('mergeStyleWithDefaults fills missing fields from DEFAULT_STYLE', () => {
        const partial = { borderRadius: 10 } as Partial<typeof DEFAULT_STYLE>;
        const merged = mergeStyleWithDefaults(partial);
        expect(merged.borderRadius).toBe(10);
        expect(merged.backgroundColor).toBe(DEFAULT_STYLE.backgroundColor);
    });

    it('mergeStyleWithDefaults returns a clone of defaults when undefined', () => {
        const merged = mergeStyleWithDefaults(undefined);
        expect(merged).toEqual(DEFAULT_STYLE);
        expect(merged).not.toBe(DEFAULT_STYLE);
    });
});

describe('transform helpers', () => {
    it('cloneTransform copies object', () => {
        const t = { rotate: 10, scaleX: 2, scaleY: 2, opacity: 0.5 };
        const c = cloneTransform(t);
        expect(c).toEqual(t);
        expect(c).not.toBe(t);
    });

    it('mergeTransformWithDefaults applies defaults for missing fields', () => {
        const partial = { rotate: 45 } as Partial<typeof DEFAULT_TRANSFORM>;
        const merged = mergeTransformWithDefaults(partial);
        expect(merged.rotate).toBe(45);
        expect(merged.scaleX).toBe(DEFAULT_TRANSFORM.scaleX);
    });
});

describe('filters & crop helpers', () => {
    it('cloneFilters copies and does not alias', () => {
        const f = { brightness: 2, contrast: 1.5 };
        const c = cloneFilters(f);
        expect(c).toEqual(f);
        expect(c).not.toBe(f);
    });

    it('mergeFiltersWithDefaults returns undefined when filters undefined', () => {
        const m = mergeFiltersWithDefaults(undefined);
        expect(m).toBeUndefined();
    });

    it('mergeFiltersWithDefaults merges partial with DEFAULT_FILTERS', () => {
        const partial = { brightness: 2 } as Partial<typeof DEFAULT_FILTERS>;
        const merged = mergeFiltersWithDefaults(partial);
        expect(merged).toBeDefined();
        expect(merged?.brightness).toBe(2);
        expect(merged?.contrast).toBe(DEFAULT_FILTERS.contrast);
    });

    it('cloneCrop and mergeCropWithDefaults behave as expected', () => {
        const c = { x: 5, y: 5, width: 50, height: 50 };
        const cl = cloneCrop(c);
        expect(cl).toEqual(c);
        expect(cl).not.toBe(c);
        const merged = mergeCropWithDefaults({ x: 10 });
        expect(merged).toBeDefined();
        expect(merged?.x).toBe(10);
        expect(merged?.width).toBe(DEFAULT_CROP.width);
    });
});

describe('mask helper', () => {
    it('cloneMask deep clones points array and does not share references', () => {
        const m = {
            shape: 'polygon' as const,
            points: [
                { x: 1, y: 2 },
                { x: 3, y: 4 },
            ],
        };
        const cl = cloneMask(m);
        expect(cl).toEqual(m);
        expect(cl).not.toBe(m);
        expect(cl?.points).not.toBe(m.points);
        expect(cl?.points?.[0]).not.toBe(m.points?.[0]);
    });
});

describe('deep clone and applyPatch semantics', () => {
    const baseObject: BaseObject = {
        id: 'base1',
        x: 1,
        y: 2,
        zIndex: 0,
        width: 100,
        height: 100,
        locked: false,
        visible: true,
        style: {
            borderRadius: 0,
            borderColor: '#000',
            borderWidth: 2,
            backgroundColor: 'white',
        },
        transform: { rotate: 0, scaleX: 1.5, scaleY: 1, opacity: 1 },
    };

    const image: ImageObject = {
        ...baseObject,
        type: 'image',
        src: 'img.png',
        filters: { brightness: 1.5, contrast: 1.5 },
        crop: { x: 1, y: 2, width: 50, height: 50 },
    } as unknown as ImageObject;

    const text: TextObject = {
        ...baseObject,
        type: 'text',
        content: 'hello',
        fontFamily: 'Arial',
        fontSize: 12,
        color: '#000',
    } as unknown as TextObject;

    it('deepCloneNestedBase clones nested objects for image and text', () => {
        const dimg = deepCloneNestedBase(image);
        expect(dimg).not.toBe(image);
        expect(dimg.style).not.toBe(image.style);
        expect((dimg as ImageObject).filters).not.toBe(image.filters);

        const dtext = deepCloneNestedBase(text);
        expect(dtext).not.toBe(text);
        expect(dtext.style).not.toBe(text.style);
    });

    it('applyPatchBase: present-with-undefined removes nested style', () => {
        const patched = applyPatchBase(baseObject, {
            style: undefined,
        } as Partial<BaseObject>);
        expect(patched.style).toBeUndefined();
    });

    it('applyPatchBase: partial style merges preferring original then patch/defaults', () => {
        // Current helpers behavior: when original exists and patch is provided,
        // the merge includes original fields unless overridden by patch.
        const orig = { ...baseObject };
        const patched = applyPatchBase(orig, {
            style: { borderRadius: 10 },
        } as Partial<BaseObject>);
        expect(patched.style?.borderRadius).toBe(10);
        // other fields come from original.style (current behavior)
        expect(patched.style?.borderWidth).toBe(orig.style?.borderWidth);
    });

    it('applyPatch for image: partial filters merge preferring original then patch/defaults', () => {
        const orig = image;
        const p = { filters: { brightness: 2 } } as Partial<ImageObject>;
        const patched = applyPatch(orig, p) as ImageObject;
        expect(patched.filters?.brightness).toBe(2);
        // contrast comes from original.filters (current behavior)
        expect(patched.filters?.contrast).toBe(orig.filters?.contrast);
    });

    it('applyPatch for text: content and partial style behavior', () => {
        const patched = applyPatch(text, {
            content: 'bye',
            style: undefined,
        } as Partial<TextObject>) as TextObject;
        expect(patched.content).toBe('bye');
        expect(patched.style).toBeUndefined();
    });

    it('applyPatch respects id present-with-undefined (explicit overwrite)', () => {
        // Current helpers: scalar properties present in patch are assigned even if undefined,
        // so id will become undefined when patch contains id: undefined.
        const patched = applyPatchBase(baseObject, {
            id: undefined,
        } as Partial<BaseObject>);
        expect(patched.id).toBeUndefined();
    });

    it('applyPatch respects value presence for scalar fields', () => {
        const patched = applyPatchBase(baseObject, {
            x: 10,
            locked: true,
        } as Partial<BaseObject>);
        expect(patched.x).toBe(10);
        expect(patched.locked).toBe(true);
    });

    it('immutability: applying patch returns new object and does not mutate original nested objects', () => {
        const orig = image;
        const patched = applyPatch(orig, {
            filters: { brightness: 2 },
        } as Partial<ImageObject>);
        expect(patched).not.toBe(orig);
        expect(patched.filters).not.toBe(orig.filters);
    });
});

describe('additional helpers tests', () => {
    it('mergePartialFiltersSafe: original undefined -> merge into DEFAULT_FILTERS', () => {
        const patch = { brightness: 1.2, contrast: 0.9 };
        const merged = mergePartialFiltersSafe(undefined, patch);
        expect(merged).toEqual({
            brightness: 1.2,
            contrast: 0.9,
            saturation: DEFAULT_FILTERS.saturation,
            blur: DEFAULT_FILTERS.blur,
            grayscale: DEFAULT_FILTERS.grayscale,
        });
    });

    it('mergePartialFiltersSafe: patch undefined -> explicit removal (undefined)', () => {
        const original = { brightness: 2, contrast: 1.5 };
        const removed = mergePartialFiltersSafe(original, undefined);
        expect(removed).toBeUndefined();
    });

    it('mergeTransformWithDefaults: original absent + partial -> defaults merged with patch', () => {
        const partial = { rotate: 30 };
        const merged = mergeTransformWithDefaults(partial);
        expect(merged.rotate).toBe(30);
        expect(merged.scaleX).toBe(DEFAULT_TRANSFORM.scaleX);
        expect(merged.scaleY).toBe(DEFAULT_TRANSFORM.scaleY);
    });

    it('applyPatchBase clones style/transform when patch omits them', () => {
        const base: BaseObject = {
            id: 'b1',
            x: 1,
            y: 2,
            zIndex: 0,
            width: 10,
            height: 10,
            style: { ...DEFAULT_STYLE },
            transform: { ...DEFAULT_TRANSFORM },
        };
        const patched = applyPatchBase(base, { x: 5 } as Partial<BaseObject>);
        // equal but not same references
        expect(patched.style).toEqual(base.style);
        expect(patched.style).not.toBe(base.style);
        expect(patched.transform).toEqual(base.transform);
        expect(patched.transform).not.toBe(base.transform);
    });
    it('applyPatch: mask provided is cloned; mask: undefined removes mask', () => {
        const img: ImageObject = {
            id: 'i1',
            type: 'image',
            x: 0,
            y: 0,
            zIndex: 0,
            width: 100,
            height: 100,
            src: 'a.png',
            mask: {
                shape: 'polygon',
                points: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                ],
            },
        } as unknown as ImageObject;

        const patchMask = { shape: 'polygon', points: [{ x: 2, y: 2 }] };
        const patchedWithMask = applyPatch(img, {
            mask: patchMask,
        } as Partial<ImageObject>) as ImageObject;
        expect(patchedWithMask.mask).toEqual({
            shape: 'polygon',
            points: [{ x: 2, y: 2 }],
        });
        // patched mask points should not be the same reference as the patch's points
        expect(patchedWithMask.mask?.points).not.toBe(patchMask.points);

        const patchedRemoveMask = applyPatch(img, {
            mask: undefined,
        } as Partial<ImageObject>) as ImageObject;
        expect(patchedRemoveMask.mask).toBeUndefined();
    });

    it('cloneMask handles undefined points and does deep clone when points present', () => {
        const m1 = { shape: 'rounded' as const };
        const c1 = cloneMask(m1);
        expect(c1).toEqual(m1);

        const m2 = { shape: 'polygon' as const, points: [{ x: 1, y: 1 }] };
        const c2 = cloneMask(m2);
        expect(c2).toEqual(m2);
        expect(c2?.points).not.toBe(m2.points);
        expect(c2?.points?.[0]).not.toBe(m2.points?.[0]);
    });

    it('cloneFilters/cloneCrop produce new instances (not same reference) when present', () => {
        const f = { brightness: 1.1 };
        const cf = cloneFilters(f);
        expect(cf).toEqual(f);
        expect(cf).not.toBe(f);

        const c = { x: 1, y: 1, width: 10, height: 10 };
        const cc = cloneCrop(c);
        expect(cc).toEqual(c);
        expect(cc).not.toBe(c);
    });
});
