// typescript
import { describe, it, expect, vi } from 'vitest';
import type {
    ObjectShadow,
    ObjectStyle,
    ObjectTransform,
} from '../types/ObjectTypes.ts';

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

    it('does not merge provided partial style; factory keeps defaults (merging is done by applyPatch)', () => {
        const inputStyle: Partial<ObjectStyle> = {
            borderRadius: 5,
            shadow: { offsetX: 2 } as ObjectShadow,
        };

        const obj = createBaseObject({ ...minimalArgs, style: inputStyle });

        // Factory should not merge partial style — it should keep defaults (cloned).
        expect(obj.style).toEqual(DEFAULT_STYLE);
        expect(obj.style).not.toBe(DEFAULT_STYLE);

        // Provided partial should not have been applied here
        expect(obj.style?.borderRadius).toBe(DEFAULT_STYLE.borderRadius);
    });

    it('does not merge provided partial transform; factory keeps defaults (merging is done by applyPatch)', () => {
        const inputTransform: Partial<ObjectTransform> = { rotate: 45 };

        const obj = createBaseObject({
            ...minimalArgs,
            transform: inputTransform,
        });

        // Factory returns cloned defaults for transform; partial not applied here.
        expect(obj.transform).toEqual(DEFAULT_TRANSFORM);
        expect(obj.transform).not.toBe(DEFAULT_TRANSFORM);

        // Provided rotate should NOT be present on factory result
        expect(obj.transform?.rotate).toBe(DEFAULT_TRANSFORM.rotate);
    });

    it('does not alias input style/transform objects or DEFAULT constants (immutability)', () => {
        const inputStyle: Partial<ObjectStyle> = { borderRadius: 5 };
        const inputTransform: Partial<ObjectTransform> = { rotate: 10 };

        const obj = createBaseObject({
            ...minimalArgs,
            style: inputStyle,
            transform: inputTransform,
        });

        // Ensure factory did not alias DEFAULT constants nor input objects
        expect(obj.style).toEqual(DEFAULT_STYLE);
        expect(obj.style).not.toBe(DEFAULT_STYLE);

        expect(obj.transform).toEqual(DEFAULT_TRANSFORM);
        expect(obj.transform).not.toBe(DEFAULT_TRANSFORM);
    });

    it('respects explicit overrides for other base fields (zIndex, locked, visible)', () => {
        const obj = createBaseObject({
            ...minimalArgs,
            zIndex: 5,
            locked: true,
            visible: false,
        });

        expect(obj.zIndex).toBe(5);
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
