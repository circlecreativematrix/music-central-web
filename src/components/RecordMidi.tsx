import { useEffect, useState } from "react"
import JZZ from "jzz";
import "jzz-midi-smf"; // Ensure the MIDI namespace is included
function handleMidiInput(msg: any, output: any, setOutput: any, startTime: any) {
    if (msg.isNoteOn() || msg.isNoteOff()) {
        console.log("Note!@", msg.toString(), msg.getNote(),
            msg.getVelocity(), "tt", msg.tt, "time", new Date().getTime() - startTime)
        if (output) {
            setOutput([...output, msg])
        }
        else {
            setOutput([msg])
        }
        console.log(output)
    }
}
function handleBtnRecord(midiIn: string = "undefined", SetMidiInConnection: any, output: any[], setOutput: any, startTime: any) {
    console.log("Recording")
    const midiInConnection = JZZ().openMidiIn(midiIn).or('Cannot open MIDI In port!')
        .and(function(this:any) { console.log('MIDI-In: ', this.name()); })
        .connect((msg: any) => { handleMidiInput(msg, output, setOutput, startTime) })
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

    }, [])
    return (
        <div>
            <button onClick={() => {
                
                handleBtnRecord("loopy", SetMidiInConnection, output, setOutput, new Date().getTime())
            }}>Record</button>
            <button onClick={() => { handleBtnStopRecord(midiInConnection) }}>Stop</button>
        </div>
    )
}