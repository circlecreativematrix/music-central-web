import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { JZZ } from 'jzz';
import { SMF } from 'jzz-midi-smf';
SMF(JZZ);
import './App.css'
function midiOut(){
  var smf = new SMF(0, 96); // type 0, 96 ticks per quarter note
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
   .add(288, JZZ.MIDI.smfEndOfTrack());
// or an alternative way:
trk.smfSeqName('This is a sequence name').smfBPM(90).tick(96)
   .noteOn(0, 'C6', 127).noteOn(0, 'Eb6', 127).noteOn(0, 'G6', 127)
   .tick(96).noteOff(0, 'C6').noteOff(0, 'Eb6').noteOff(0, 'G6')
   .tick(96).smfEndOfTrack();
// or even shorter:
trk.smfSeqName('This is a sequence name').smfBPM(90).tick(96)
   .ch(0).note('C6', 127, 96).note('Eb6', 127, 96).note('G6', 127, 96)
   .tick(192).smfEndOfTrack();
}
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
