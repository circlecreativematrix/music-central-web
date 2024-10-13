
import JZZ from 'jzz'
import SMF from 'jzz-midi-smf'
import { expect, test } from 'vitest'
SMF(JZZ)

import { nbefSongToMidi, midiToBase64Save } from "./MidiFileOut";
import nbef from '../assets/example_nbef.yaml';





test("MidiFileOut", async () => {
   
    const smf =  nbefSongToMidi(nbef )
    //midiPlay(smf) // only works in browser
    const b64Save = midiToBase64Save(smf.dump())
    console.log("b64Save", b64Save)
    expect(b64Save).toBeTruthy()
    })
