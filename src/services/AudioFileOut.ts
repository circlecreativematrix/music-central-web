
import * as Tone from 'tone';
import { NBEF } from '../types/NBEF';
import { Ref } from 'react';







export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * This plays back real time using Tone.js and audio context. Output should be in a wav file for use in DAW project 
 * @param nbefYamlObj -yaml NBEF object 
 */
export async function nbefToAudio(nbefYamlObj: NBEF, isQuit: Ref<boolean>, isAudio: boolean) {
    //const offlineContext = new Tone.OfflineContext(1,4, 44100); // 4 seconds, 44100 Hz sample rate
    //Tone.setContext(offlineContext);
    const recorder = new Tone.Recorder();
    const synth = new Tone.PolySynth().toDestination().connect(recorder)
    //let timeGlobal = 0
    const startTime = new Date().getTime()
    let currentTime = new Date().getTime()
    const noteOn = (track: number, midi: number, timeSec: number, velocity: number) => {
        //timeGlobal += time;
        console.log('todo:implement track into sequences in tone.js or some different thing, may need an array to hold tracks', track)
        const pitch = Tone.Frequency(midi, "midi").toFrequency()
        synth.triggerAttack(pitch, timeSec, velocity);
    };

    const noteOff = (track: number, midi: number, timeSec: number) => {
        //timeGlobal += time;
        console.log('todo:implement track into sequences in tone.js or some different thing, may need an array to hold tracks', track)
        const pitch = Tone.Frequency(midi, "midi").toFrequency()
        synth.triggerRelease(pitch, timeSec);
    };
    // this needs to be done on wasm side. yet here we are with it implemented... the sort may not be needed with tone.js ? 
    nbefYamlObj.notes.sort((a, b) => {
        const timeA = parseFloat(a.time_s as string)
        const timeB = parseFloat(b.time_s as string)
        return timeA - timeB
    })
    Tone.start()
    Tone.Transport.start("+0.1");
    recorder.start();
    for (let nbefNote of nbefYamlObj.notes) {
        if ((isQuit as any)!.current) {
            console.log("quitting early")
            synth.triggerRelease(undefined as any);
            break
        }

        //const time = secondsToTicks(nbefNote.time_s as string,ticksPerQuarterNote )
        const noteTimeMs = parseFloat(nbefNote.time_s as string) * 1000
        console.log("noteTimeMs", noteTimeMs)
        currentTime = new Date().getTime() - startTime
        while (noteTimeMs * 1.0 >= currentTime) { //0.8 is multiplier approximate to speed up the audio.
            // wait for the time to be right
            currentTime = new Date().getTime() - startTime
            //console.log("waiting for first less than second "+ noteTimeMs, currentTime)
            await sleep(1)
        }
        const velocityVolume = 0.01 // todo make this a user setting
        if (nbefNote.signal === "note_on") {
            console.log("note on", currentTime, nbefNote.track, nbefNote.midi, nbefNote.velocity * velocityVolume)
            noteOn(nbefNote.track as number, nbefNote.midi as number, currentTime / 1000, nbefNote.velocity * velocityVolume)

        } else if (nbefNote.signal === "note_off") {
            console.log("note off", currentTime, nbefNote.track, nbefNote.midi, nbefNote.velocity)
            noteOff(nbefNote.track as number, nbefNote.midi as number, currentTime / 1000)

        }
        else if (nbefNote.signal === undefined) {
            console.log('no signal')
            continue // do nothing
        }
        else {
            throw new Error("Unknown signal" + nbefNote.signal + nbefNote)
        }

    }
    synth.triggerRelease(undefined as unknown as Tone.Unit.Frequency); //stop all sounds
    const recording = await recorder.stop();
    Tone.Transport.cancel();
    Tone.Transport.stop();
    synth.dispose();

    if (isAudio) {
        // const buffer = await offlineContext.render();
        const url = URL.createObjectURL(recording);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-audio.webm';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }



}
