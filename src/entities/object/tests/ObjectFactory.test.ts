// ObjectFactory.test.ts
import { describe, it, expect } from 'vitest';
import {
    createTextObject,
    createImageObject,
    createMinimalText,
    createMinimalImage,
    createMaximalText,
    createMaximalImage,
} from '../factory/ObjectFactory.ts';

describe('ObjectFactory', () => {
    describe('createTextObject', () => {
        it('should create text object with custom properties', () => {
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
                zIndex: 5,
                locked: true,
                visible: false,
                style: {
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: '#000000',
                    backgroundColor: '#FFFFFF',
                },
                transform: {
                    rotate: 45,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    opacity: 0.8,
                },
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
                zIndex: 5,
                locked: true,
                visible: false,
                style: {
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: '#000000',
                    backgroundColor: '#FFFFFF',
                },
                transform: {
                    rotate: 45,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    opacity: 0.8,
                },
            });
        });

        it('should create text object with partial custom style', () => {
            const textWithPartialStyle = createTextObject({
                x: 0,
                y: 0,
                width: 100,
                height: 50,
                content: 'Partial Style',
                style: {
                    borderRadius: 10,
                    backgroundColor: '#F0F0F0',
                },
            });

            expect(textWithPartialStyle.style).toMatchObject({
                borderRadius: 10,
                borderColor: '#00000000',
                borderWidth: 0,
                shadow: undefined,
                backgroundColor: '#F0F0F0',
            });
        });

        it('should apply default values when not provided', () => {
            const text = createTextObject({
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                content: 'Test',
            });

            expect(text.fontFamily).toBe('Arial');
            expect(text.fontSize).toBe(16);
            expect(text.color).toBe('#000000');
            expect(text.fontWeight).toBe('normal');
            expect(text.fontStyle).toBe('normal');
            expect(text.textAlign).toBe('left');
            expect(text.lineHeight).toBe(1.2);
            expect(text.letterSpacing).toBe(0);
            expect(text.zIndex).toBe(0);
            expect(text.locked).toBe(false);
            expect(text.visible).toBe(true);
        });
    });

    describe('createImageObject', () => {
        it('should create minimal image object', () => {
            const minimalImage = createImageObject({
                x: 0,
                y: 0,
                width: 300,
                height: 200,
                src: 'image.jpg',
            });

            expect(minimalImage).toMatchObject({
                type: 'image',
                x: 0,
                y: 0,
                width: 300,
                height: 200,
                src: 'image.jpg',
                preserveAspect: true,
                fit: 'contain',
                rotationOrigin: 'center',
                style: {
                    borderRadius: 0,
                    borderColor: '#00000000',
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                },
                transform: {
                    rotate: 0,
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1,
                },
            });

            // Проверяем отсутствие необязательных полей
            expect(minimalImage.crop).toBeUndefined();
            expect(minimalImage.filters).toBeUndefined();
            expect(minimalImage.mask).toBeUndefined();
        });

        it('should create image object with all properties', () => {
            const fullImage = createImageObject({
                x: 10,
                y: 20,
                width: 400,
                height: 300,
                src: 'photo.jpg',
                preserveAspect: false,
                fit: 'cover',
                crop: {
                    x: 5,
                    y: 5,
                    width: 390,
                    height: 290,
                },
                filters: {
                    brightness: 1.2,
                    contrast: 0.8,
                    saturation: 1.1,
                    blur: 2,
                    grayscale: 0.5,
                },
                mask: {
                    shape: 'circle',
                    radius: 50,
                },
                rotationOrigin: 'top-left',
                zIndex: 10,
                locked: false,
                visible: true,
                style: {
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#FF0000',
                    shadow: {
                        offsetX: 5,
                        offsetY: 5,
                        blur: 10,
                        color: '#000000',
                    },
                    backgroundColor: '#FFFFFF',
                },
                transform: {
                    rotate: 45,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    opacity: 0.8,
                },
            });

            expect(fullImage).toMatchObject({
                type: 'image',
                x: 10,
                y: 20,
                width: 400,
                height: 300,
                src: 'photo.jpg',
                preserveAspect: false,
                fit: 'cover',
                crop: {
                    x: 5,
                    y: 5,
                    width: 390,
                    height: 290,
                },
                filters: {
                    brightness: 1.2,
                    contrast: 0.8,
                    saturation: 1.1,
                    blur: 2,
                    grayscale: 0.5,
                },
                mask: {
                    shape: 'circle',
                    radius: 50,
                },
                rotationOrigin: 'top-left',
                zIndex: 10,
                locked: false,
                visible: true,
                style: {
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#FF0000',
                    shadow: {
                        offsetX: 5,
                        offsetY: 5,
                        blur: 10,
                        color: '#000000',
                    },
                    backgroundColor: '#FFFFFF',
                },
                transform: {
                    rotate: 45,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    opacity: 0.8,
                },
            });
        });

        it('should handle custom rotation origin coordinates', () => {
            const imageWithCustomOrigin = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'test.jpg',
                rotationOrigin: { x: 25, y: 25 },
            });

            expect(imageWithCustomOrigin.rotationOrigin).toEqual({
                x: 25,
                y: 25,
            });
        });

        it('should handle different mask shapes', () => {
            const roundedMask = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'test.jpg',
                mask: {
                    shape: 'rounded',
                    radius: 20,
                },
            });

            const polygonMask = createImageObject({
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

            const noneMask = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'test.jpg',
                mask: {
                    shape: 'none',
                },
            });

            expect(roundedMask.mask).toEqual({ shape: 'rounded', radius: 20 });
            expect(polygonMask.mask).toEqual({
                shape: 'polygon',
                points: [
                    { x: 0, y: 0 },
                    { x: 50, y: 100 },
                    { x: 100, y: 0 },
                ],
            });
            expect(noneMask.mask).toEqual({ shape: 'none' });
        });
    });

    describe('ID generation', () => {
        it('should generate unique ids for different objects', () => {
            const text1 = createTextObject({
                x: 0,
                y: 0,
                width: 100,
                height: 50,
                content: 'Text 1',
            });
            const text2 = createTextObject({
                x: 0,
                y: 0,
                width: 100,
                height: 50,
                content: 'Text 2',
            });
            const image1 = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image1.jpg',
            });
            const image2 = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image2.jpg',
            });

            // Все ID должны быть уникальными
            const ids = [text1.id, text2.id, image1.id, image2.id];
            const uniqueIds = new Set(ids);

            expect(uniqueIds.size).toBe(4);
            expect(ids.length).toBe(4);
        });

        it('should use provided id instead of generating new one', () => {
            const customId = 'custom-id-123';
            const text = createTextObject({
                id: customId,
                x: 0,
                y: 0,
                width: 100,
                height: 50,
                content: 'Text',
            });

            expect(text.id).toBe(customId);
        });
    });

    describe('Test data factories', () => {
        describe('createMinimalText', () => {
            it('should create minimal text object', () => {
                const minimalText = createMinimalText();

                expect(minimalText).toMatchObject({
                    type: 'text',
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 50,
                    content: '',
                });

                // Проверяем дефолтные значения
                expect(minimalText.fontFamily).toBe('Arial');
                expect(minimalText.fontSize).toBe(16);
                expect(minimalText.color).toBe('#000000');
            });

            it('should allow overrides for minimal text', () => {
                const customText = createMinimalText({
                    content: 'Custom Content',
                    fontFamily: 'Custom Font',
                });

                expect(customText.content).toBe('Custom Content');
                expect(customText.fontFamily).toBe('Custom Font');
                expect(customText.x).toBe(0); // остальные параметры как в минимальном
            });
        });

        describe('createMinimalImage', () => {
            it('should create minimal image object', () => {
                const minimalImage = createMinimalImage();

                expect(minimalImage).toMatchObject({
                    type: 'image',
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    src: '',
                });

                // Проверяем дефолтные значения
                expect(minimalImage.preserveAspect).toBe(true);
                expect(minimalImage.fit).toBe('contain');
                expect(minimalImage.rotationOrigin).toBe('center');
            });

            it('should allow overrides for minimal image', () => {
                const customImage = createMinimalImage({
                    src: 'custom.jpg',
                    fit: 'cover' as const,
                });

                expect(customImage.src).toBe('custom.jpg');
                expect(customImage.fit).toBe('cover');
                expect(customImage.x).toBe(0);
            });
        });

        describe('createMaximalText', () => {
            it('should create maximal text object with all properties', () => {
                const maximalText = createMaximalText();

                expect(maximalText).toMatchObject({
                    type: 'text',
                    x: 10,
                    y: 10,
                    width: 300,
                    height: 100,
                    content: 'Full Text',
                    fontFamily: 'Times New Roman',
                    fontSize: 24,
                    color: '#ff0000',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    lineHeight: 1.5,
                    letterSpacing: 2,
                    locked: true,
                    visible: true,
                });

                // Проверяем стили
                expect(maximalText.style).toBeDefined();
                expect(maximalText.transform).toBeDefined();
            });

            it('should allow overrides for maximal text', () => {
                const customText = createMaximalText({
                    content: 'Overridden Content',
                    fontSize: 32,
                });

                expect(customText.content).toBe('Overridden Content');
                expect(customText.fontSize).toBe(32);
                // Проверяем что остальные свойства остались
                expect(customText.fontFamily).toBe('Times New Roman');
                expect(customText.fontWeight).toBe('bold');
            });
        });

        describe('createMaximalImage', () => {
            it('should create maximal image object with all properties', () => {
                const maximalImage = createMaximalImage();

                expect(maximalImage).toMatchObject({
                    type: 'image',
                    x: 50,
                    y: 50,
                    width: 400,
                    height: 300,
                    src: 'big-image.png',
                    preserveAspect: false,
                    fit: 'cover',
                });

                // Проверяем вложенные объекты
                expect(maximalImage.crop).toBeDefined();
                expect(maximalImage.filters).toBeDefined();
                expect(maximalImage.mask).toBeDefined();
                expect(maximalImage.style).toBeDefined();
                expect(maximalImage.transform).toBeDefined();
            });

            it('should apply default filters and crop correctly', () => {
                const maximalImage = createMaximalImage();

                expect(maximalImage.filters).toEqual({
                    brightness: 1.2,
                    contrast: 1.5,
                    blur: 2,
                    saturation: 1.3,
                    grayscale: 0.5,
                });

                expect(maximalImage.crop).toEqual({
                    x: 0,
                    y: 0,
                    width: 200,
                    height: 150,
                });
            });

            it('should allow overrides for maximal image', () => {
                const customImage = createMaximalImage({
                    src: 'overridden.jpg',
                    fit: 'contain' as const,
                });

                expect(customImage.src).toBe('overridden.jpg');
                expect(customImage.fit).toBe('contain');
                // Проверяем что остальные свойства остались
                expect(customImage.preserveAspect).toBe(false);
                expect(customImage.crop).toBeDefined();
            });
        });
    });
});
