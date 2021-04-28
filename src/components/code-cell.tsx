import { useEffect, useState } from "react";
import CodeEditor from "./code-editor";
import Bundle from "../bundler/index";
import Preview from "./preview";
import Resizable from "./resizable";
import { ResizableBox } from "react-resizable";

const CodeCell = () => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [input, setInput] = useState("");

  useEffect(()=>{
    const timer = setTimeout(async()=>{
      const output = await Bundle(input);
      setCode(output.code);
      setErr(output.err)
    },1000)
    return ()=>{
      clearTimeout(timer)
    }
  },[input])
  return (
      <Resizable direction='vertical'>
    <div style={{
        height:'100%',
        display:'flex',
        flexDirection:'row'

    }}>
        <Resizable direction='horizontal'>
      <CodeEditor
        initialValue="const a=1;"
        onChange={(value) => setInput(value)}
      />
      </Resizable>
      <div>
        {/* <button onClick={onClickHandler}>Submit</button> */}
      </div>
      <Preview code={code} err={err}/>
    </div>
    </Resizable>
  );
};

export default CodeCell