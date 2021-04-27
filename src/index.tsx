import * as esbuild from "esbuild-wasm";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import CodeEditor from "./components/code-editor";
import { fetchPLugin } from "./plugin/fetch-plugin";
import { unpkgPathPlugin } from "./plugin/unpkg-path-plugin";

const App = () => {
  const ref: any = useRef();
  const iframe = useRef<any>();
  // const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL:"https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm"
      //wasmURL: "/esbuild.wasm",
    });
  };
  useEffect(() => {
    startService();
  }, []);

 

  const onClickHandler = async () => {
    if (!ref.current) {
      return;
    }

    iframe.current.srcdoc = html
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPLugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });
    // setCode(result.outputFiles[0].text);
    // eval(result.outputFiles[0].text)

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text,'*')

  };

  const html = 
  `
  <html>
    <head></head>
    <body>
    <div id="root"></div>
    <script>
    window.addEventListener('message',(event)=>{
      try{
        eval(event.data)
      }catch(err){
        const root = document.querySelector('#root');
        root.innerHTML='<div style="color:red"><h4>Runtime Error</h4>' + err + '</div>'
        console.error(err);
      }
    },false )
    </script>
    </body>
  </html>
  `


  return (
    <div>
      <CodeEditor initialValue='const a=1;' onChange={(value)=>setInput(value)} />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClickHandler}>Submit</button>
      </div>
      {/* <pre>{code}</pre> */}
      <iframe title="code preview" ref={iframe} sandbox='allow-scripts' srcDoc={html} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
