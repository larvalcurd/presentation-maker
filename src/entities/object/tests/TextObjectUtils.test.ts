// TextObjectUtils.test.ts
import { describe, it, expect } from 'vitest';
import { createTextObject } from '../factory/TextObjectFactory.ts';
import {
    updateTextContent,
    updateTextFontSize,
    updateTextFontFamily,
    updateTextColor,
    updateTextStyle,
} from '../utils/TextObjectUtils.ts';

describe('TextObject', () => {
    describe('TextObjectUtils', () => {
        // Базовые тесты (уже существующие)
        it('should update text content without mutating original', () => {
            const textObj = createTextObject({
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                content: 'Hello',
            });

            const originalContent = textObj.content;
            const originalObjectSnapshot = { ...textObj };

            const updated = updateTextContent(textObj, 'New Content');

            expect(updated.content).toBe('New Content');
            expect(updated).toEqual({
                ...textObj,
                content: 'New Content',
            });

            expect(textObj.content).toBe(originalContent);
            expect(textObj).toEqual(originalObjectSnapshot);
            expect(updated).not.toBe(textObj);
        });

        it('should update font size without mutating original', () => {
            const textObj = createTextObject({
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                content: 'Hello',
            });

            const originalFontSize = textObj.fontSize;
            const originalObjectSnapshot = { ...textObj };

            const updated = updateTextFontSize(textObj, 24);

            expect(updated.fontSize).toBe(24);
            expect(updated).toEqual({
                ...textObj,
                fontSize: 24,
            });

            expect(textObj.fontSize).toBe(originalFontSize);
            expect(textObj).toEqual(originalObjectSnapshot);
            expect(updated).not.toBe(textObj);
        });

        it('should update font family without mutating original', () => {
            const textObj = createTextObject({
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                content: 'Hello',
            });

            const originalFontFamily = textObj.fontFamily;
            const originalObjectSnapshot = { ...textObj };

            const updated = updateTextFontFamily(textObj, 'Helvetica');

            expect(updated.fontFamily).toBe('Helvetica');
            expect(updated).toEqual({
                ...textObj,
                fontFamily: 'Helvetica',
            });

            expect(textObj.fontFamily).toBe(originalFontFamily);
            expect(textObj).toEqual(originalObjectSnapshot);
            expect(updated).not.toBe(textObj);
        });

        it('should update text color without mutating original', () => {
            const textObj = createTextObject({
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                content: 'Hello',
            });

            const originalColor = textObj.color;
            const originalObjectSnapshot = { ...textObj };

            const updated = updateTextColor(textObj, '#FF0000');

            expect(updated.color).toBe('#FF0000');
            expect(updated).toEqual({
                ...textObj,
                color: '#FF0000',
            });

            expect(textObj.color).toBe(originalColor);
            expect(textObj).toEqual(originalObjectSnapshot);
            expect(updated).not.toBe(textObj);
        });

        it('should update multiple text styles at once without mutating original', () => {
            const textObj = createTextObject({
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                content: 'Hello',
            });

            const originalObjectSnapshot = { ...textObj };

            const styleUpdates = {
                fontWeight: 'bold' as const,
                fontStyle: 'italic' as const,
                textAlign: 'center' as const,
                lineHeight: 1.5,
                letterSpacing: 2,
            };

            const updated = updateTextStyle(textObj, styleUpdates);

            expect(updated).toEqual({
                ...textObj,
                ...styleUpdates,
            });

            expect(textObj.fontWeight).toBe('normal');
            expect(textObj.fontStyle).toBe('normal');
            expect(textObj).toEqual(originalObjectSnapshot);
            expect(updated).not.toBe(textObj);
        });

        it('should partial update text styles without mutating original', () => {
            const textObj = createTextObject({
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                content: 'Hello',
            });

            const originalObjectSnapshot = { ...textObj };

            const styleUpdates = {
                fontWeight: 'bold' as const,
                textAlign: 'right' as const,
            };

            const updated = updateTextStyle(textObj, styleUpdates);

            expect(updated.fontWeight).toBe('bold');
            expect(updated.textAlign).toBe('right');
            expect(updated.fontStyle).toBe('normal');
            expect(updated.lineHeight).toBe(1.2);

            expect(textObj).toEqual(originalObjectSnapshot);
            expect(updated).not.toBe(textObj);
        });

        it('should not share nested object references', () => {
            const textObj = createTextObject({
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                content: 'Hello',
                style: {
                    borderRadius: 10,
                    borderWidth: 2,
                    shadow: {
                        offsetX: 5,
                        offsetY: 5,
                        blur: 10,
                        color: '#000000',
                    },
                },
            });

            const updated = updateTextContent(textObj, 'New Content');

            expect(updated.style).not.toBe(textObj.style);
            expect(updated.transform).not.toBe(textObj.transform);

            expect(updated.style?.shadow).not.toBe(textObj.style?.shadow);

            expect(updated.style).toEqual(textObj.style);
            expect(updated.transform).toEqual(textObj.transform);
        });

        it('should handle undefined style and transform correctly', () => {
            const textObj = createTextObject({
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                content: 'Hello',
            });

            expect(textObj.style).toBeDefined();
            expect(textObj.transform).toBeDefined();

            const updated = updateTextContent(textObj, 'New Content');

            expect(updated.style).toBeDefined();
            expect(updated.transform).toBeDefined();
            expect(updated.style).not.toBe(textObj.style);
            expect(updated.transform).not.toBe(textObj.transform);
        });

        // НОВЫЕ ТЕСТЫ С МАКСИМАЛЬНЫМИ ДАННЫМИ

        describe('Maximum data scenarios', () => {
            it('should update all text properties simultaneously', () => {
                const originalText = createTextObject({
                    x: 0,
                    y: 0,
                    width: 200,
                    height: 100,
                    content: 'Original Text',
                    fontFamily: 'Arial',
                    fontSize: 16,
                    color: '#000000',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    textAlign: 'left',
                    lineHeight: 1.2,
                    letterSpacing: 0,
                    style: {
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#000000',
                        backgroundColor: '#FFFFFF',
                        shadow: {
                            offsetX: 2,
                            offsetY: 2,
                            blur: 4,
                            color: '#000000',
                        },
                    },
                    transform: {
                        rotate: 0,
                        scaleX: 1,
                        scaleY: 1,
                        opacity: 1,
                    },
                });

                const originalSnapshot = { ...originalText };

                // Обновляем все возможные свойства
                const updated = updateTextStyle(originalText, {
                    fontFamily: 'Times New Roman',
                    fontSize: 32,
                    color: '#FF5733',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    textAlign: 'right',
                    lineHeight: 2.0,
                    letterSpacing: 3,
                });

                // Проверяем все обновленные свойства
                expect(updated.fontFamily).toBe('Times New Roman');
                expect(updated.fontSize).toBe(32);
                expect(updated.color).toBe('#FF5733');
                expect(updated.fontWeight).toBe('bold');
                expect(updated.fontStyle).toBe('italic');
                expect(updated.textAlign).toBe('right');
                expect(updated.lineHeight).toBe(2.0);
                expect(updated.letterSpacing).toBe(3);

                // Проверяем неизменность оригинального объекта
                expect(originalText).toEqual(originalSnapshot);
                expect(updated).not.toBe(originalText);

                // Проверяем что вложенные объекты скопированы
                expect(updated.style).not.toBe(originalText.style);
                expect(updated.transform).not.toBe(originalText.transform);
                expect(updated.style?.shadow).not.toBe(
                    originalText.style?.shadow
                );
            });

            it('should handle multiple sequential updates correctly', () => {
                let textObj = createTextObject({
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 50,
                    content: 'Start',
                    fontFamily: 'Arial',
                    fontSize: 12,
                    color: '#000000',
                });

                const originalId = textObj.id;

                // Последовательные обновления
                textObj = updateTextContent(textObj, 'Updated Content');
                textObj = updateTextFontSize(textObj, 18);
                textObj = updateTextFontFamily(textObj, 'Verdana');
                textObj = updateTextColor(textObj, '#00FF00');
                textObj = updateTextStyle(textObj, {
                    fontWeight: 'bold',
                    textAlign: 'center',
                });

                // Проверяем конечное состояние
                expect(textObj.content).toBe('Updated Content');
                expect(textObj.fontSize).toBe(18);
                expect(textObj.fontFamily).toBe('Verdana');
                expect(textObj.color).toBe('#00FF00');
                expect(textObj.fontWeight).toBe('bold');
                expect(textObj.textAlign).toBe('center');

                // ID должен остаться прежним
                expect(textObj.id).toBe(originalId);
            });

            it('should handle edge cases for text properties', () => {
                const textObj = createTextObject({
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 50,
                    content: 'Test',
                });

                // Граничные значения для fontSize
                const zeroSize = updateTextFontSize(textObj, 0);
                const largeSize = updateTextFontSize(textObj, 999);

                expect(zeroSize.fontSize).toBe(0);
                expect(largeSize.fontSize).toBe(999);

                // Специальные значения для lineHeight
                const unitLineHeight = updateTextStyle(textObj, {
                    lineHeight: 1,
                });
                const decimalLineHeight = updateTextStyle(textObj, {
                    lineHeight: 1.75,
                });

                expect(unitLineHeight.lineHeight).toBe(1);
                expect(decimalLineHeight.lineHeight).toBe(1.75);

                // Отрицательный letterSpacing
                const negativeSpacing = updateTextStyle(textObj, {
                    letterSpacing: -1,
                });
                expect(negativeSpacing.letterSpacing).toBe(-1);
            });

            it('should handle complex text with HTML-like content', () => {
                const complexContent = 'Line 1\nLine 2\n\tIndented Line 3';
                const textObj = createTextObject({
                    x: 0,
                    y: 0,
                    width: 200,
                    height: 100,
                    content: complexContent,
                });

                const updated = updateTextContent(
                    textObj,
                    'New\nMulti\nLine\nContent'
                );

                expect(updated.content).toBe('New\nMulti\nLine\nContent');
                expect(updated.content).toContain('\n');
            });

            it('should preserve all non-text properties during updates', () => {
                const original = createTextObject({
                    x: 10,
                    y: 20,
                    width: 150,
                    height: 75,
                    content: 'Original',
                    zIndex: 5,
                    locked: true,
                    visible: false,
                    style: {
                        borderRadius: 10,
                        borderWidth: 2,
                        backgroundColor: '#FFE4E1',
                    },
                    transform: {
                        rotate: 30,
                        scaleX: 1.5,
                        scaleY: 0.5,
                        opacity: 0.8,
                    },
                });

                const updated = updateTextContent(original, 'Updated');

                // Проверяем что неизменяемые свойства сохранились
                expect(updated.x).toBe(original.x);
                expect(updated.y).toBe(original.y);
                expect(updated.width).toBe(original.width);
                expect(updated.height).toBe(original.height);
                expect(updated.zIndex).toBe(original.zIndex);
                expect(updated.locked).toBe(original.locked);
                expect(updated.visible).toBe(original.visible);
                expect(updated.style).toEqual(original.style);
                expect(updated.transform).toEqual(original.transform);
                expect(updated.type).toBe(original.type);
            });

            it('should handle numeric fontWeight values', () => {
                const textObj = createTextObject({
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 50,
                    content: 'Test',
                });

                const lightText = updateTextStyle(textObj, { fontWeight: 300 });
                const boldNumeric = updateTextStyle(textObj, {
                    fontWeight: 700,
                });

                expect(lightText.fontWeight).toBe(300);
                expect(boldNumeric.fontWeight).toBe(700);
            });

            it('should handle complete style reset scenarios', () => {
                const styledText = createTextObject({
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 50,
                    content: 'Styled Text',
                    fontFamily: 'Comic Sans',
                    fontSize: 20,
                    color: '#FF00FF',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    textAlign: 'right',
                    lineHeight: 2.5,
                    letterSpacing: 5,
                });

                // Сбрасываем все к значениям по умолчанию
                const resetText = updateTextStyle(styledText, {
                    fontFamily: 'Arial',
                    fontSize: 16,
                    color: '#000000',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    textAlign: 'left',
                    lineHeight: 1.2,
                    letterSpacing: 0,
                });

                expect(resetText.fontFamily).toBe('Arial');
                expect(resetText.fontSize).toBe(16);
                expect(resetText.color).toBe('#000000');
                expect(resetText.fontWeight).toBe('normal');
                expect(resetText.fontStyle).toBe('normal');
                expect(resetText.textAlign).toBe('left');
                expect(resetText.lineHeight).toBe(1.2);
                expect(resetText.letterSpacing).toBe(0);
            });
        });
    });
});
