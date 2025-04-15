// import JZZ from 'jzz'
// import { Tiny } from 'jzz-synth-tiny';
// import { Kbd } from 'jzz-input-kbd'
// import { useEffect, useRef, useState, Ref } from 'react';


// Tiny(JZZ);
// Kbd(JZZ)

// const jazz = (JZZ as any)
// export function KeyboardJZZ(){
// const piano = useRef<HTMLDivElement>(null)
// const enteredTime = "1/4"
// step 1 , place the thing into the dom
// // step 2 , hookup controls to allow events to send
// // setp 3, setup to create output
// const tiny = (JZZ as any).synth.Tiny()
// const keyboard = jazz.input.Kbd({at:'piano'}).connect(tiny)
// const mapKeyNote:any = {
//     A:'F#4', Z:'G4', S:'G#4', X:'A4', D:'Bb4', C:'B4', V:'C5', G:'C#5', B:'D5',
//     H:'D#5', N:'E5', M:'F5', K:'F#5', '<':'G5', L:'G#5', '>':'A5', ':':'Bb5'
//   }
// jazz.input.ASCII(mapKeyNote).connect(keyboard);
// interface KeyTimeMs {
//     note: string;
//     time: number;
//     }
// const [currentlyPressedNotes, setCurrentlyPressedNotes] = useState([] as KeyTimeMs[])

// useEffect(() => {
//     if (piano.current) {
//       // Access the div element here
//         console.log(piano.current, 'piano is current')
//        // addListenerKeyDown(piano)
//         //addListenerKeyUp(piano)
      
//     }
//   }, [piano]);

// return (
//     <><div>
// <div id="piano" ref={piano}></div>
//     </div>

//     </>
// )
// }