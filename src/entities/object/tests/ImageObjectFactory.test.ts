import { describe, it, expect, vi } from 'vitest';
import type { ObjectStyle, ObjectTransform } from '../types/ObjectTypes.ts';

// Mock nanoid before importing factories so ids are deterministic
vi.mock('nanoid', () => ({ nanoid: () => 'fixed-nanoid' }));

import {
    createImageObject,
    createMinimalImage,
    createMaximalImage,
} from '../factory/ImageObjectFactory.ts';
import {
    DEFAULT_STYLE,
    DEFAULT_TRANSFORM,
    DEFAULT_FILTERS,
    DEFAULT_CROP,
} from '../factory/defaults.ts';

describe('ImageObjectFactory', () => {
    const baseArgs = { x: 5, y: 6, width: 120, height: 80, src: 'img.png' };

    it('generates id when none provided and applies defaults', () => {
        const img = createImageObject(baseArgs);
        expect(img.id).toBe('fixed-nanoid');
        expect(img.x).toBe(5);
        expect(img.y).toBe(6);
        expect(img.width).toBe(120);
        expect(img.height).toBe(80);
        // defaults from factory/original image object
        expect(img.preserveAspect).toBeDefined();
        expect(img.fit).toBeDefined();
        // base defaults applied
        expect(img.zIndex).toBeDefined();
        expect(img.locked).toBeDefined();
        expect(img.visible).toBeDefined();
    });

    it('preserves provided id', () => {
        const img = createImageObject({ ...baseArgs, id: 'custom-id' });
        expect(img.id).toBe('custom-id');
    });

    it('merges provided partial style with DEFAULT_STYLE (including nested shadow)', () => {
        const inputStyle: Partial<ObjectStyle> = {
            borderRadius: 7,
            shadow: { offsetX: 4 } as Partial<ObjectStyle['shadow']>,
        };

        const img = createImageObject({ ...baseArgs, style: inputStyle });

        // provided value respected
        expect(img.style?.borderRadius).toBe(7);

        // missing style fields filled from DEFAULT_STYLE
        expect(img.style?.backgroundColor).toBe(DEFAULT_STYLE.backgroundColor);
        expect(img.style?.borderWidth).toBe(DEFAULT_STYLE.borderWidth);

        // shadow merged: offsetX present; other shadow props come from DEFAULT_STYLE.shadow or undefined
        expect(img.style?.shadow).toMatchObject({ offsetX: 4 });
    });

    it('merges provided partial transform with DEFAULT_TRANSFORM', () => {
        const inputTransform: Partial<ObjectTransform> = { rotate: 33 };

        const img = createImageObject({
            ...baseArgs,
            transform: inputTransform,
        });

        expect(img.transform?.rotate).toBe(33);
        // other transform defaults preserved
        expect(img.transform?.scaleX).toBe(DEFAULT_TRANSFORM.scaleX);
        expect(img.transform?.opacity).toBe(DEFAULT_TRANSFORM.opacity);
    });

    it('createMaximalImage merges provided filters into maximal filters', () => {
        const overridden = createMaximalImage({ filters: { brightness: 0.6 } });
        // maximal filters from factory: contrast should remain the maximal value (1.5)
        expect(overridden.filters?.brightness).toBe(0.6);
        expect(overridden.filters?.contrast).toBe(1.5);
    });

    it('returned nested objects are not aliases of inputs or DEFAULT constants (immutability)', () => {
        const providedStyle: Partial<ObjectStyle> = { borderRadius: 2 };
        const providedCrop = { x: 1, y: 2, width: 10, height: 20 };
        const providedFilters = { brightness: 0.9 };
        const providedMask = { shape: 'rounded' as const, radius: 5 };

        const img = createImageObject({
            x: 0,
            y: 0,
            width: 200,
            height: 120,
            src: 'a.png',
            style: providedStyle,
            crop: providedCrop,
            filters: providedFilters,
            mask: providedMask,
        });

        // returned nested objects are new references
        expect(img.style).not.toBe(providedStyle);
        expect(img.crop).not.toBe(providedCrop);
        expect(img.filters).not.toBe(providedFilters);
        expect(img.mask).not.toBe(providedMask);

        // not the same refs as DEFAULT constants
        expect(img.style).not.toBe(DEFAULT_STYLE);
        expect(img.transform).not.toBe(DEFAULT_TRANSFORM);
        if (img.filters) expect(img.filters).not.toBe(DEFAULT_FILTERS);
        if (img.crop) expect(img.crop).not.toBe(DEFAULT_CROP);

        // modifying returned nested objects does not affect the provided inputs
        if (img.style) img.style.borderRadius = 99;
        expect(providedStyle.borderRadius).toBe(2);
    });

    it('createImageObject respects explicit overrides for locked, visible, zIndex', () => {
        const img = createImageObject({
            x: 1,
            y: 2,
            width: 10,
            height: 12,
            src: 'x.png',
            locked: true,
            visible: false,
            zIndex: 999,
        });
        expect(img.locked).toBe(true);
        expect(img.visible).toBe(false);
        expect(img.zIndex).toBe(999);
    });

    it('createMinimalImage applies minimal defaults and merges overrides', () => {
        const created = createMinimalImage({
            src: 'min.png',
            style: { borderRadius: 3 },
        });
        expect(created.src).toBe('min.png');
        expect(created.style?.borderRadius).toBe(3);
        expect(created.style?.backgroundColor).toBe(
            DEFAULT_STYLE.backgroundColor
        );
    });

    // typescript
    it('applyPatch adds filters when original absent: merges into DEFAULT_FILTERS', () => {
        const created = createMinimalImage({
            filters: { brightness: 1.2 },
        });
        expect(created.filters).toEqual({
            ...DEFAULT_FILTERS,
            brightness: 1.2,
        });
    });

    it('applyPatch explicit filters: undefined -> removes filters', () => {
        const removed = createMaximalImage({ filters: undefined });
        expect(removed.filters).toBeUndefined();
    });

    it('applyPatch explicit crop: undefined -> removes crop; adding crop when absent merges with DEFAULT_CROP', () => {
        const removedCrop = createMaximalImage({ crop: undefined });
        expect(removedCrop.crop).toBeUndefined();

        const addedCrop = createMinimalImage({ crop: { x: 10 } });
        expect(addedCrop.crop).toEqual({ ...DEFAULT_CROP, x: 10 });
    });

    it('mask override via overrides is cloned; mask: undefined removes mask', () => {
        const providedMask = {
            shape: 'polygon' as const,
            points: [{ x: 1, y: 2 }],
        };
        const overridden = createMaximalImage({ mask: providedMask });
        expect(overridden.mask).toEqual(providedMask);
        // clone: returned object must not be the same reference as input
        expect(overridden.mask).not.toBe(providedMask);
        // removal
        const removedMask = createMaximalImage({ mask: undefined });
        expect(removedMask.mask).toBeUndefined();
    });

    it('explicit undefined style is treated as removal when patch applied (transform provided to force patch)', () => {
        const img = createImageObject({
            ...baseArgs,
            style: undefined,
            transform: {},
        });
        expect(img.style).toBeUndefined();
    });

    it('explicit undefined transform is treated as removal when patch applied (style provided to force patch)', () => {
        const img = createImageObject({
            ...baseArgs,
            transform: undefined,
            style: {},
        });
        expect(img.transform).toBeUndefined();
    });
});
