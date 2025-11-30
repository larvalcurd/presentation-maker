// typescript
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
        const orig = {
            borderRadius: 5,
            backgroundColor: '#fff',
            shadow: { offsetX: 1, offsetY: 2, blur: 3, color: '#000' },
        };
        const c = cloneStyle(orig);
        expect(c).toEqual(orig);
        expect(c).not.toBe(orig);
        if (c && c.shadow) {
            expect(c.shadow).not.toBe(orig.shadow);
            c.shadow.offsetX = 99;
            // original unchanged
            expect(orig.shadow.offsetX).toBe(1);
        }
    });

    it('mergeStyleWithDefaults fills missing fields from DEFAULT_STYLE', () => {
        const partial: Parameters<typeof mergeStyleWithDefaults>[0] = {
            borderRadius: 10,
            shadow: {
                offsetX: 2,
                offsetY: 0,
                blur: 0,
                color: '',
            },
        };
        const merged = mergeStyleWithDefaults(partial);
        expect(merged.borderRadius).toBe(10);
        expect(merged.backgroundColor).toBeDefined();
        // shadow should equal provided values merged over default shadow (defaults have undefined shadow -> use provided)
        expect(merged.shadow).toMatchObject({ offsetX: 2 });
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
        const partial = { rotate: 45 };
        const merged = mergeTransformWithDefaults(partial);
        expect(merged.rotate).toBe(45);
        expect(merged.scaleX).toBeDefined();
        expect(merged.opacity).toBeDefined();
    });
});

describe('filters & crop helpers', () => {
    it('cloneFilters copies and does not alias', () => {
        const f = { brightness: 2, contrast: 1.2 };
        const c = cloneFilters(f);
        expect(c).toEqual(f);
        expect(c).not.toBe(f);
    });

    it('mergeFiltersWithDefaults returns undefined when filters undefined', () => {
        expect(mergeFiltersWithDefaults(undefined)).toBeUndefined();
    });

    it('mergeFiltersWithDefaults merges partial with DEFAULT_FILTERS', () => {
        const partial = { brightness: 2 };
        const merged = mergeFiltersWithDefaults(partial)!;
        expect(merged.brightness).toBe(2);
        expect(merged.contrast).toBe(DEFAULT_FILTERS.contrast);
    });

    it('cloneCrop and mergeCropWithDefaults behave as expected', () => {
        const c = { x: 1, y: 2, width: 10, height: 20 };
        const cc = cloneCrop(c);
        expect(cc).toEqual(c);
        expect(cc).not.toBe(c);

        expect(mergeCropWithDefaults(undefined)).toBeUndefined();
        const partial = { x: 5 };
        const merged = mergeCropWithDefaults(partial)!;
        expect(merged.x).toBe(5);
        expect(merged.width).toBe(DEFAULT_CROP.width);
    });
});

describe('mask helper', () => {
    it('cloneMask deep clones points array and does not share references', () => {
        const mask = {
            shape: 'polygon' as const,
            points: [
                { x: 1, y: 1 },
                { x: 2, y: 3 },
            ],
        };
        const cloned = cloneMask(mask)!;
        expect(cloned).toEqual(mask);
        expect(cloned).not.toBe(mask);
        expect(cloned.points).not.toBe(mask.points);
        cloned.points![0].x = 99;
        expect(mask.points![0].x).toBe(1);
    });
});

describe('deep clone and applyPatch semantics', () => {
    const baseObject: BaseObject = {
        id: 'base1',
        x: 0,
        y: 0,
        zIndex: 0,
        width: 100,
        height: 100,
        locked: false,
        visible: true,
        style: { borderRadius: 3, backgroundColor: '#fafafa', borderWidth: 2 },
        transform: { rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 },
    };

    const image: ImageObject = {
        ...baseObject,
        type: 'image',
        src: 'img.png',
        preserveAspect: true,
        fit: 'contain',
        crop: { x: 0, y: 0, width: 50, height: 50 },
        filters: { brightness: 1.2, contrast: 1.5 },
        mask: { shape: 'polygon', points: [{ x: 1, y: 2 }] },
        rotationOrigin: 'center',
    };

    const text: TextObject = {
        ...baseObject,
        type: 'text',
        content: 'hello',
        fontFamily: 'Arial',
        fontSize: 12,
        color: '#000',
    };

    it('deepCloneNestedBase clones nested objects for image and text', () => {
        const clonedImage = deepCloneNestedBase(image);
        expect(clonedImage).toEqual(image);
        // nested must be new references
        expect(clonedImage.style).not.toBe(image.style);
        expect(clonedImage.transform).not.toBe(image.transform);
        expect((clonedImage as ImageObject).crop).not.toBe(image.crop);
        expect((clonedImage as ImageObject).filters).not.toBe(image.filters);

        const clonedText = deepCloneNestedBase(text);
        expect(clonedText).toEqual(text);
        expect(clonedText.style).not.toBe(text.style);
        expect(clonedText.transform).not.toBe(text.transform);
    });

    it('applyPatchBase: present-with-undefined removes nested style', () => {
        const patched = applyPatchBase(image, { style: undefined });
        expect(patched.style).toBeUndefined();
    });

    it('applyPatchBase: partial style merges with DEFAULT_STYLE (not original)', () => {
        const patched = applyPatchBase(image, { style: { borderRadius: 10 } });
        // borderRadius should be overridden
        expect(patched.style?.borderRadius).toBe(10);
        // and other fields come from DEFAULT_STYLE (not original.style)
        expect(patched.style?.borderWidth).toBe(DEFAULT_STYLE.borderWidth);
    });

    it('applyPatch for image: partial filters merge with DEFAULT_FILTERS', () => {
        // original has filters with contrast 1.5
        const patched = applyPatch(image, {
            filters: { brightness: 2 },
        }) as ImageObject;
        expect(patched.filters?.brightness).toBe(2);
        // contrast should come from DEFAULT_FILTERS (not original.filters) per helpers logic
        expect(patched.filters?.contrast).toBe(DEFAULT_FILTERS.contrast);
    });

    it('applyPatch for text: content and partial style behavior', () => {
        const patched = applyPatch(text, {
            content: 'Updated',
            style: { borderRadius: 10 },
        }) as TextObject;
        expect(patched.content).toBe('Updated');
        // style merged with defaults
        expect(patched.style?.borderRadius).toBe(10);
        expect(patched.style?.borderColor).toBe(DEFAULT_STYLE.borderColor);
    });

    it('applyPatch respects id present-with-undefined (keeps original id)', () => {
        const patched = applyPatchBase(baseObject, { id: undefined });
        expect(patched.id).toBe(baseObject.id);
    });

    it('applyPatch respects value presence for scalar fields', () => {
        const patched = applyPatchBase(baseObject, { x: 42 });
        expect(patched.x).toBe(42);
        // absent fields preserved
        expect(patched.y).toBe(baseObject.y);
    });

    it('immutability: applying patch returns new object and does not mutate original nested objects', () => {
        const orig = JSON.parse(JSON.stringify(image)) as ImageObject;
        const patched = applyPatch(orig, {
            src: 'new.png',
            style: { borderRadius: 7 },
        }) as ImageObject;
        expect(patched).not.toBe(orig);
        expect(patched.style).not.toBe(orig.style);
        // original unchanged
        expect(orig.src).toBe('img.png');
        expect(orig.style?.borderRadius).toBe(3);
    });
});
