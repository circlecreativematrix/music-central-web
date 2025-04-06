import { Ref, useEffect, useState } from 'react'
import YAML from 'js-yaml'
import pino from 'pino'
const logger = pino({
  browser: {
    asObject: false, // Log as objects for easier parsing
  }
});
import './App.css'

import { nbefSongToMidi, midiToBase64Save, placeholder, nbefToAudio } from './services/MidiFileOut'
import { runWasmChordStandardNote, runWasmStandardNote } from './services/Wasm'
import React from 'react';
import { RecordMidi } from './components/RecordMidi';
import { NBEF } from './types/NBEF';
const ENTRY_CHORDS = "entry_chords"
function btnHandlerConvert(standardText: string , isQuit: Ref<boolean>,  SetPlayer: (arg0: any) => void, SetFileOut: (arg0: string) => void) {
    
  runWasmChordStandardNote(standardText).then(res =>{
      console.log(res, 'chord_standard_note')
      runWasmStandardNote(res).then((res)=>{
        // error handling?
          console.log(res,'standardnote')
          const nbefYamlObj = YAML.load(res) as NBEF
          console.log('outputting audio')
          nbefToAudio(nbefYamlObj,isQuit)
          console.log('outputting midi')
          const smf =  nbefSongToMidi(nbefYamlObj, 96, logger)
          //SetPlayer(midiPlay(smf, true, false))
          SetFileOut(midiToBase64Save(smf.dump()))
          console.log("alldone!")
        })
      })
    }


function App() {
  const refText = React.useRef<HTMLTextAreaElement>(null)


  const [fileOut, SetFileOut] = useState("")
  const [player, SetPlayer] = useState(undefined)
  const [standardText, SetStandardText] = useState("")
  const isQuit = React.useRef(false)
  useEffect(()=>{
    const storedText = localStorage.getItem(ENTRY_CHORDS);
    if (storedText ) {
      if(refText.current){
      refText.current.value = storedText
      SetStandardText(storedText)
      }
    }
    else{
      if(refText.current){
      refText.current.value = placeholder()
      SetStandardText(placeholder())
      }
    }

  },[])
  return (
    <>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#282c34', color: 'white', padding: '20px' }}>
      <h1>Circle Creative Matrix Midi</h1>
      <textarea style={{ width: '100%', height: '600px' }} ref={refText} value={standardText} onChange={(e)=>{
        SetStandardText(e.target.value);  
        localStorage.setItem(ENTRY_CHORDS, e.target.value

        )}}></textarea>
      <br/><div>
      <button onClick={()=>{ 
       isQuit.current = false
        btnHandlerConvert(standardText,isQuit, SetPlayer, SetFileOut) }}>Convert</button>
     
     <button onClick={()=> {
       if(player){
         (player as any).stop();
         }
         isQuit.current = true
        //SetQuitNow(true) 
        console.log('stopping') 
         }}>Stop</button>
        </div>
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



