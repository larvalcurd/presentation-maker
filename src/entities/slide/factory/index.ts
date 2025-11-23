// Main factory
export { createSlide } from './createSlide.ts';

// Background factories
export {
    createColorBackground,
    createImageBackground,
    createGradientBackground,
} from './backgroundFactory.ts';

// Transition factory
export { createSlideTransition } from './transitionFactory.ts';

// Preset slides
export {
    createTitleSlide,
    createImageSlide,
    createBlankSlide,
} from './presetSlides.ts';

// Test factories
export { createMinimalSlide, createMaximalSlide } from './testSlides.ts';

// Utilities
export { validateSlide, duplicateSlide } from './utils.ts';

// Defaults
export {
    defaultSlide,
    defaultBackground,
    defaultTransition,
} from './defaults.ts';
