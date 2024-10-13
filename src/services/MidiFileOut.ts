
import JZZ from 'jzz'
import SMF from 'jzz-midi-smf'

SMF(JZZ)
export function midiPlay(smfIn: any) {
  const midiout = JZZ().openMidiOut([0, 1, 2, 3, 4]);
  const player = smfIn.player();
  console.log("dump", smfIn.dump())
  player.connect(midiout);
  player.play()
}
export function midiToBase64Save(data: any) {
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

type Constructor = (typeof JZZ.MIDI)
export interface MidiConstructor extends Constructor {
  SMF: Function | { MTrk: Function } | any
}

export function secondsToTicks(secondsIn: string, ticksPerQuarterNote: number = 96, tempo: number = 120) {
  const seconds = parseFloat(secondsIn)
  const secondsPerTick = (60000 / (tempo * ticksPerQuarterNote)) / 1000
  return seconds / secondsPerTick * 1.0
}


export function nbefSongToMidi(nbefYamlObj: any, ticksPerQuarterNote: number = 96) {
  var smf = (JZZ.MIDI as MidiConstructor).SMF(2, 96); // type 0, 96 ticks per quarter note
  var trk = new (JZZ.MIDI as MidiConstructor).SMF.MTrk();
  let lastKnownTime = 0
  const tracksInPlay:any =  {0: trk}
  smf.push(tracksInPlay[0]);
  for (let note of nbefYamlObj.notes) {
    console.log(note.time_s)
    if(tracksInPlay[note.track]=== undefined){
      tracksInPlay[note.track] = new (JZZ.MIDI as MidiConstructor).SMF.MTrk();
      smf.push(tracksInPlay[note.track]);
    }
    const currentTrack = tracksInPlay[note.track]
    const time = secondsToTicks(note.time_s,ticksPerQuarterNote, note.tempo )
    lastKnownTime = time
    if(note.signal === "note_on"){
        currentTrack.add(time,JZZ.MIDI.noteOn(0, note.midi, note.velocity))
    }else if(note.signal === "note_off"){
        currentTrack.add(time, JZZ.MIDI.noteOff(0, note.midi))
    }
    else if (note.signal === undefined){
      continue // do nothing
    }
    else{
      throw new Error( "Unknown signal"+ note.signal+ note)
    }

  }

  for(let track of smf){
    track.add(lastKnownTime+10, JZZ.MIDI.smfEndOfTrack());
  }

  for (var i = 0; i < smf.length; i++) {
    for (var j = 0; j < smf[i].length; j++) {
      console.log('track:', i, 'tick:', smf[i][j].tt, smf[i][j].toString());
      // or do whatever else with the message
    }
  }
 return smf
 


}