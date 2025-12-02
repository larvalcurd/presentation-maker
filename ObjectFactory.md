# Ключевые типы (`src/entities/object/types/ObjectTypes.ts`)
- **BaseObject** — общие поля: `id`, `x`, `y`, `zIndex`, `width`, `height`, опционально `style`, `transform`.
- **TextObject** — `BaseObject + type: 'text'` и текстовые поля (`content`, `fontFamily`, `fontSize`, `color` и т.д.).
- **ImageObject** — `BaseObject + type: 'image'` и поля изображения (`src`, `fit`, `crop`, `filters`, `mask`, `rotationOrigin`).
- **Вложенные типы**: `ObjectStyle`, `ObjectShadow`, `ObjectTransform`, `ImageCrop`, `ImageFilters`, `ImageMask`.

# Дефолты (`src/entities/object/factory/defaults.ts`)
- `DEFAULT_STYLE`, `DEFAULT_TRANSFORM`, `DEFAULT_FILTERS`, `DEFAULT_CROP`, `DEFAULT_BASE`.
- В `DEFAULT_BASE` вложенные `style` и `transform` уже клонированы (`{ ...DEFAULT_STYLE }`), т.е. дефолты заданы как реальные значения для новых объектов.

# Хелперы и их семантика (`src/entities/object/factory/helpers.ts`)
## Мелкие утилиты
- `hasOwnProp` — проверка, есть ли собственное поле у объекта (важно при применении патчей).
- `shallowClone` — поверхностное клонирование вложенного объекта или `undefined`.
- `mergeWithDefaults` / `mergeWithDefaultsOptional` — применяют дефолты к частичным значениям.
- `assignIfHasOwn` — присваивает скалярные поля если они присутствуют в патче (чтобы отличать «нет ключа в патче» и «ключ явно = undefined»).

## `mergeNestedWithPatch<T>(original, patch, defaults)`
- **Поведение:**
    - `patch === undefined` → явное удаление → вернуть `undefined`.
    - `original === undefined && patch !== undefined` → собрать из `{ ...defaults, ...patch }` (создание из дефолтов).
    - `original !== undefined && patch !== undefined` → сохранить поля `original`, поверх наложить `patch` (`{ ...original, ...patch }`).
- **Назначение:** корректная работа редактора; частичный патч не сбрасывает остальные значения.

## Style helpers
- `cloneStyle` — глубокая копия `style`, копирует `shadow` при наличии.
- `mergeStyleWithDefaults` — строит полноценный `ObjectStyle`, применяя дефолт для `shadow`.

## Transform helpers
- `cloneTransform`, `mergeTransformWithDefaults`.

## Filters
- `cloneFilters`, `mergeFiltersWithDefaults`.
- `mergePartialFiltersSafe(original, patch)` — особая семантика:
    - `patch === undefined` → `undefined`.
    - `original === undefined && patch !== undefined` → вернуть поверхностную копию `patch` (не применять `DEFAULT_FILTERS`).
    - `original !== undefined && patch !== undefined` → `{ ...original, ...patch }`.
- **Назначение:** если изначально нет фильтров, патч не подставляет все дефолты.

## Crop/Mask
- `cloneCrop`, `mergeCropWithDefaults`, `cloneMask` (копия точек для mask).

## `deepCloneNestedBase`
- Клонирует `BaseObject` вместе с вложенными полями (`style`, `transform`) и для `type === 'image'` клонирует `crop`, `filters`, `mask`.

# applyPatch (логика применения патчей)
## `applyPatchBase(original, patch)`
- Обрабатывает `style` и `transform` через `mergeNestedWithPatch`.
- Копирует скалярные поля (`id`, `x`, `y`, `zIndex`, `width`, `height`, `locked`, `visible`) только если они явно присутствуют в патче.

## `applyPatch` (overloads)
- **Для `image`:**
    - Копирует базу, присваивает простые поля через `assignIfHasOwn`.
    - `crop` → `mergeNestedWithPatch(orig.crop, p.crop, DEFAULT_CROP)`.
    - `filters` → `mergePartialFiltersSafe(orig.filters, p.filters)`.
    - `mask` → клонирует переданное значение или удаляет, иначе клонирует оригинал.
- **Для `text`:**
    - Копирует базу, применяет текстовые скалярные поля через `assignIfHasOwn`.

**Смысл:** при частичных патчах вложенные объекты не теряются; special-case для `filters`.

# Фабрики: как создаются объекты
## BaseObjectFactory
- `createBaseObject(params)`:
    - Берёт `DEFAULT_BASE`, потом `params`, ставит `id` через `nanoid`.
    - Вложенные `style` и `transform` всегда клонируются (`cloneStyle`, `cloneTransform`) — нет шаринга ссылок.
    - Фабрика не применяет частичные вложенные входы; это делают `applyPatch` и другие фабрики.

## TextObjectFactory
- `createTextObject(params)`:
    - Создаёт `original` с локальными дефолтами.
    - Если есть `style`/`transform` в `params` → вызывает `applyPatch` для корректного мерджа (`mergeNestedWithPatch`).
- `createMinimalText` / `createMaximalText` — хелперы для создания минимального/максимального объекта с возможностью overrides.

## ImageObjectFactory
- `createImageObject(params)`:
    - Заполняет `crop` и `filters` через `DEFAULT_CROP` / `DEFAULT_FILTERS`.
    - При наличии `style`/`transform` → `applyPatch`.
- `createMinimalImage` / `createMaximalImage` — аналогично, полный набор полей, включая максимальные фильтры.

# Утилиты (`src/entities/object/utils/*`)
- **ObjectUtils** — иммутабельные операции `moveObject`, `resizeObject`.
- **ImageObjectUtils**:
    - `updateImageSource`, `updateImageFit`, `updateImageFilters`, `updateImageCrop`.
    - Используют `deepCloneNestedBase` и `mergePartialFiltersSafe`.
- **TextObjectUtils**:
    - Копирует `style`/`transform` перед изменениями (`cloneStyle`/`cloneTransform`).
    - Обновляет текстовые поля без мутаций оригинала.

# Почему тесты падали
- `mergeNestedWithPatch` игнорировал `original` → частичные патчи сбрасывали поля к дефолтам.
- Фильтры: тесты ожидали подстановку всех `DEFAULT_FILTERS`, а семантика сейчас — только patch.

# Правильная семантика патчей (рекомендуемая)
- `patch === undefined` → удалить поле (`undefined`).
- `patch есть + original есть` → мердж в оригинал (`{ ...original, ...patch }`).
- `patch есть + original нет` → собрать из дефолтов (`{ ...defaults, ...patch }`).
- Исключение `filters` → если нет оригинала, вернуть только поля патча.

# Рекомендации по тестам
- Проверять `mergeNestedWithPatch` для всех комбинаций original/patch.
- Покрыть `mergePartialFiltersSafe`.
- Проверка явного удаления вложенных полей.
- Проверка иммутабельности.
- Интеграционные сценарии: `createMaximal` + частичный patch → сохраняются незатронутые поля.
- При необходимости изменить семантику фильтров — согласовать с тестами.

# Короткое резюме по фабрике объектов
- Фабрика строит «оригинал» с дефолтами.
- Частичные патчи применяются через `applyPatch`.
- Централизованная логика, консистентность, иммутабельность.
- Основная идея: фабрика создаёт полный объект, частичные правки через `applyPatch` → предсказуемо и тестируемо.
