import { useEffect, useState } from "react"
import JZZ, { MidiMsg } from "jzz"
function handleMidiInput(msg: MidiMsg, output: any, setOutput: any, startTime: any) {
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
        .and(function () { console.log('MIDI-In: ', this.name()); })
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
            <button onClick={(evt: any) => {
                
                handleBtnRecord("loopy", SetMidiInConnection, output, setOutput, new Date().getTime())
            }}>Record</button>
            <button onClick={(evt: any) => { handleBtnStopRecord(midiInConnection) }}>Stop</button>
        </div>
    )
}