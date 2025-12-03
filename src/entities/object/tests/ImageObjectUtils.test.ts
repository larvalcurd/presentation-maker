import { describe, it, expect } from 'vitest';
import {
    updateImageSource,
    updateImageFit,
    updateImageFilters,
    updateImageCrop,
} from '../utils/ImageObjectUtils.ts';
import {
    createMinimalImage,
    createMaximalImage,
} from '../factory/ImageObjectFactory.ts';

describe('ImageObjectUtils', () => {
    describe('updateImageSource', () => {
        it('minimal: updates src and is immutable', () => {
            const original = createMinimalImage({ src: 'minimal.jpg' });
            const snapshot = { ...original };

            const updated = updateImageSource(original, 'new-minimal.jpg');

            expect(updated.src).toBe('new-minimal.jpg');
            expect(updated).not.toBe(original);
            // nested clones: transform exists on base, filters/crop undefined
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(updated.filters).toBeUndefined();
            expect(updated.crop).toBeUndefined();
            // original unchanged
            expect(original).toEqual(snapshot);
        });

        it('maximal: updates src and deep-copies nested objects', () => {
            const original = createMaximalImage();
            const snapshot = {
                ...original,
                transform: { ...original.transform },
                filters: { ...original.filters },
                crop: { ...original.crop },
            };

            const updated = updateImageSource(original, 'new-maximal.png');

            expect(updated.src).toBe('new-maximal.png');
            expect(updated).not.toBe(original);
            // nested clones are new references but equal in content
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(updated.filters).not.toBe(original.filters);
            expect(updated.filters).toEqual(original.filters);
            expect(updated.crop).not.toBe(original.crop);
            expect(updated.crop).toEqual(original.crop);
            // original unchanged
            expect(original).toEqual(snapshot);
        });
    });

    describe('updateImageFit', () => {
        it('minimal: updates fit and is immutable', () => {
            const original = createMinimalImage({ fit: 'contain' });
            const snapshot = { ...original };

            const updated = updateImageFit(original, 'cover');

            expect(updated.fit).toBe('cover');
            expect(updated).not.toBe(original);
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(original).toEqual(snapshot);
        });

        it('maximal: updates fit and deep-copies nested objects', () => {
            const original = createMaximalImage();
            const snapshot = {
                ...original,
                transform: { ...original.transform },
                filters: { ...original.filters },
                crop: { ...original.crop },
            };

            const updated = updateImageFit(original, 'fill');

            expect(updated.fit).toBe('fill');
            expect(updated).not.toBe(original);
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(updated.filters).not.toBe(original.filters);
            expect(updated.filters).toEqual(original.filters);
            expect(updated.crop).not.toBe(original.crop);
            expect(updated.crop).toEqual(original.crop);
            expect(original).toEqual(snapshot);
        });
    });

    describe('updateImageFilters', () => {
        it('minimal: applies filters and does not mutate original', () => {
            const original = createMinimalImage();
            const snapshot = { ...original };

            const patch = { brightness: 1.2, contrast: 0.9 };
            const updated = updateImageFilters(original, patch);

            // New behavior: when original has no filters, patch is merged into DEFAULT_FILTERS
            expect(updated.filters).toEqual({
                brightness: 1.2,
                contrast: 0.9,
                saturation: 1,
                blur: 0,
                grayscale: 0,
            });
            expect(updated).not.toBe(original);
            // transform should be deep-copied
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            // original unchanged
            expect(original).toEqual(snapshot);
        });

        it('maximal: merges into existing filters and is immutable', () => {
            const original = createMaximalImage({
                filters: {
                    brightness: 1.0,
                    contrast: 1.0,
                    saturation: 1.0,
                    blur: 0,
                    grayscale: 0,
                },
            });
            const snapshot = {
                ...original,
                transform: { ...original.transform },
                filters: { ...original.filters },
                crop: { ...original.crop },
            };

            const patch = { brightness: 1.8, saturation: 0.5 };
            const updated = updateImageFilters(original, patch);

            expect(updated.filters).toEqual({
                ...original.filters,
                ...patch,
            });
            expect(updated).not.toBe(original);
            expect(updated.filters).not.toBe(original.filters);
            // other nested props deep-copied
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(updated.crop).not.toBe(original.crop);
            expect(updated.crop).toEqual(original.crop);
            expect(original).toEqual(snapshot);
        });

        it('explicit undefined patch removes filters when original has filters', () => {
            const original = createMaximalImage();
            const snapshot = {
                ...original,
                transform: { ...original.transform },
                filters: original.filters ? { ...original.filters } : undefined,
                crop: original.crop ? { ...original.crop } : undefined,
            };

            const updated = updateImageFilters(original, undefined);

            expect(updated.filters).toBeUndefined();
            expect(updated).not.toBe(original);
            // nested clones still created
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(updated.crop).not.toBe(original.crop);
            expect(updated.crop).toEqual(original.crop);
            // original unchanged
            expect(original).toEqual(snapshot);
        });

        it('explicit undefined patch on minimal (no original filters) results in undefined filters and clones nested', () => {
            const original = createMinimalImage();
            const snapshot = { ...original };

            const updated = updateImageFilters(original, undefined);

            expect(updated.filters).toBeUndefined();
            expect(updated).not.toBe(original);
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(original).toEqual(snapshot);
        });
    });

    describe('updateImageCrop', () => {
        it('minimal: sets crop and is immutable', () => {
            const original = createMinimalImage();
            const snapshot = { ...original };

            const newCrop = { x: 5, y: 5, width: 90, height: 90 };
            const updated = updateImageCrop(original, newCrop);

            expect(updated.crop).toEqual(newCrop);
            expect(updated).not.toBe(original);
            expect(updated.crop).not.toBe(original.crop);
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(original).toEqual(snapshot);
        });

        it('maximal: replaces crop and preserves immutability', () => {
            const original = createMaximalImage({
                crop: { x: 10, y: 10, width: 200, height: 150 },
            });
            const snapshot = {
                ...original,
                transform: { ...original.transform },
                filters: { ...original.filters },
                crop: { ...original.crop },
            };

            const newCrop = { x: 20, y: 20, width: 100, height: 80 };
            const updated = updateImageCrop(original, newCrop);

            expect(updated.crop).toEqual(newCrop);
            expect(updated).not.toBe(original);
            expect(updated.crop).not.toBe(original.crop);
            // ensure other nested objects cloned
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(updated.filters).not.toBe(original.filters);
            expect(updated.filters).toEqual(original.filters);
            expect(original).toEqual(snapshot);
        });

        it('passing undefined removes crop when original had crop', () => {
            const original = createMaximalImage({
                crop: { x: 10, y: 10, width: 200, height: 150 },
            });
            const snapshot = {
                ...original,
                transform: { ...original.transform },
                filters: original.filters ? { ...original.filters } : undefined,
                crop: original.crop ? { ...original.crop } : undefined,
            };

            const updated = updateImageCrop(original, undefined);

            expect(updated.crop).toBeUndefined();
            expect(updated).not.toBe(original);
            expect(updated.transform).not.toBe(original.transform);
            expect(updated.transform).toEqual(original.transform);
            expect(updated.filters).not.toBe(original.filters);
            expect(updated.filters).toEqual(original.filters);
            expect(original).toEqual(snapshot);
        });
    });
});
