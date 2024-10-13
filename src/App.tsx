import { useEffect, useState } from 'react'
import JZZ from 'jzz'
import SMF from 'jzz-midi-smf'
import './App.css'
SMF(JZZ)
function midiPlay(smfIn: any){
  const midiout = JZZ().openMidiOut([0,1,2,3,4]);
  const player = smfIn.player();
  console.log("dump", smfIn.dump())
  player.connect(midiout);
  player.play()
}
function midiToBase64Save(data: any){
  //https://jazz-soft.net/demo/WriteMidiFile.html
   // MIDI file dumped as a string
  var b64 = JZZ.lib.toBase64(data); // convert to base-64 string
  var uri = 'data:audio/midi;base64,' + b64; // data URI
  //const a = document.createElement('a');
  //a.href = uri;
  //a.download = name||'itWorks.mid';
  //a.click();
  return uri
}
function midiOut(){
  var smf =JZZ.MIDI.SMF(2,96); // type 0, 96 ticks per quarter note
var trk = new JZZ.MIDI.SMF.MTrk();

smf.push(trk);
// add contents:
trk.add(0, JZZ.MIDI.smfSeqName('This is a sequence name'))
   .add(0, JZZ.MIDI.smfBPM(90)) // tempo 90 bpm
   .add(96, JZZ.MIDI.noteOn(0, 'C6', 127))
   .add(96, JZZ.MIDI.noteOn(0, 'Eb6', 127))
   .add(96, JZZ.MIDI.noteOn(0, 'G6', 127))
   .add(192, JZZ.MIDI.noteOff(0, 'C6'))
   .add(192, JZZ.MIDI.noteOff(0, 'Eb6'))
   .add(192, JZZ.MIDI.noteOff(0, 'G6'))
   .add(988, JZZ.MIDI.smfEndOfTrack());
  
   for (var i = 0; i < smf.length; i++) {
    for (var j = 0; j < smf[i].length; j++) {
      console.log('track:', i, 'tick:', smf[i][j].tt, smf[i][j].toString());
      // or do whatever else with the message
    }
  }
  return smf
}
function App() {
  const [fileOut, SetFileOut] = useState("")
 
  
  useEffect(()=>{
    const smf =  midiOut()
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

