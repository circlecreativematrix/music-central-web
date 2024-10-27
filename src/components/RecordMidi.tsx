import { useEffect, useState } from "react"
import JZZ from "jzz";
import "jzz-midi-smf"; // Ensure the MIDI namespace is included

interface MidiMessageIn {
    
    midi: number,
    vol: number,
    io: number,
    time: string
}
function convertToColonDelimited(message: MidiMessageIn) {
    return `midi:${message.midi},io:${message.io},vol:${message.vol},time:${message.time}`
}
function handleMidiInput(msg: any, output:string[], startTime: number, count: number, prefix: string) {

    if (msg.isNoteOn() || msg.isNoteOff()) {
        if(count === 0){
            startTime = new Date().getTime()
            console.log('start resetting', count)
        }
        //msg.getVelocity()
        console.log('startTime', startTime, "count", count)
        const message: MidiMessageIn = { midi: msg[1], vol: 125, 
            io: msg[0] == 0x90? (msg[2] == 0? 0: 1) : 0, 
            time: `$${prefix}+`+((new Date()).getTime() - startTime)/1000 };
        const outMessage  = convertToColonDelimited(message)
        output.push(outMessage)
    }
 
   
}
function handleBtnRecord(midiIn: string = "undefined", SetMidiInConnection: any, setOutput: any,
    prefix: string = "SONG" 
) {
    console.log("Recording: " + midiIn)
    let count = 0 
    let startTime = new Date().getTime()
    const outNotes:string[] = []
    outNotes.push(`time:!${prefix}=P`)
    const midiInConnection = JZZ().openMidiIn(midiIn).or('Cannot open MIDI In port!')
        .and(function(this:any) { console.log('MIDI-In: ', this.name()); })
        .connect((msg: any) => { 
            if(count == 0 ){
              startTime = new Date().getTime()

            }
           
            handleMidiInput(msg, outNotes, startTime,count, prefix)
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
    const [selectedInput, setSelectedInput] = useState<string>('');
    const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[]>([]);
    const [prefix, setPrefix] = useState<string>('SONG');
    useEffect(() => {
        navigator.requestMIDIAccess().then((midiAccess) => {
            const inputs = Array.from(midiAccess.inputs.values());
            setSelectedInput(inputs[0].name as string);
            setMidiInputs(inputs);
        });
    }, [output])

    const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedInput(event.target.value);
    };
    const handleCapsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrefix(event.target.value)
    }
    return (
        <div>
            
            <textarea >{output.join("\n")}</textarea>
            <button onClick={() => {
                handleBtnRecord(selectedInput, SetMidiInConnection, setOutput,prefix)
            }}>Record</button>
            4_Letter_CAPS_Prefix:<input type="text" onChange={handleCapsChange} />
             Input:<select onChange={handleInputChange} value={selectedInput}>
                {midiInputs.map((input) => (
                    <option key={input.name} value={input.name}>
                        {input.name}
                    </option>
                ))}
            </select>
            <button onClick={() => { 
                handleBtnStopRecord(midiInConnection);
                console.log(output.join("\n"))
             }}>Stop</button>
        </div>
    )
}