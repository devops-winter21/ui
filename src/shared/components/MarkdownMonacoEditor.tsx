// Libraries
import React, {FC} from 'react'

// Components
import MonacoEditor from 'react-monaco-editor'

// Utils
import LANGID from 'src/external/monaco.markdown.syntax'
import THEME_NAME from 'src/external/monaco.flux.theme'
import {registerAutogrow} from 'src/external/monaco.autogrow'

// Types
import {EditorType} from 'src/types'

import './FluxMonacoEditor.scss'

import {EditorProps} from 'src/shared/components/FluxMonacoEditor'

const MarkdownMonacoEditor: FC<EditorProps> = ({
  script,
  onChangeScript,
  autogrow,
  autofocus,
}) => {
  const editorDidMount = (editor: EditorType) => {
    if (autogrow) {
      registerAutogrow(editor)
    }

    if (autofocus) {
      const model = editor.getModel()
      editor.setPosition({
        lineNumber: model.getLineCount(),
        column: model.getLineLength(model.getLineCount()) + 1,
      })
      editor.focus()
    }
  }

  const onChange = (text: string) => {
    onChangeScript(text)
  }

  return (
    <div className="markdown-editor--monaco" data-testid="markdown-editor">
      <MonacoEditor
        language={LANGID}
        theme={THEME_NAME}
        value={script}
        onChange={onChange}
        options={{
          fontSize: 13,
          fontFamily: '"IBMPlexMono", monospace',
          cursorWidth: 2,
          lineNumbersMinChars: 4,
          lineDecorationsWidth: 0,
          minimap: {
            renderCharacters: false,
          },
          contextmenu: false,
          overviewRulerBorder: false,
          automaticLayout: true,
        }}
        editorDidMount={editorDidMount}
      />
    </div>
  )
}

export default MarkdownMonacoEditor
