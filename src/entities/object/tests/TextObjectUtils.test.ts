import { describe, it, expect } from 'vitest';
import {
    createMinimalText,
    createMaximalText,
} from '../factory/TextObjectFactory.ts';
import {
    updateTextContent,
    updateTextFontSize,
    updateTextFontFamily,
    updateTextColor,
    updateTextStyle,
} from '../utils/TextObjectUtils.ts';

describe('TextObjectUtils - minimal & maximal cases', () => {
    // updateTextContent
    it('updateTextContent - minimal: updates content and is immutable', () => {
        const original = createMinimalText({ content: 'Hi' });
        const snapshot = JSON.parse(JSON.stringify(original));

        const updated = updateTextContent(original, 'Hello');

        expect(updated.content).toBe('Hello');
        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(updated.style).toEqual(original.style);
        expect(original).toEqual(snapshot);
    });

    it('updateTextContent - maximal: updates content and deep-copies nested objects', () => {
        const original = createMaximalText();
        const snapshot = JSON.parse(JSON.stringify(original));

        const updated = updateTextContent(original, 'Max Text');

        expect(updated.content).toBe('Max Text');
        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(updated.style).toEqual(original.style);
        expect(original).toEqual(snapshot);
    });

    // updateTextFontSize
    it('updateTextFontSize - minimal: updates fontSize and is immutable', () => {
        const original = createMinimalText();
        const snapshot = JSON.parse(JSON.stringify(original));

        const updated = updateTextFontSize(original, 28);

        expect(updated.fontSize).toBe(28);
        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(original).toEqual(snapshot);
    });

    it('updateTextFontSize - maximal: updates fontSize and preserves immutability', () => {
        const original = createMaximalText();
        const snapshot = JSON.parse(JSON.stringify(original));

        const updated = updateTextFontSize(original, 48);

        expect(updated.fontSize).toBe(48);
        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(original).toEqual(snapshot);
    });

    // updateTextFontFamily
    it('updateTextFontFamily - minimal: updates family and is immutable', () => {
        const original = createMinimalText({ fontFamily: 'Arial' });
        const snapshot = JSON.parse(JSON.stringify(original));

        const updated = updateTextFontFamily(original, 'Helvetica');

        expect(updated.fontFamily).toBe('Helvetica');
        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(original).toEqual(snapshot);
    });

    it('updateTextFontFamily - maximal: updates family and clones nested objects', () => {
        const original = createMaximalText();
        const snapshot = JSON.parse(JSON.stringify(original));

        const updated = updateTextFontFamily(original, 'Times New Roman');

        expect(updated.fontFamily).toBe('Times New Roman');
        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(original).toEqual(snapshot);
    });

    // updateTextColor
    it('updateTextColor - minimal: updates color and is immutable', () => {
        const original = createMinimalText({ color: '#000000' });
        const snapshot = JSON.parse(JSON.stringify(original));

        const updated = updateTextColor(original, '#FF00FF');

        expect(updated.color).toBe('#FF00FF');
        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(original).toEqual(snapshot);
    });

    it('updateTextColor - maximal: updates color and preserves immutability', () => {
        const original = createMaximalText({ color: '#111111' });
        const snapshot = JSON.parse(JSON.stringify(original));

        const updated = updateTextColor(original, '#00FF00');

        expect(updated.color).toBe('#00FF00');
        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(original).toEqual(snapshot);
    });

    // updateTextStyle
    it('updateTextStyle - minimal: applies multiple updates and is immutable', () => {
        const original = createMinimalText();
        const snapshot = JSON.parse(JSON.stringify(original));

        const updates = {
            fontWeight: 'bold' as const,
            fontStyle: 'italic' as const,
            textAlign: 'center' as const,
            lineHeight: 1.6,
            letterSpacing: 2,
        };

        const updated = updateTextStyle(original, updates);

        expect(updated.fontWeight).toBe('bold');
        expect(updated.fontStyle).toBe('italic');
        expect(updated.textAlign).toBe('center');
        expect(updated.lineHeight).toBe(1.6);
        expect(updated.letterSpacing).toBe(2);

        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(original).toEqual(snapshot);
    });

    it('updateTextStyle - maximal: applies updates, clones nested objects and keeps others intact', () => {
        const original = createMaximalText();
        const snapshot = JSON.parse(JSON.stringify(original));

        const updates = {
            fontFamily: 'Courier New',
            fontSize: 30,
            fontWeight: 700 as const,
            textAlign: 'right' as const,
            lineHeight: 2,
        };

        const updated = updateTextStyle(original, updates);

        expect(updated.fontFamily).toBe('Courier New');
        expect(updated.fontSize).toBe(30);
        expect(updated.fontWeight).toBe(700);
        expect(updated.textAlign).toBe('right');
        expect(updated.lineHeight).toBe(2);

        // Ensure immutability of nested objects
        expect(updated).not.toBe(original);
        expect(updated.style).not.toBe(original.style);
        expect(updated.transform).not.toBe(original.transform);
        expect(original).toEqual(snapshot);
    });
});
