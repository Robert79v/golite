import React from 'react';
import { Editor } from '@monaco-editor/react';

const CodeEditor = ({ code, setCode }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <Editor
                height="60vh"
                language="go"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')} // Maneja el caso cuando el editor está vacío
                options={{
                    fontSize: 14,
                    minimap: { enabled: false }, // Desactiva el minimapa si no lo necesitas
                }}
            />
        </div>
    );
};

export default CodeEditor;
