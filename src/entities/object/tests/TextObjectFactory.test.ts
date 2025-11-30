// typescript
import { describe, it, expect, vi } from 'vitest';

// Mock nanoid before importing the factory to ensure deterministic id generation
vi.mock('nanoid', () => ({ nanoid: () => 'fixed-nanoid' }));

import { DEFAULT_STYLE, DEFAULT_TRANSFORM } from '../factory/defaults.ts';
import {
    createMaximalText,
    createMinimalText,
    createTextObject,
} from '../factory/TextObjectFactory.ts';
import type { ObjectStyle, ObjectTransform } from '../types/ObjectTypes.ts';

describe('TextObjectFactory', () => {
    const baseArgs = { x: 5, y: 6, width: 120, height: 40, content: 'init' };

    it('generates id when none provided and applies defaults', () => {
        const txt = createTextObject(baseArgs);
        expect(txt.id).toBe('fixed-nanoid');
        expect(txt.x).toBe(5);
        expect(txt.y).toBe(6);
        expect(txt.width).toBe(120);
        expect(txt.height).toBe(40);
        // default text properties present
        expect(txt.fontFamily).toBeDefined();
        expect(txt.fontSize).toBeDefined();
        expect(txt.color).toBeDefined();
    });

    it('preserves provided id', () => {
        const txt = createTextObject({ ...baseArgs, id: 'custom-id' });
        expect(txt.id).toBe('custom-id');
    });

    it('merges provided partial style with DEFAULT_STYLE', () => {
        const inputStyle: Partial<ObjectStyle> = {
            borderRadius: 8,
            shadow: { offsetX: 3 } as Partial<ObjectStyle['shadow']>,
        };
        const txt = createTextObject({ ...baseArgs, style: inputStyle });

        expect(txt.style?.borderRadius).toBe(8);
        // missing style fields come from defaults
        expect(txt.style?.backgroundColor).toBe(DEFAULT_STYLE.backgroundColor);
        expect(txt.style?.borderWidth).toBe(DEFAULT_STYLE.borderWidth);
        // shadow merged: provided offsetX present; others undefined (merged over DEFAULT_STYLE.shadow)
        expect(txt.style?.shadow).toMatchObject({ offsetX: 3 });
    });

    it('createMinimalText uses minimal defaults and merges overrides', () => {
        const created = createMinimalText({
            content: 'hello',
            style: { borderRadius: 5 },
        });
        expect(created.content).toBe('hello');
        expect(created.style?.borderRadius).toBe(5);
        expect(created.style?.backgroundColor).toBe(
            DEFAULT_STYLE.backgroundColor
        );
    });

    it('createMaximalText: partial style override should preserve other maximal style fields (detects bug)', () => {
        // maximal factory defines borderRadius: 10 in its maximal style
        const overridden = createMaximalText({
            style: { backgroundColor: '#abcdef' },
        });
        // backgroundColor must be overridden
        expect(overridden.style?.backgroundColor).toBe('#abcdef');
        // expectation: borderRadius stays from maximal (10). If implementation merges only with DEFAULT_STYLE,
        // this will fail and reveal the bug.
        expect(overridden.style?.borderRadius).toBe(10);
    });

    it('returned nested style/transform are not aliases of provided inputs or DEFAULT constants', () => {
        const inputStyle: Partial<ObjectStyle> = { borderRadius: 2 };
        const inputTransform: Partial<ObjectTransform> = { rotate: 12 };

        const obj = createTextObject({
            x: 0,
            y: 0,
            width: 100,
            height: 30,
            content: 't',
            style: inputStyle,
            transform: inputTransform,
        });

        // objects equal defaults/merged values but are not the same reference as DEFAULT constants
        expect(obj.style).not.toBe(DEFAULT_STYLE);
        expect(obj.transform).not.toBe(DEFAULT_TRANSFORM);

        // modifying returned style shouldn't mutate the provided input objects
        if (obj.style) obj.style.borderRadius = 99;
        expect(inputStyle.borderRadius ?? 2).toBe(2);
    });

    it('createTextObject preserves explicit overrides for base fields (locked, visible, zIndex)', () => {
        const obj = createTextObject({
            x: 1,
            y: 2,
            width: 10,
            height: 12,
            content: 'x',
            locked: true,
            visible: false,
            zIndex: 123,
        });
        expect(obj.locked).toBe(true);
        expect(obj.visible).toBe(false);
        expect(obj.zIndex).toBe(123);
    });

    it('applyPatch via createTextObject updates content and merges style with defaults', () => {
        const patched = createTextObject({
            ...baseArgs,
            content: 'upd',
            style: { borderRadius: 7 },
        });
        expect(patched.content).toBe('upd');
        expect(patched.style?.borderRadius).toBe(7);
        expect(patched.style?.backgroundColor).toBe(
            DEFAULT_STYLE.backgroundColor
        );
    });
});
