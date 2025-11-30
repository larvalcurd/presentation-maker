import { describe, it, expect, vi } from 'vitest';
import type { ObjectStyle, ObjectTransform } from '../types/ObjectTypes.ts';

// mock nanoid before importing the factory to ensure deterministic id generation
vi.mock('nanoid', () => ({ nanoid: () => 'fixed-nanoid' }));

import { createBaseObject } from '../factory/BaseObjectFactory.ts';
import {
    DEFAULT_STYLE,
    DEFAULT_TRANSFORM,
    DEFAULT_BASE,
} from '../factory/defaults.ts';

describe('createBaseObject', () => {
    const minimalArgs = { x: 1, y: 2, width: 10, height: 20 };

    it('generates an id when none provided and fills defaults from DEFAULT_BASE', () => {
        const obj = createBaseObject(minimalArgs);

        expect(obj.id).toBe('fixed-nanoid');
        expect(obj.x).toBe(1);
        expect(obj.y).toBe(2);
        expect(obj.width).toBe(10);
        expect(obj.height).toBe(20);

        // DEFAULT_BASE fields present and preserved
        expect(obj.zIndex).toBe(DEFAULT_BASE.zIndex);
        expect(obj.locked).toBe(DEFAULT_BASE.locked);
        expect(obj.visible).toBe(DEFAULT_BASE.visible);
    });

    it('preserves provided id', () => {
        const obj = createBaseObject({ ...minimalArgs, id: 'custom-id' });
        expect(obj.id).toBe('custom-id');
    });

    it('merges provided partial style with DEFAULT_STYLE', () => {
        const inputStyle: Partial<ObjectStyle> = {
            borderRadius: 5,
            shadow: { offsetX: 2 } as Partial<ObjectStyle['shadow']>,
        };

        const obj = createBaseObject({ ...minimalArgs, style: inputStyle });

        // Provided value respected
        expect(obj.style?.borderRadius).toBe(5);

        // Defaults fill missing style fields
        expect(obj.style?.backgroundColor).toBe(DEFAULT_STYLE.backgroundColor);
        expect(obj.style?.borderWidth).toBe(DEFAULT_STYLE.borderWidth);

        // Shadow merged: provided offsetX present; other shadow props remain undefined
        expect(obj.style?.shadow).toMatchObject({ offsetX: 2 });
        expect(obj.style?.shadow?.offsetY).toBeUndefined();
    });

    it('merges provided partial transform with DEFAULT_TRANSFORM', () => {
        const inputTransform: Partial<ObjectTransform> = { rotate: 45 };

        const obj = createBaseObject({
            ...minimalArgs,
            transform: inputTransform,
        });

        expect(obj.transform?.rotate).toBe(45);
        // defaults preserved for missing transform fields
        expect(obj.transform?.scaleX).toBe(DEFAULT_TRANSFORM.scaleX);
        expect(obj.transform?.opacity).toBe(DEFAULT_TRANSFORM.opacity);
    });

    it('does not alias input style/transform objects or DEFAULT constants (immutability)', () => {
        const providedStyle: Partial<ObjectStyle> = { borderRadius: 2 };
        const providedTransform: Partial<ObjectTransform> = { rotate: 10 };

        const obj = createBaseObject({
            ...minimalArgs,
            style: providedStyle,
            transform: providedTransform,
        });

        // returned nested objects are new references
        expect(obj.style).not.toBe(providedStyle);
        expect(obj.transform).not.toBe(providedTransform);

        // returned style/transform are not the same reference as DEFAULT constants
        expect(obj.style).not.toBe(DEFAULT_STYLE);
        expect(obj.transform).not.toBe(DEFAULT_TRANSFORM);

        // modifying returned nested objects does not affect the originals
        if (obj.style) obj.style.borderRadius = 99;
        expect(providedStyle.borderRadius).toBe(2);
    });

    it('respects explicit overrides for other base fields (zIndex, locked, visible)', () => {
        const obj = createBaseObject({
            ...minimalArgs,
            zIndex: 42,
            locked: true,
            visible: false,
        });

        expect(obj.zIndex).toBe(42);
        expect(obj.locked).toBe(true);
        expect(obj.visible).toBe(false);
    });

    it('returns cloned defaults when style/transform not provided (no aliasing)', () => {
        const obj = createBaseObject(minimalArgs);

        // values equal defaults but not same references
        expect(obj.style).toEqual(DEFAULT_STYLE);
        expect(obj.style).not.toBe(DEFAULT_STYLE);

        expect(obj.transform).toEqual(DEFAULT_TRANSFORM);
        expect(obj.transform).not.toBe(DEFAULT_TRANSFORM);
    });
});
