import JZZ from 'jzz'
import { Tiny } from 'jzz-synth-tiny';
import { Kbd } from 'jzz-input-kbd'
import { useEffect, useRef, useState, Ref } from 'react';


Tiny(JZZ);
Kbd(JZZ)

const jazz = (JZZ as any)
export function KeyboardJZZ(){
const piano = useRef<HTMLDivElement>(null)
const enteredTime = "1/4"
// step 1 , place the thing into the dom
// step 2 , hookup controls to allow events to send
// setp 3, setup to create output
const tiny = (JZZ as any).synth.Tiny()
const keyboard = jazz.input.Kbd({at:'piano'}).connect(tiny)
const mapKeyNote:any = {
    A:'F#4', Z:'G4', S:'G#4', X:'A4', D:'Bb4', C:'B4', V:'C5', G:'C#5', B:'D5',
    H:'D#5', N:'E5', M:'F5', K:'F#5', '<':'G5', L:'G#5', '>':'A5', ':':'Bb5'
  }
jazz.input.ASCII(mapKeyNote).connect(keyboard);
interface KeyTimeMs {
    note: string;
    time: number;
    }
const [currentlyPressedNotes, setCurrentlyPressedNotes] = useState([] as KeyTimeMs[])
const addListenerKeyDown = (piano: Ref<HTMLDivElement>) => {
    if (!piano || !(piano as any).current) {
        console.error('Piano ref is not set');
        return;
    }
    (piano as any).current.addEventListener('keydown', (e:KeyboardEvent) => {
        const note = mapKeyNote[e.key.toUpperCase()]
       
        const volume = .2 // between 0 and 1 , todo, make a slider
        const waitMs = 500// todo: make a slider
        console.log('keydown', note)
        if (note) {
            tiny.noteOn(0,note, Math.floor(127*volume)).wait(waitMs).noteOff(0, note)
            const now = new Date().getTime()
            setCurrentlyPressedNotes(currentlyPressedNotes => [...currentlyPressedNotes, {note,time:now}])
            let length = currentlyPressedNotes.length

            const filteredNotes = []
            for(let noteDown of currentlyPressedNotes){
                const noteDiff = now - noteDown.time
                if(noteDiff > 100){
                    // its not a chord, ignore
                    console.log('not a chord, too long pressed down , ignore')
                    continue
                }
                filteredNotes.push(noteDown) 
                }
            if (filteredNotes.length == 1){
                console.log(`note:,${filteredNotes[0].note.toUpperCase() },time:P+${enteredTime}`)
            }
            else{
                const notesInChord = []
                for(let noteDown of filteredNotes){
                    notesInChord.push(noteDown.note)
                }

                console.log(`chord:,${notesInChord.join('|')},time:P+${enteredTime}`)
              
            }
        }
    })

}
const addListenerKeyUp = (piano: Ref<HTMLDivElement>) => {
    if (!piano || !(piano as any).current) {
        console.error('Piano ref is not set');
        return;
    }
    (piano as any).current.addEventListener('keyup', (e:KeyboardEvent) => {
        const note = mapKeyNote[e.key.toUpperCase()]
     
        if (note) {
            console.log('keyup', e)
            // remove the note from currentlyPressedNotes
            tiny.noteOff(0, note)
            const now = new Date().getTime()
            // remove the note from currentlyPressedNotes
            setCurrentlyPressedNotes(currentlyPressedNotes => {
                const newNotes = currentlyPressedNotes.filter(noteDown => noteDown.note !== note)
                return newNotes
            })
            console.log('keydown', e)
        }
    })

}
useEffect(() => {
    if (piano.current) {
      // Access the div element here
        console.log(piano.current, 'piano is current')
       // addListenerKeyDown(piano)
        //addListenerKeyUp(piano)
      
    }
  }, [piano]);

return (
    <><div>
<div id="piano" ref={piano}></div>
    </div>

    </>
)
}