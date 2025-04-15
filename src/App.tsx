import PlayWindow from "./components/PlayWindow/PlayWindow"
import { placeholder, placeholderDemoScales } from "./services/MidiFileOut"
import {addBrToDescription } from "./services/TextUtils"


function App() {
  const introText = `This is a demo of Music Central, a midi and audio interface for creating music. 
  Press "Convert" to convert the text to Audio and listen. After pressing "Convert", press "Export Midi" for a file you can use in your DAW such as Ableton, FL studio, and LMMS.
  This project allows you to convert text-based music notation into audio. 
  If using a phone, make sure the volume is up and the ringer is not on a silent mode.
  `
  const textIntroRecap = `note can be specified as distance from the Key origin (note:-1,note:0,note:1) , or to use the previous note (note:P), or previous note plus an offset
    (note:P+1 note:P+1#, note:P+1@). 
    chord handles lower case and upper case Roman numeral chords(chord:i, chord:I).  
    
    Time specifies how long to play a note, and how much forward to place the time cursor from (P)revious. 
    Layering occurs when negative (P-1/4) values happen.  
    Did you notice how there are different "Layers" of notes? Time reset to $START on the second half (aka: it reset to the beginning at time 0 and played over itself).
    vol controls velocity (vol:40)`

  const textPossibilities = `This converter and the file format will remain free for all to use forever, probably GPL , MIT or similar. 
  This MMT format can be used as an export for your music programs. You could create a program in any language that has text output send to this format.
  it is CSV like with a key:value format if you want to read it into a program. For now the converter source is closed but the format will be specified and open soon. 
  If you would like to contribute or provide ideas for the Text-Matrix-Midi specification , or the interim format NBEF : Note Beat Exchange Format, you can email rob at circlecreativematrix.com (or make a comment on the Hacker News Post) `
  
  const textRoadmap = `For the roadmap of what's todo next in order of priority:

  I want to implement a piano or piano roll for playing with a computer keyboard or a piano via usb.
 
  I want to add in scripting macros in golang or similar to create text into variables This would allow loops to be created easily.
 
  I want to expose the multiple tracks feature to the user so users can record multi track midi files
 
  I want to add in a find and replace method - probably a toml file or similar - so that the user can modify a set of $$variables in the project.
 
  I then want to make the find and replace optional as global, or in a section, so variations on a common theme can be acheived.
  
  I want to add multiple instruments via midi and play around with those
 
  I want to get audio input into the project so the user can sample from audio files or recordings, then use them in a project as a loop or a note for beatboxing and similar.

  I want to add in imports once the format is complete so you could specify other notes and functions from other people. 
  
  Roman numerals still need some more defintion on augmented and diminished I need to test VI_O, VI_+ , and IV_3 iv_5, IV_7 , etc . For now, specifying the chord explicitly is the way to go ( chord:C5|E5|G5,time:P+1/4,dur:1/4).
  
  I want to make a shorthand for mobile that will convert to the full format. No one wants to type note:a,time:P+1/4 on a phone. I want to do something like (mode) m:num 0 0 0 (time change) t 1/16 4 4 5 5 4 (time for following notes) t 1/2 (mode- explicit) m:exp c a a4 a3 a2 t P+1/4
(mode):chord t 1/4 I ii iii IV V vi vii

  I want to have text input from a spreadsheet next. it works pretty well splitting on the commas. In Google Sheets, you can do highlighting, notation, and tons of fun stuff. 
  I'm pretty sure this works out of the box importing as a CSV, but there's no frontend for it yet. 

  I want to create more tests and create more documentation. This is a late POC early MVP. It would be cool to put the documentation in headers in the code so it's tied together. 
`
 const textFunding = `I have a few ideas for the funding model. Ideally, I could get at least two corporate sponsors for feature adding and support funds. 
 If that's not an option,  I could make a gofundme with enough funds for me and another developer or two to work part time on this for two years - or just do a PBS model and ask for donations every year.
 Finally, if those two don't work, I can make a free tier and paid tier and offer feature building and support for paid users. I'd rather just get two corporate sponsors though. `
  const textDemoScales = `Let's start out with some scales, the below are patterns of scales, let's write some major and minor scales.`
  const textDemoRecap = `notes start at 0, and are relative to the starting note and stay in the key signature.  Look at the last two blocks of text. That is how to write D and F major explicitly using accidentals in C.`

const textYourTurn= `Now it's your turn! 
Your mission, should you choose to accept it: change the notes.
Place some notes with time in the text area below. 
Below is an example you can use to get started`

const textExamples = `I hope you enjoyed the excercise. Thank you for taking time to figure out what this all about and how to use it.`
  return (<>
    <h1 className="text-3xl font-bold underline text-center">Circle Creative Text-Matrix-Midi (TMM)</h1>
    {/* <PlayWindow text="hoodlevars" id="intro"></PlayWindow> */}
    {/* <Popup /> */}
    {/* PROGRAM<br/>
    <PlayWindow text={placeholderProgram()} id="program" title="program and find/replace" description={introText} recap={textIntroRecap}></PlayWindow>
    COMPILE <br/>
    <PlayWindow text={placeholderDemoScales()} id="run compiled" title="all notes" description={introText} recap={textIntroRecap}></PlayWindow> */}
    <PlayWindow text={placeholder()} id="1.start" title="What is this? Demo - Press Convert" description={introText} recap={textIntroRecap} usePiano={false}></PlayWindow>
    <PlayWindow text={placeholderDemoScales()} id="2.scales" title="Scales" description={textDemoScales} recap={textDemoRecap} usePiano={false}></PlayWindow>
    <PlayWindow text={`
label:your_first_song!
key_type:major,key_note:C5
note:0,time:P+1/4
note:C5,time:P+1/4,dur:1/4
note:P-4,time:P+1/4,dur:1/8`} id="3.try" title="Your Turn" description={textYourTurn} recap={textExamples} usePiano={true}></PlayWindow>
    <div style={{ textAlign: "left", fontSize: '16px', color: 'black' }}>
      <h2> Licensing and Converter </h2>
    {addBrToDescription(textPossibilities)}
    <h2> Roadmap</h2>
    {addBrToDescription(textRoadmap)}
    <h2> Funding</h2>
    {addBrToDescription(textFunding)}
    <h2>Visit Counter</h2>
    just seeing how many people are visiting this.
    <a href="https://www.freecounterstat.com" title="website counter"><img src="https://counter4.optistats.ovh/private/freecounterstat.php?c=9gphbj5ph7xtxpfctwafw7rdk64urcj1" title="website counter" alt="website counter"/></a>
    </div>
  </>)
}
export default App



