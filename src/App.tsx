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
  If using a phone, make sure the volume is up and the ringer is not on a silent mode.
  `
  const textIntroRecap = `note can be specified as distance from the Key origin (note:-1,note:0,note:1) , or to use the previous note (note:P), or previous note plus an offset
    (note:P+1 note:P+1#, note:P+1@). chord handles lower case and upper case Roman numeral chords(chord:i, chord:I).  Time specifies how long to play a note, and how much forward to place the time cursor from (P)revious. Layering occurs when negative (P-1/4) values happen.  
    Did you notice how there are different "Layers" of notes? time reset to $START on the second half (reset to 0 time). Tracks can also be used for this purpose, which is useful if exporting to midi as it preserves tracks (track:1).
    vol controls velocity (vol:40)`

  const textPossibilities = `The converter/documentation/format will remain free for all to use forever. This format can be used as an export for your music programs. You could create a program in any language that has text output send to this format.
  it is CSV like with a key:value format if you want to read it into a program. For now the converter source is closed but the format will be specified and open soon. 
  If you would like to contribute or provide ideas for the Text-Matrix-Midi specification , or the interim format NBEF : Note Beat Exchange Format, you can email rob at circlecreativematrix.com (or make a comment on the Hacker News Post) `
  
  const textRoadmap = `For the roadmap of what's todo next, Roman numerals still need some more defintion on augmented and diminished I need to test VI_O, VI_+ , and IV_3 iv_5, IV_7 , etc . For now, specifying the chord explicitly is the way to go ( chord:C5|E5|G5,time:P+1/4,dur:1/4).
  
  I want to make a shorthand for mobile that will convert to the full format. No one wants to type note:a,time:P+1/4 on a phone. I want to do something like (mode) m:num 0 0 0 (time change) t 1/16 4 4 5 5 4 (time for following notes) t 1/2 (mode- explicit) m:exp c a a4 a3 a2 t P+1/4
(mode):chord t 1/4 I ii iii IV V vi vii

I want to have text input from a spreadsheet next. it works pretty well splitting on the commas. In Google Sheets, you can do highlighting, notation, and tons of fun stuff. 
I'm pretty sure this works out of the box importing as a CSV, but there's no frontend for it yet. 

I want to create more tests and create more documentation. This is a late POC early MVP. It would be cool to put the documentation in headers in the code so it's tied together. 
`
 const textFunding = `I have a few ideas for the funding model, feedback would be appreciated on this. Ideally, I could get at least two corporate sponsors for feature adding and support funds. 
 If that's not an option,  I could make a gofundme with enough funds for me and a developer or two to work part time on this for two years - or just do a PBS model and ask for donations every year.
 Finally, if those two don't work, I can make a free tier and paid tier and offer feature building and support for paid users. I'd rather just get two corporate sponsors though. `
  const textDemoScales = `Let's start out with some scales, the below are patterns of scales, let's write some major and minor scales.`
  const textDemoRecap = `notes start at 0, and are relative to the starting note and stay in the key signature.  Look at the last two blocks of text. That is how to write D and F major explicitly using accidentals in C.`


  return (<>
    <h1 className="text-3xl font-bold underline text-center">Circle Creative Text-Matrix-Midi (TMM)</h1>
    {/* <PlayWindow text="hoodlevars" id="intro"></PlayWindow> */}

    <PlayWindow text={placeholder()} id="start" title="What is this? Demo - Press Convert" description={introText} recap={textIntroRecap}></PlayWindow>
    <PlayWindow text={placeholderDemoScales()} id="start" title="Scales" description={textDemoScales} recap={textDemoRecap}></PlayWindow>
    <div style={{ textAlign: "left", fontSize: '16px', color: 'black' }}>
      <h2> Licensing and Converter </h2>
    {addBrToDescription(textPossibilities)}
    <h2> Roadmap</h2>
    {addBrToDescription(textRoadmap)}
    <h2> Funding</h2>
    {addBrToDescription(textFunding)}
    </div>
  </>)
}
export default App



