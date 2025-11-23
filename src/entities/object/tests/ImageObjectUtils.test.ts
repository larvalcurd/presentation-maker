// ImageObjectUtils.test.ts
import { describe, it, expect } from 'vitest';
import { createImageObject } from '../factory/ObjectFactory.ts';
import {
    updateImageSource,
    updateImageFit,
    updateImageFilters,
    updateImageCrop,
} from '../utils/ImageObjectUtils.ts';
import type { ImageObject } from '../types/ObjectTypes.ts';

describe('ImageObjectUtils', () => {
    // Базовые тесты для каждой функции
    describe('Basic functionality', () => {
        it('should update image source without mutating original', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'old-image.jpg',
            });

            const originalSrc = imageObj.src;
            const originalSnapshot = { ...imageObj };

            const updated = updateImageSource(imageObj, 'new-image.jpg');

            expect(updated.src).toBe('new-image.jpg');
            expect(updated).toEqual({
                ...imageObj,
                src: 'new-image.jpg',
            });

            expect(imageObj.src).toBe(originalSrc);
            expect(imageObj).toEqual(originalSnapshot);
            expect(updated).not.toBe(imageObj);
        });

        it('should update image fit without mutating original', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                fit: 'contain',
            });

            const originalFit = imageObj.fit;
            const originalSnapshot = { ...imageObj };

            const updated = updateImageFit(imageObj, 'cover');

            expect(updated.fit).toBe('cover');
            expect(updated).toEqual({
                ...imageObj,
                fit: 'cover',
            });

            expect(imageObj.fit).toBe(originalFit);
            expect(imageObj).toEqual(originalSnapshot);
            expect(updated).not.toBe(imageObj);
        });

        it('should update image filters without mutating original', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                filters: {
                    brightness: 1.0,
                    contrast: 1.0,
                },
            });

            const originalFilters = { ...imageObj.filters };
            const originalSnapshot = { ...imageObj };

            const newFilters = {
                brightness: 1.5,
                saturation: 0.8,
                blur: 2,
            };

            const updated = updateImageFilters(imageObj, newFilters);

            // Ожидаем полный объект фильтров с дефолтами
            expect(updated.filters).toEqual({
                brightness: 1.5,
                contrast: 1.0,
                saturation: 0.8,
                blur: 2,
                grayscale: 0, // дефолтное значение
            });

            expect(imageObj.filters).toEqual(originalFilters);
            expect(imageObj).toEqual(originalSnapshot);
            expect(updated).not.toBe(imageObj);
            expect(updated.filters).not.toBe(imageObj.filters);
        });

        it('should update image crop without mutating original', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                crop: {
                    x: 10,
                    y: 10,
                    width: 80,
                    height: 80,
                },
            });

            const originalCrop = { ...imageObj.crop };
            const originalSnapshot = { ...imageObj };

            const newCrop = {
                x: 20,
                y: 20,
                width: 60,
                height: 60,
            };

            const updated = updateImageCrop(imageObj, newCrop);

            expect(updated.crop).toEqual(newCrop);
            expect(updated).toEqual({
                ...imageObj,
                crop: newCrop,
            });

            expect(imageObj.crop).toEqual(originalCrop);
            expect(imageObj).toEqual(originalSnapshot);
            expect(updated).not.toBe(imageObj);
            expect(updated.crop).not.toBe(imageObj.crop);
        });

        it('should handle undefined filters correctly', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                // filters не определены
            });

            const updated = updateImageFilters(imageObj, {
                brightness: 1.2,
                contrast: 0.9,
            });

            expect(updated.filters).toEqual({
                brightness: 1.2,
                contrast: 0.9,
            });
            expect(imageObj.filters).toBeUndefined();
        });

        it('should handle undefined crop correctly', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                // crop не определен
            });

            const newCrop = {
                x: 10,
                y: 10,
                width: 80,
                height: 80,
            };

            const updated = updateImageCrop(imageObj, newCrop);

            expect(updated.crop).toEqual(newCrop);
            expect(imageObj.crop).toBeUndefined();
        });
    });

    // НОВЫЕ ТЕСТЫ ДЛЯ ПРОВЕРКИ ГЛУБОКОГО КОПИРОВАНИЯ
    describe('Deep copying functionality', () => {
        it('should not share nested object references after updateImageSource', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                transform: {
                    rotate: 45,
                    scaleX: 1.2,
                    scaleY: 0.8,
                    opacity: 0.9,
                },
                filters: {
                    brightness: 1.5,
                    contrast: 0.8,
                },
                crop: {
                    x: 10,
                    y: 10,
                    width: 80,
                    height: 80,
                },
            });

            const updated = updateImageSource(imageObj, 'new-image.jpg');

            // Проверяем что вложенные объекты тоже новые
            expect(updated.transform).not.toBe(imageObj.transform);
            expect(updated.filters).not.toBe(imageObj.filters);
            expect(updated.crop).not.toBe(imageObj.crop);

            // Проверяем что содержимое одинаковое
            expect(updated.transform).toEqual(imageObj.transform);
            expect(updated.filters).toEqual(imageObj.filters);
            expect(updated.crop).toEqual(imageObj.crop);
        });

        it('should not share nested object references after updateImageFit', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                transform: {
                    rotate: 30,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    opacity: 1.0,
                },
                filters: {
                    saturation: 1.2,
                    blur: 1,
                },
            });

            const updated = updateImageFit(imageObj, 'cover');

            expect(updated.transform).not.toBe(imageObj.transform);
            expect(updated.filters).not.toBe(imageObj.filters);
            expect(updated.transform).toEqual(imageObj.transform);
            expect(updated.filters).toEqual(imageObj.filters);
        });

        it('should not share nested object references after updateImageFilters', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                transform: {
                    rotate: 15,
                    scaleX: 1.0,
                    scaleY: 1.0,
                    opacity: 0.8,
                },
                crop: {
                    x: 5,
                    y: 5,
                    width: 90,
                    height: 90,
                },
            });

            const updated = updateImageFilters(imageObj, { brightness: 1.3 });

            expect(updated.transform).not.toBe(imageObj.transform);
            expect(updated.crop).not.toBe(imageObj.crop);
            expect(updated.transform).toEqual(imageObj.transform);
            expect(updated.crop).toEqual(imageObj.crop);
        });

        it('should not share nested object references after updateImageCrop', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                transform: {
                    rotate: 10,
                    scaleX: 1.0,
                    scaleY: 1.0,
                    opacity: 1.0,
                },
                filters: {
                    contrast: 1.1,
                    grayscale: 0.2,
                },
            });

            const newCrop = {
                x: 15,
                y: 15,
                width: 70,
                height: 70,
            };

            const updated = updateImageCrop(imageObj, newCrop);

            expect(updated.transform).not.toBe(imageObj.transform);
            expect(updated.filters).not.toBe(imageObj.filters);
            expect(updated.transform).toEqual(imageObj.transform);
            expect(updated.filters).toEqual(imageObj.filters);
        });

        // ImageObjectUtils.test.ts
        // ... предыдущий код ...

        describe('Deep copying functionality', () => {
            // ... другие тесты ...

            it('should handle undefined transform, filters, and crop in copyNested', () => {
                const imageObj = createImageObject({
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    src: 'image.jpg',
                    // transform, filters, crop не определены явно
                });

                // ВАЖНО: createImageObject всегда устанавливает transform по умолчанию через createBaseObject
                // Поэтому transform будет определен, а filters и crop могут быть undefined

                expect(imageObj.transform).toBeDefined(); // transform всегда есть
                expect(imageObj.filters).toBeUndefined(); // filters может быть undefined
                expect(imageObj.crop).toBeUndefined(); // crop может быть undefined

                // Все функции должны корректно обработать undefined для filters и crop
                const updated1 = updateImageSource(imageObj, 'new-src.jpg');
                const updated2 = updateImageFit(imageObj, 'fill');
                const updated3 = updateImageFilters(imageObj, {
                    brightness: 1.2,
                });
                const updated4 = updateImageCrop(imageObj, {
                    x: 10,
                    y: 10,
                    width: 80,
                    height: 80,
                });

                // Проверяем updateImageSource
                expect(updated1.transform).toBeDefined();
                expect(updated1.transform).not.toBe(imageObj.transform); // глубокое копирование
                expect(updated1.filters).toBeUndefined();
                expect(updated1.crop).toBeUndefined();

                // Проверяем updateImageFit
                expect(updated2.transform).toBeDefined();
                expect(updated2.transform).not.toBe(imageObj.transform);
                expect(updated2.filters).toBeUndefined();
                expect(updated2.crop).toBeUndefined();

                // Проверяем updateImageFilters
                expect(updated3.transform).toBeDefined();
                expect(updated3.transform).not.toBe(imageObj.transform);
                expect(updated3.filters).toEqual({ brightness: 1.2 });
                expect(updated3.crop).toBeUndefined();

                // Проверяем updateImageCrop
                expect(updated4.transform).toBeDefined();
                expect(updated4.transform).not.toBe(imageObj.transform);
                expect(updated4.filters).toBeUndefined();
                expect(updated4.crop).toEqual({
                    x: 10,
                    y: 10,
                    width: 80,
                    height: 80,
                });
            });

            // Дополнительный тест для проверки случая, когда transform действительно undefined
            it('should handle truly undefined transform when manually set', () => {
                // Создаем объект с явно undefined transform
                const imageObj: ImageObject = {
                    id: 'test-id',
                    type: 'image',
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    src: 'image.jpg',
                    zIndex: 0,
                    locked: false,
                    visible: true,
                    style: {
                        borderRadius: 0,
                        borderColor: '#00000000',
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                    },
                    transform: undefined, // Явно устанавливаем undefined
                    filters: undefined,
                    crop: undefined,
                    preserveAspect: true,
                    fit: 'contain',
                    rotationOrigin: 'center',
                };

                const updated = updateImageSource(imageObj, 'new-image.jpg');

                // Проверяем что transform остался undefined и не сломал копирование
                expect(updated.transform).toBeUndefined();
                expect(updated.filters).toBeUndefined();
                expect(updated.crop).toBeUndefined();
                expect(updated.src).toBe('new-image.jpg');
            });
        });

        // ... остальной код тестов ...
    });

    // Тесты с максимальными данными
    describe('Maximum data scenarios', () => {
        it('should update all image properties in sequence with deep copying', () => {
            let imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 200,
                height: 150,
                src: 'original.jpg',
                fit: 'contain',
                transform: {
                    rotate: 10,
                    scaleX: 1.0,
                    scaleY: 1.0,
                    opacity: 1.0,
                },
                filters: {
                    brightness: 1.0,
                },
                crop: {
                    x: 5,
                    y: 5,
                    width: 190,
                    height: 140,
                },
            });

            const originalId = imageObj.id;
            const originalTransform = imageObj.transform;
            const originalFilters = imageObj.filters;
            const originalCrop = imageObj.crop;

            // Последовательные обновления
            imageObj = updateImageSource(imageObj, 'updated.jpg');
            imageObj = updateImageFit(imageObj, 'cover');
            imageObj = updateImageFilters(imageObj, {
                brightness: 1.5,
                contrast: 0.9,
            });
            imageObj = updateImageCrop(imageObj, {
                x: 10,
                y: 10,
                width: 180,
                height: 130,
            });

            // Проверяем конечное состояние
            expect(imageObj.src).toBe('updated.jpg');
            expect(imageObj.fit).toBe('cover');

            // Ожидаем полный объект фильтров с дефолтами
            expect(imageObj.filters).toEqual({
                brightness: 1.5,
                contrast: 0.9,
                saturation: 1, // дефолтное значение
                blur: 0, // дефолтное значение
                grayscale: 0, // дефолтное значение
            });

            expect(imageObj.crop).toEqual({
                x: 10,
                y: 10,
                width: 180,
                height: 130,
            });

            // ID должен остаться прежним
            expect(imageObj.id).toBe(originalId);

            // Проверяем что оригинальные вложенные объекты не изменились
            expect(originalTransform).toEqual({
                rotate: 10,
                scaleX: 1.0,
                scaleY: 1.0,
                opacity: 1.0,
            });

            // Оригинальные фильтры тоже содержат дефолты
            expect(originalFilters).toEqual({
                brightness: 1.0,
                contrast: 1,
                saturation: 1,
                blur: 0,
                grayscale: 0,
            });

            expect(originalCrop).toEqual({
                x: 5,
                y: 5,
                width: 190,
                height: 140,
            });
        });

        it('should handle complex filter updates with deep copying', () => {
            const imageObj = createImageObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                src: 'image.jpg',
                filters: {
                    brightness: 1.0,
                    contrast: 1.0,
                    saturation: 1.0,
                    blur: 0,
                    grayscale: 0,
                },
            });

            const originalFilters = { ...imageObj.filters };

            // Частичное обновление фильтров
            const updated1 = updateImageFilters(imageObj, {
                brightness: 1.8,
                saturation: 0.5,
            });
            expect(updated1.filters).toEqual({
                brightness: 1.8,
                contrast: 1.0,
                saturation: 0.5,
                blur: 0,
                grayscale: 0,
            });

            // Проверяем что оригинальные фильтры не изменились
            expect(imageObj.filters).toEqual(originalFilters);
            expect(updated1.filters).not.toBe(imageObj.filters);

            // Обновление до одного фильтра
            const updated2 = updateImageFilters(updated1, { grayscale: 1.0 });
            expect(updated2.filters).toEqual({
                brightness: 1.8,
                contrast: 1.0,
                saturation: 0.5,
                blur: 0,
                grayscale: 1.0,
            });

            // Сброс некоторых фильтров
            const updated3 = updateImageFilters(updated2, {
                brightness: 1.0,
                saturation: 1.0,
            });
            expect(updated3.filters).toEqual({
                brightness: 1.0,
                contrast: 1.0,
                saturation: 1.0,
                blur: 0,
                grayscale: 1.0,
            });
        });

        it('should preserve all non-image properties during updates with deep copying', () => {
            const original = createImageObject({
                x: 25,
                y: 75,
                width: 150,
                height: 125,
                src: 'original.jpg',
                zIndex: 8,
                locked: false,
                visible: true,
                preserveAspect: true,
                mask: {
                    shape: 'circle',
                    radius: 50,
                },
                rotationOrigin: 'center',
                style: {
                    borderRadius: 10,
                    borderWidth: 2,
                    backgroundColor: '#FFFFFF',
                },
                transform: {
                    rotate: 30,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    opacity: 0.9,
                },
                filters: {
                    brightness: 1.2,
                },
                crop: {
                    x: 10,
                    y: 10,
                    width: 130,
                    height: 105,
                },
            });

            const originalTransform = original.transform;
            const originalFilters = original.filters;
            const originalCrop = original.crop;

            const updated = updateImageSource(original, 'updated.jpg');

            // Проверяем что неизменяемые свойства сохранились
            expect(updated.x).toBe(original.x);
            expect(updated.y).toBe(original.y);
            expect(updated.width).toBe(original.width);
            expect(updated.height).toBe(original.height);
            expect(updated.zIndex).toBe(original.zIndex);
            expect(updated.locked).toBe(original.locked);
            expect(updated.visible).toBe(original.visible);
            expect(updated.preserveAspect).toBe(original.preserveAspect);
            expect(updated.mask).toEqual(original.mask);
            expect(updated.rotationOrigin).toBe(original.rotationOrigin);
            expect(updated.style).toEqual(original.style);
            expect(updated.transform).toEqual(original.transform);
            expect(updated.filters).toEqual(original.filters);
            expect(updated.crop).toEqual(original.crop);
            expect(updated.type).toBe(original.type);

            // Проверяем глубокое копирование
            expect(updated.transform).not.toBe(originalTransform);
            expect(updated.filters).not.toBe(originalFilters);
            expect(updated.crop).not.toBe(originalCrop);
        });
    });
});
