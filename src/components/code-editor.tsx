import 'bulmaswatch/superhero/bulmaswatch.min.css'
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier"
import parser from "prettier/parser-babel"
import { useRef } from "react";
import CodeShift from 'jscodeshift'
import Highlighter from "monaco-jsx-highlighter"
import "./code-editor.css";
import "./syntax.css";
interface   CodeEditorProps{
    initialValue:string;
    onChange(value:string):void;
}
const CodeEditor:React.FC<CodeEditorProps> = ({ onChange, initialValue}) => {
    const editorRef = useRef<any>()
    const editorDidMount: EditorDidMount = (getValue, monacoEditor)=>{
        editorRef.current = monacoEditor
        monacoEditor.onDidChangeModelContent(()=>{
           onChange(getValue());
        })
        monacoEditor.getModel()?.updateOptions({
            tabSize:2
        })
        const highlighter = new Highlighter(
            //@ts-ignore
            window.monaco,
            CodeShift,
            monacoEditor,

        )
        highlighter.highLightOnDidChangeModelContent(
            ()=>{},
            ()=>{},
            undefined,
            ()=>{},
        )
    }

    const setAutomaticFomate =()=>{
   
        //get current value form editor
        const unformatCode = editorRef.current.getModel().getValue()
        //format that value
        const formatedCode = prettier.format(unformatCode,{
            parser:'babel',
            plugins:[parser],
            useTabs:false,
            semi:true,
            singleQuote:true,
        }).replace(/\n$/,'' )

        //set the formated value back in the editor
        editorRef.current.setValue(formatedCode)
        

    }
  return (
  <div className="editor-wrapper">
      <button className="button button-format is-primary is-small" onClick={setAutomaticFomate}>Formate</button>
  <MonacoEditor
  editorDidMount={editorDidMount}
  value={initialValue}
   theme="dark"
    language="javascript"
     height="500px"
     options={{
         wordWrap:'on',
         minimap:{enabled:false},
         showUnused:false,
         folding:false,
         lineNumbersMinChars:3,
         fontSize:16,
         scrollBeyondLastLine:false,
         automaticLayout:true,
     }}
     />
     </div>);
};
export default CodeEditor;
