import { useEffect, useState } from "react"
import JZZ from "jzz";
import "jzz-midi-smf"; // Ensure the MIDI namespace is included

interface MidiMessageIn {
    
    midi: number,
    vol: number,
    io: number,
    time: number
}
function convertToColonDelimited(message: MidiMessageIn) {
    return `midi:${message.midi},io:${message.io},vol:${message.vol},time:${message.time}`
}
function handleMidiInput(msg: any, output:string[], startTime: number, count: number) {

    if (msg.isNoteOn() || msg.isNoteOff()) {
        if(count === 0){
            startTime = new Date().getTime()
            console.log('start resetting', count)
        }
        console.log('startTime', startTime, "count", count)
        const message: MidiMessageIn = { midi: msg[1], vol: msg.getVelocity(), io: msg[0] == 0x90? (msg[2] == 0? 0: 1) : 0, 
            time: ((new Date()).getTime() - startTime)/1000 };
        const outMessage  = convertToColonDelimited(message)
        output.push(outMessage)
    }
 
   
}
function handleBtnRecord(midiIn: string = "undefined", SetMidiInConnection: any, output: any[], setOutput: any, 
) {
    console.log("Recording")
    let count = 0 
    let startTime = new Date().getTime()
    const outNotes:string[] = []
    const midiInConnection = JZZ().openMidiIn(midiIn).or('Cannot open MIDI In port!')
        .and(function(this:any) { console.log('MIDI-In: ', this.name()); })
        .connect((msg: any) => { 
            if(count == 0 ){
              startTime = new Date().getTime()
            }
           
            handleMidiInput(msg, outNotes, startTime,count)
            count++ 
            console.log('len of outNotes', outNotes.length)
            setOutput(outNotes)
         })
    SetMidiInConnection(midiInConnection)
   
}
function handleBtnStopRecord(midiConnection: any) {
    console.log("Stopping Recording...")
    midiConnection.close()
    midiConnection.disconnect()

    
}
export function RecordMidi() {
    const [output, setOutput] = useState<any | undefined>([])
    const [midiInConnection, SetMidiInConnection] = useState<any | undefined>(undefined)
    useEffect(() => {
        
    }, [output])
    return (
        <div>
            <textarea defaultValue={output.join("\n")}></textarea>
            <button onClick={() => {
                handleBtnRecord("loopy", SetMidiInConnection, output, setOutput)
            }}>Record</button>
            <button onClick={() => { 
                handleBtnStopRecord(midiInConnection);
                console.log(output.join("\n"))
             }}>Stop</button>
        </div>
    )
}