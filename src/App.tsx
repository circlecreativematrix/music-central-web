import { useEffect, useState } from 'react'

import './App.css'
import { nbefSongToMidi, midiPlay, midiToBase64Save } from './services/MidiFileOut'


function App() {
  const [fileOut, SetFileOut] = useState("")
  useEffect(()=>{
    const smf =  nbefSongToMidi()
    midiPlay(smf)
    SetFileOut(midiToBase64Save(smf.dump()))
    console.log("alldone!")
  },[])
  return (
    <>
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

