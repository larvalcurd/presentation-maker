import { describe, it, expect } from 'vitest';
import {
    createMinimalText,
    createMaximalText,
} from '../factory/TextObjectFactory.ts';
import {
    createMinimalImage,
    createMaximalImage,
} from '../factory/ImageObjectFactory.ts';
import { moveObject, resizeObject } from '../utils/ObjectUtils.ts';

describe('ObjectUtils (use factory minimal/maximal helpers)', () => {
    it('moveObject with minimal TextObject: returns new object and does not mutate original', () => {
        const original = createMinimalText({ id: 'min-text-1' });
        const moved = moveObject(original, 10, 20);

        expect(moved.x).toBe(10);
        expect(moved.y).toBe(20);

        // original unchanged
        expect(original.x).not.toBe(10);
        expect(original.y).not.toBe(20);

        // different reference
        expect(moved).not.toBe(original);
    });

    it('resizeObject with minimal ImageObject: returns new object and does not mutate original', () => {
        const original = createMinimalImage({ id: 'min-img-1', src: 'a.png' });
        const resized = resizeObject(original, 300, 400);

        expect(resized.width).toBe(300);
        expect(resized.height).toBe(400);

        // original unchanged
        expect(original.width).not.toBe(300);
        expect(original.height).not.toBe(400);

        expect(resized).not.toBe(original);
    });

    it('moveObject with maximal TextObject: updates coords, does not mutate original (immutability)', () => {
        // clone factory output to ensure test owns the input object
        const original = JSON.parse(
            JSON.stringify(createMaximalText({ id: 'text-max-1' }))
        );
        const moved = moveObject(original, 1000, 2000);

        expect(moved.x).toBe(1000);
        expect(moved.y).toBe(2000);

        // original unchanged
        expect(original.x).toBeDefined();
        expect(original.y).toBeDefined();
        expect(original.x).not.toBe(1000);
        expect(original.y).not.toBe(2000);

        expect(moved).not.toBe(original);

        // ensure nested data on the original was not mutated
        if (original.style) {
            expect(original.style.borderRadius).toBeDefined();
        }
    });

    it('resizeObject with maximal ImageObject: updates size, does not mutate original (immutability)', () => {
        const original = JSON.parse(
            JSON.stringify(createMaximalImage({ id: 'img-max-1' }))
        );
        const resized = resizeObject(original, 800, 600);

        expect(resized.width).toBe(800);
        expect(resized.height).toBe(600);

        // original unchanged
        expect(original.width).not.toBe(800);
        expect(original.height).not.toBe(600);

        expect(resized).not.toBe(original);

        // ensure image-specific nested fields on original remain intact
        if (original.filters) {
            expect(original.filters.brightness).toBeDefined();
        }
        if (original.mask?.points) {
            expect(original.mask.points.length).toBeGreaterThanOrEqual(0);
        }
    });
});

describe('ObjectUtils - additional shallow-copy / nested-ref checks', () => {
    it('moveObject preserves nested object references (shallow copy) for TextObject', () => {
        const original = createMaximalText({ id: 'text-ref-1' });
        const moved = moveObject(original, 123, 456);

        // top-level object is new
        expect(moved).not.toBe(original);

        // nested objects should be the same references (shallow copy semantics)
        expect(moved.style).toBe(original.style);
        expect(moved.transform).toBe(original.transform);

        // scalar fields updated correctly and original unchanged
        expect(moved.x).toBe(123);
        expect(moved.y).toBe(456);
        expect(original.x).not.toBe(123);
        expect(original.y).not.toBe(456);
    });

    it('resizeObject preserves nested image-specific references (shallow copy) for ImageObject', () => {
        const original = createMaximalImage({ id: 'img-ref-1' });
        const resized = resizeObject(original, 640, 480);

        // top-level object is new
        expect(resized).not.toBe(original);

        // image-specific nested fields should keep the same references
        expect(resized.crop).toBe(original.crop);
        expect(resized.filters).toBe(original.filters);
        expect(resized.mask).toBe(original.mask);

        // sizes updated correctly and original unchanged
        expect(resized.width).toBe(640);
        expect(resized.height).toBe(480);
        expect(original.width).not.toBe(640);
        expect(original.height).not.toBe(480);
    });
});
