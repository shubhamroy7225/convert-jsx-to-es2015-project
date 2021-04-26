import * as esbuild from "esbuild-wasm"
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from "./plugin/unpkg-path-plugin";

const App = () => {
    const ref:any = useRef()
    const [code,setCode] = useState('')
    const [input,setInput] = useState('')
    const startService = async ()=>{
        ref.current = await esbuild.startService({
            worker:true,
            wasmURL:"/esbuild.wasm"
        });
       
    }
    useEffect(()=>{
        startService()
    },[])

    const onClickHandler = async()=>{
        if(!ref.current){
            return;
        }
//this is for transform the code.
    //    const result = await ref.current.transform(input,{
    //        loader:'jsx',
    //        target:'es2015'
    //    });

    //this is for bundeled the code.
    const result = await ref.current.build({
        entryPoints:['index.js'],
        bundle:true,
        write:false,
        plugins:[unpkgPathPlugin()]
    })
       setCode(result.outputFiles[0].text)
    }
    return (
        <div>
            <textarea value={input} onChange={(e)=>setInput(e.target.value)}></textarea>
            <div>
                <button onClick={onClickHandler}>Submit</button>
            </div>
            <pre>{code}</pre>
        </div>
    );
};

ReactDOM.render(<App />,document.querySelector("#root"))