import * as React from 'react';
import TitleEditor from '../components/TitleEditor/TitleEditor.tsx';
import { Toolbar } from '../components/ToolBar/Toolbar.tsx';
import SlideList from '../components/SlideList/SlideList.tsx';

function App() {
    const [title, setTitle] = React.useState<string>('My First Presentation');
    return (
        <div>
            <TitleEditor title={title} onChangeTitle={setTitle} />
            <Toolbar></Toolbar>
            <SlideList />
        </div>
    );
}

export default App;
