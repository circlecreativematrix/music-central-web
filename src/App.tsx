import PlayWindow from "./components/PlayWindow/PlayWindow"
import { placeholder, placeholderDemoScales } from "./services/MidiFileOut"
import {addBrToDescription } from "./services/TextUtils"


function App() {
  const introText = `This is a demo of Text-Matrix-Midi. 
  This project allows you to convert text-based music notation into audio. 
  You can also export to MIDI files directly in the browser for use in your DAW such as Ableton, FL studio, or LMMS. 
  The notation includes chords, notes, and labels for different musical elements. 
  You should specify the tempo, key signature, and note whenever it changes or is started.
  The first box is a demo. The text is saved in localStorage so it will remain saved when you refresh the page.
  The rest of this page will demonstrate features. 
  Press "Convert" to convert the text to Audio and listen. Press "Export to Midi" to export the data to Midi.
  Copy and paste the text into github snippets or a nopaste to share it with others.
  `
  const textIntroRecap = `note can be specified as distance from the Key origin (note:-1,note:0,note:1) , or to use the previous note (note:P), or previous note plus an offset
    (note:P+1 note:P+1#, note:P+1@). chord handles lower case and upper case Roman numeral chords(chord:i, chord:I).  Time specifies how long to play a note, and how much forward to place the time cursor from (P)revious. Layering occurs when negative (P-1/4) values happen.  
    Did you notice how there are different "Layers" of notes? time reset to $START on the second half (reset to 0 time). Tracks can also be used for this purpose, which is useful if exporting to midi as it preserves tracks (track:1).
    vol controls velocity, and crescendos and decrescendos happen with a second underscore number
    (vol:40_10) - this offsets the volume to 40 from current volume over the course of 10 notes.`

  const textPossibilities = `The converter/documentation/format will remain free for all to use forever. This format can be used as an export for your music programs. You could create a program in any language that has text output send to this format.
  it is CSV like with a key:value format if you want to read it into a program. For now the converter source is closed but the format will be specified and open soon. 
  If you would like to help with the specification Text-Matrix-Midi, or the interim format NBEF : Note Beat Exchange Format you can email me 
  rob at circlecreativematrix dot com. Roman numerals still need some more defintion on augmented and diminished , and IV_3 iv_5, IV_7 , etc . For now, specifying the chord explicitly is the way to go ( chord:C5|E5|G5,time:P+1/4,dur:1/4)`
  const textDemoScales = `Let's start out with some scales, the below are patterns of scales, let's write some major and minor scales.`
  const textDemoRecap = `notes start at 0, and are relative to the starting note and stay in the key signature.  Look at the last two blocks of text. That is how to write D and F major explicitly using accidentals in C.`


  return (<>
    <h1 className="text-3xl font-bold underline text-center">Circle Creative Text-Matrix-Midi (TMM)</h1>
    {/* <PlayWindow text="hoodlevars" id="intro"></PlayWindow> */}

    <PlayWindow text={placeholder()} id="start" title="DEMO - Press Convert" description={introText} recap={textIntroRecap}></PlayWindow>
    <PlayWindow text={placeholderDemoScales()} id="start" title="DEMO - Press Convert" description={textDemoScales} recap={textDemoRecap}></PlayWindow>
    <div style={{ textAlign: "left", fontSize: '16px', color: 'white' }}>
    {addBrToDescription(textPossibilities)}
    </div>
  </>)
}
export default App



