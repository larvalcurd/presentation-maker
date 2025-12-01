// ObjectFactory.test.ts
import { describe, it, expect } from 'vitest';
import {
    createMinimalText,
    createTextObject,
} from '../factory/TextObjectFactory.ts';
import { applyPatch } from '../factory/helpers.ts';
import {
    createImageObject,
    createMaximalImage,
    createMinimalImage,
} from '../factory/ImageObjectFactory.ts';
import type { ImageObject, TextObject } from '../types/ObjectTypes.ts';

describe('ObjectFactory', () => {
    describe('createTextObject', () => {
        it('should create text object with custom properties using applyPatch', () => {
            const customText = createTextObject({
                x: 50,
                y: 100,
                width: 200,
                height: 40,
                content: 'Custom Text',
                fontFamily: 'Helvetica',
                fontSize: 20,
                color: '#FF5733',
                fontWeight: 'bold',
                fontStyle: 'italic',
                textAlign: 'center',
                lineHeight: 1.5,
                letterSpacing: 1,
            });

            expect(customText).toMatchObject({
                type: 'text',
                x: 50,
                y: 100,
                width: 200,
                height: 40,
                content: 'Custom Text',
                fontFamily: 'Helvetica',
                fontSize: 20,
                color: '#FF5733',
                fontWeight: 'bold',
                fontStyle: 'italic',
                textAlign: 'center',
                lineHeight: 1.5,
                letterSpacing: 1,
            });

            // Проверяем, что дефолтные значения применены корректно
            expect(customText.zIndex).toBe(0);
            expect(customText.locked).toBe(false);
            expect(customText.visible).toBe(true);
        });

        it('should merge nested styles and transforms correctly', () => {
            const text = createTextObject({
                x: 0,
                y: 0,
                width: 100,
                height: 50,
                content: 'Test',
                style: {
                    borderRadius: 10,
                    backgroundColor: '#F0F0F0',
                    // Не передаем shadow - должен остаться undefined
                },
                transform: {
                    rotate: 45,
                    opacity: 0.8,
                    scaleX: 1,
                    scaleY: 1,
                },
            });

            expect(text.style).toEqual({
                borderRadius: 10,
                borderColor: '#000000',
                borderWidth: 0,
                shadow: undefined,
                backgroundColor: '#F0F0F0',
            });

            expect(text.transform).toEqual({
                rotate: 45,
                scaleX: 1,
                scaleY: 1,
                opacity: 0.8,
            });
        });

        it('should handle partial style updates with applyPatch semantics', () => {
            const initialText = createTextObject({
                x: 0,
                y: 0,
                width: 100,
                height: 50,
                content: 'Initial',
                style: {
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: '#000000',
                    backgroundColor: '#FFFFFF',
                },
            });

            // Симулируем применение патча к существующему объекту
            const updatedText = applyPatch(initialText, {
                content: 'Updated',
                style: {
                    borderRadius: 10,
                    backgroundColor: '#F0F0F0',
                    // Не передаем border - должен сохраниться из initialText
                },
            });

            expect(updatedText.content).toBe('Updated');
            expect(updatedText.style).toEqual({
                borderRadius: 10,
                borderWidth: 2, // preserved from maximal original style
                backgroundColor: '#F0F0F0',
                borderColor: '#000000',
                shadow: undefined,
            });
        });
    });

    describe('createImageObject', () => {
        it('should create image object with complex nested structures', () => {
            const image = createImageObject({
                x: 10,
                y: 20,
                width: 400,
                height: 300,
                src: 'photo.jpg',
                filters: {
                    brightness: 1.2,
                    contrast: 0.8,
                    // saturation, blur, grayscale - должны взять дефолты
                },
                crop: {
                    x: 5,
                    y: 5,
                    width: 390,
                    // height не передаем - должен взять дефолт
                },
            });

            expect(image.filters).toEqual({
                brightness: 1.2,
                contrast: 0.8,
                saturation: 1,
                blur: 0,
                grayscale: 0,
            });

            expect(image.crop).toEqual({
                x: 5,
                y: 5,
                width: 390,
                height: 100, // Дефолтное значение из DEFAULT_CROP
            });
        });

        it('should handle mask with points array correctly', () => {
            const polygonImage = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'test.jpg',
                mask: {
                    shape: 'polygon',
                    points: [
                        { x: 0, y: 0 },
                        { x: 50, y: 100 },
                        { x: 100, y: 0 },
                    ],
                },
            });

            expect(polygonImage.mask).toEqual({
                shape: 'polygon',
                points: [
                    { x: 0, y: 0 },
                    { x: 50, y: 100 },
                    { x: 100, y: 0 },
                ],
            });
        });
    });

    describe('applyPatch integration', () => {
        it('should correctly apply patches to text objects', () => {
            const original = createMinimalText();
            const patch: Partial<TextObject> = {
                content: 'Patched Content',
                fontSize: 24,
                style: {
                    borderRadius: 15,
                    backgroundColor: '#FF0000',
                },
            };

            const patched = applyPatch(original, patch);

            expect(patched.content).toBe('Patched Content');
            expect(patched.fontSize).toBe(24);
            expect(patched.style?.borderRadius).toBe(15);
            expect(patched.style?.backgroundColor).toBe('#FF0000');

            // Проверяем, что неизмененные поля сохранились
            expect(patched.x).toBe(original.x);
            expect(patched.fontFamily).toBe(original.fontFamily);
        });

        it('should correctly apply patches to image objects with nested properties', () => {
            const original = createMinimalImage();
            const patch: Partial<ImageObject> = {
                src: 'new-image.jpg',
                fit: 'cover',
                filters: {
                    brightness: 1.5,
                    blur: 3,
                },
                crop: {
                    x: 10,
                    y: 10,
                    width: 200,
                    height: 200,
                },
            };

            const patched = applyPatch(original, patch);

            expect(patched.src).toBe('new-image.jpg');
            expect(patched.fit).toBe('cover');
            expect(patched.filters).toEqual({
                brightness: 1.5,
                contrast: 1,
                saturation: 1,
                blur: 3,
                grayscale: 0,
            });
            expect(patched.crop).toEqual({
                x: 10,
                y: 10,
                width: 200,
                height: 200,
            });
        });

        it('should handle undefined values in patches correctly', () => {
            const original = createMaximalImage();

            const patch: Partial<ImageObject> = {
                filters: undefined, // Явно сбрасываем фильтры
                crop: undefined, // Явно сбрасываем кроп
            };

            const patched = applyPatch(original, patch);

            expect(patched.filters).toBeUndefined();
            expect(patched.crop).toBeUndefined();

            // Проверяем, что другие свойства сохранились
            expect(patched.src).toBe(original.src);
            expect(patched.fit).toBe(original.fit);
        });
    });

    describe('Test data factories with applyPatch behavior', () => {
        it('should allow deep overrides in minimal factories', () => {
            const customMinimalText = createMinimalText({
                content: 'Custom Minimal',
                style: {
                    borderRadius: 8,
                    backgroundColor: '#E0E0E0',
                },
                transform: {
                    rotate: 10,
                    opacity: 0.9,
                    scaleX: 1,
                    scaleY: 1,
                },
            });

            expect(customMinimalText.content).toBe('Custom Minimal');
            expect(customMinimalText.style?.borderRadius).toBe(8);
            expect(customMinimalText.transform?.rotate).toBe(10);

            // Дефолтные значения минимального текста
            expect(customMinimalText.x).toBe(0);
            expect(customMinimalText.fontFamily).toBe('Arial');
        });

        it('should allow partial overrides in maximal factories', () => {
            const customMaximalImage = createMaximalImage({
                src: 'overridden.jpg',
                fit: 'contain',
                // Частично обновляем фильтры
                filters: {
                    brightness: 2.0,
                    // contrast, saturation и другие должны сохраниться из maximal
                },
            });

            expect(customMaximalImage.src).toBe('overridden.jpg');
            expect(customMaximalImage.fit).toBe('contain');
            expect(customMaximalImage.filters?.brightness).toBe(2.0);
            expect(customMaximalImage.filters?.contrast).toBe(1.5); // Сохранилось из maximal
            expect(customMaximalImage.filters?.saturation).toBe(1.3); // Сохранилось из maximal
        });
    });

    describe('Immutability and object identity', () => {
        it('should not mutate original objects when applying patches', () => {
            const original = createMinimalText({
                content: 'Original',
                style: { borderRadius: 5 },
            });

            const originalStyle = original.style;
            const originalTransform = original.transform;

            const patched = applyPatch(original, {
                content: 'Updated',
                style: { borderRadius: 10 },
            });

            // Проверяем, что оригинал не изменился
            expect(original.content).toBe('Original');
            expect(original.style?.borderRadius).toBe(5);

            // Проверяем, что патченный объект изменился
            expect(patched.content).toBe('Updated');
            expect(patched.style?.borderRadius).toBe(10);

            // Проверяем, что вложенные объекты были клонированы, а не мутированы
            expect(patched.style).not.toBe(originalStyle);
            expect(patched.transform).not.toBe(originalTransform);
        });

        it('should create new nested objects even when they are not changed', () => {
            const original = createMinimalImage({
                filters: { brightness: 1.2 },
                crop: { x: 10, y: 10, width: 80, height: 80 },
            });

            const originalFilters = original.filters;
            const originalCrop = original.crop;

            const patched = applyPatch(original, {
                src: 'new-src.jpg',
                // Не меняем filters и crop
            });

            expect(patched.filters).toEqual(originalFilters);
            expect(patched.filters).not.toBe(originalFilters); // Должен быть новый объект
            expect(patched.crop).toEqual(originalCrop);
            expect(patched.crop).not.toBe(originalCrop); // Должен быть новый объект
        });
    });
});
