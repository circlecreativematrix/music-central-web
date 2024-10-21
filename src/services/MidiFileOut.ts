
import JZZ from 'jzz'
import SMF from 'jzz-midi-smf'
import pino from 'pino';

SMF(JZZ)
export function midiPlay(smfIn: any, logger : pino.BaseLogger|undefined) {
  if(logger === undefined){
    logger = pino()
  }
  const midiout = JZZ().openMidiOut();
  const player = smfIn.player();
  player.connect(midiout);
  console.log('player', player, "midiout", midiout)
  player.play()
  //console.log('midiout', midiout)
  
  
  return player
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

export function secondsToTicks(secondsIn: string, ticksPerQuarterNote: number = 96, tempo: number = 33) {
  const seconds = parseFloat(secondsIn)

  console.log("seconds:" ,seconds,"ticks:", seconds* ticksPerQuarterNote,"ticks  per quarter:", ticksPerQuarterNote)
  return  seconds* ticksPerQuarterNote
}


export function nbefSongToMidi(nbefYamlObj: any, ticksPerQuarterNote: number = 96, logger:pino.BaseLogger|undefined) {
  if(logger === undefined){
    logger = pino()
  }
  if(nbefYamlObj === undefined || nbefYamlObj.notes === undefined){
    logger.error('no notes yet on nbefSongToMidi')
    return

  }
  var smf = (JZZ.MIDI as MidiConstructor).SMF(2, ticksPerQuarterNote); // type 0, 96 ticks per quarter note
  var trk = new (JZZ.MIDI as MidiConstructor).SMF.MTrk();
  let lastKnownTime = 0
  const tracksInPlay:any =  {0: trk}
  smf.push(tracksInPlay[0]);
  for (let note of nbefYamlObj.notes) {
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

  // for (var i = 0; i < smf.length; i++) {
  //   for (var j = 0; j < smf[i].length; j++) {
  //     console.log('track:', i, 'tick:', smf[i][j].tt, smf[i][j].toString());
  //     // or do whatever else with the message
  //   }
  // }
 return smf
 


}

export function placeholder(){
  return `notes: 'key_type:major,key_note:C4,tempo:60
  halfsteps:0,time:P,note:0
  halfsteps:0,time:P,note:2
  halfsteps:0,time:P,note:4
  time:P+1/4
  
  halfsteps:0,time:P,note:1
  halfsteps:0,time:P,note:3
  halfsteps:0,time:P,note:5
  time:P+1/4
  
  halfsteps:0,time:P,note:2
  halfsteps:0,time:P,note:4
  halfsteps:0,time:P,note:6
  time:P+1/4
  
  halfsteps:0,time:P,note:3
  halfsteps:0,time:P,note:5
  halfsteps:0,time:P,note:7
  time:P+1/4
  
  halfsteps:0,time:P,note:4
  halfsteps:0,time:P,note:6
  halfsteps:0,time:P,note:8
  time:P+1/4
  
  halfsteps:0,time:P,note:5
  halfsteps:0,time:P,note:7
  halfsteps:0,time:P,note:9
  time:P+1/4
  
  halfsteps:0,time:P,note:6
  halfsteps:0,time:P,note:8
  halfsteps:0,time:P,note:10
  time:P+1/4

  
  halfsteps:0,time:P,note:7
  halfsteps:0,time:P,note:9
  halfsteps:0,time:P,note:11
  time:P+1/4
  '`
}