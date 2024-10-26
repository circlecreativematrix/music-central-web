// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import '../../public/wasm_exec.js';

// Ensure Go is available in the global scope
var wasmMain = '/main.wasm'
var wasmChords ='/chords.wasm'
import '../wasmTypes.d.ts';

export const wasmBrowserInstantiate = async (wasmModuleUrl:string, importObject:any) => {
    let response = undefined;
  
    // Check if the browser supports streaming instantiation
    if (WebAssembly.instantiateStreaming) {
      // Fetch the module, and instantiate it as it is downloading
      response = await WebAssembly.instantiateStreaming(
        fetch(wasmModuleUrl),
        importObject
      );
    } else {
      // Fallback to using fetch to download the entire module
      // And then instantiate the module
      const fetchAndInstantiateTask = async () => {
        const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
          response.arrayBuffer()
        );
        return WebAssembly.instantiate(wasmArrayBuffer, importObject);
      };
  
      response = await fetchAndInstantiateTask();
    }
  
    return response;
  };

const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.
const goChord = new Go();
go.importObject.gojs["syscall/js.finalizeRef"] = (_: any) => 0;  // 😉
goChord.importObject.gojs["syscall/js.finalizeRef"] = (_: any) => 0
// https://github.com/tinygo-org/tinygo/issues/1140
// may need to switch back to regular go? slow memory leak
export const runWasmStandardNote = async (notesStandardYaml:string) => {
  // Get the importObject from the go instance.
  const importObject = go.importObject;

  // Instantiate our wasm module
 
  interface WindowType extends Window, Global {
    wasm: (yamlStrIn: string) => string;
  }
  const wasmModule = await wasmBrowserInstantiate(wasmMain, importObject);
  go.run(wasmModule.instance);
  const result = (window as unknown as WindowType).wasm(JSON.stringify(notesStandardYaml))
  return result
};

export const runWasmChordStandardNote = async (notesStandardYaml:string) => {
  // Get the importObject from the go instance.
  //const go = new Go();
  const importObject = goChord.importObject;

  // Instantiate our wasm module
  interface WindowType extends Window, Global {
    chordWasm: (yamlStrIn: string) => string;
  }
  // const { instance } = await WebAssembly.instantiateStreaming(
  //   fetch(filename),
  //   { env: { write } },
  // );
  const wasmModule = await wasmBrowserInstantiate(wasmChords, importObject);
  goChord.run(wasmModule.instance); // do i need another go instance to run this?
  const result = (window as unknown as WindowType).chordWasm(JSON.stringify(notesStandardYaml))
  return result
};
