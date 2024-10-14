import { useEffect, useState } from 'react'
import YAML from 'js-yaml'
import pino from 'pino'
const logger = pino({
  browser: {
    asObject: false, // Log as objects for easier parsing
  }
});
import './App.css'
import { nbefSongToMidi, midiPlay, midiToBase64Save } from './services/MidiFileOut'
import { runWasmAdd } from './services/Wasm'

function btnHandlerConvert(standardText: string, SetPlayer: (arg0: any) => void, SetFileOut: (arg0: string) => void) {
    runWasmAdd(standardText).then((res)=>{
      // error handling?
        const nbefYamlObj = YAML.load(res)
        const smf =  nbefSongToMidi(nbefYamlObj, 96, logger)
        SetPlayer(midiPlay(smf, logger))
        SetFileOut(midiToBase64Save(smf.dump()))
        console.log("alldone!")
      })
  }

function App() {
  const [fileOut, SetFileOut] = useState("")
 // const [wasmOut, SetWasmOut] = useState("")
  const [player, SetPlayer] = useState(undefined)
  const [standardText, SetStandardText] = useState("")
  useEffect(()=>{
   

  },[])
  return (
    <>
    <div>
      <h1>Wasm Midi</h1>
      <textarea value={standardText} onChange={(e)=>SetStandardText(e.target.value)}></textarea>
      <button onClick={()=>btnHandlerConvert(standardText, SetPlayer, SetFileOut) }>Convert</button>
      
      <button onClick={()=> {
        if(player){
          (player as any).stop();
          }}}>Stop</button>
    </div>
      <div>
        <a href={fileOut} download="nameOfDownload.mid" target="_blank">
          Click the logo to download the midi file
          <img src="https://opensource.org/wp-content/uploads/2009/06/OSI_Standard_Logo_0.svg" className="logo" alt="Vite logo" />
        </a>

      </div>
  
    </>
  )
}

export default App
function onEffect(arg0: () => void) {
  throw new Error('Function not implemented.')
}

