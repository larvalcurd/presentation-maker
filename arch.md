src/
├─ components/              # переиспользуемые базовые элементы (Button, ColorPicker, Modal, Toolbar, Icon и т.п.)
├─ features/                # функциональные блоки (Slides, Editor, History, Export)
│   ├─ slides/
│   │   ├─ SlidesPanel.jsx
│   │   ├─ SlidePreview.jsx
│   │   ├─ slidesSlice.js         # логика/состояние слайдов
│   │   └─ styles.css
│   ├─ editor/
│   │   ├─ Editor.jsx
│   │   ├─ Canvas.jsx
│   │   ├─ ObjectControls.jsx
│   │   ├─ editorSlice.js
│   │   └─ styles.css
│   ├─ history/
│   │   ├─ historySlice.js        # undo/redo
│   │   └─ useHistory.js
│   └─ export/
│       ├─ ExportButton.jsx
│       └─ exportToPDF.js
├─ pages/                   # экраны: EditorPage, HomePage
├─ hooks/                   # общие хуки (useKeyPress, useLocalStorage и т.д.)
├─ utils/                   # универсальные функции (deepClone, uuid, downloadFile)
├─ store/                   # централизованное хранилище (если используешь Redux/Zustand)
│   └─ index.js
├─ assets/                  # картинки, иконки, шрифты
├─ App.jsx
└─ main.jsx
