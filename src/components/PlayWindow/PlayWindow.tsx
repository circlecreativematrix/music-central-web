
import { Ref, useEffect, useState } from 'react'
import YAML from 'js-yaml'
import pino from 'pino'
import { addBrToDescription } from '../../services/TextUtils'
const logger = pino({
    browser: {
        asObject: false, // Log as objects for easier parsing
    }
});
import './PlayWindow.css'

import { nbefSongToMidi, midiToBase64Save, placeholder, nbefToAudio as jzzNbefToAudio } from '../../services/MidiFileOut'
import {  nbefToAudio as toneNbefToAudio } from '../../services/AudioFileOut'
import { runWasmChordStandardNote, runWasmStandardNote } from '../../services/Wasm'
import React from 'react';
import { NBEF } from '../../types/NBEF';
const ENTRY_CHORDS = "entry_chords"
//let isMobile = window.innerWidth < 768
///Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent);


function btnHandlerConvert(standardText: string, isQuit: Ref<boolean>, SetFileOut: (arg0: string) => void) {

    runWasmChordStandardNote(standardText).then(res => {
        console.log(res, 'chord_standard_note')
        runWasmStandardNote(res).then((res) => {
            // error handling?
            console.log(res, 'standardnote')
            const nbefYamlObj = YAML.load(res) as NBEF
            console.log('outputting audio')
            //jzzNbefToAudio(nbefYamlObj, isQuit)
            toneNbefToAudio(nbefYamlObj, isQuit)

            console.log('outputting midi')
            const smf = nbefSongToMidi(nbefYamlObj, 480, logger)
            // if (isMobile) {
            //     console.log('MOBILE!')
            //     SetPlayer(midiPlay(smf, false, true))
            // }

            SetFileOut(midiToBase64Save(smf.dump()))
            console.log("alldone!")
        })
    })
}


interface PlayWindowProps {
    text?: string;
    id: string;
    title: string;
    description?: string;
    recap?: string;
}

function PlayWindow({ text, id, title, description, recap }: PlayWindowProps) {
    const refText = React.useRef<HTMLTextAreaElement>(null)
    //isMobile = window.innerWidth < 768
    const [fileOut, SetFileOut] = useState("")
    const [player] = useState(undefined)
    const [standardText, SetStandardText] = useState("")
    const isQuit = React.useRef(false)
    const descriptionText = description || ""
    const htmlDescription = addBrToDescription(descriptionText)
    useEffect(() => {
        const storedText =  localStorage.getItem(`${ENTRY_CHORDS}_${id}`) || text;
        if (storedText) {
            if (refText.current) {
                refText.current.value = storedText
                SetStandardText(storedText)
            }
        }
        else {
            if (refText.current) {
                refText.current.value = placeholder()
                SetStandardText(placeholder())
            }
        }

    }, [])
    return (
        <>


            <div style={{ position: 'relative', top: 0, left: 0, backgroundColor: '#282c34', color: 'white', padding: '20px' }}>
                <h1>{title}</h1>
                <div style={{ textAlign: "left", fontSize: '16px', color: 'white' }}>
                    {htmlDescription}
                </div>

                <br />
                <div>
                    <button onClick={() => {
                        isQuit.current = false
                        btnHandlerConvert(standardText, isQuit, SetFileOut)
                    }}>Convert</button>

                    <button onClick={() => {
                        if (player) {
                            (player as any).stop();
                        }
                        isQuit.current = true
                        //SetQuitNow(true) 
                        console.log('stopping')
                    }}>Stop</button>
                    <a href={fileOut} download="Download.mid" target="_blank">
                        <button>Export Midi</button>
                    </a>
                </div>
                <textarea style={{ width: '100%', height: '600px' }} ref={refText} value={standardText} onChange={(e) => {
                    SetStandardText(e.target.value);
                    localStorage.setItem(`${ENTRY_CHORDS}_${id}`, e.target.value

                    )
                }}></textarea>
                <br />
                <div style={{ textAlign: "left", fontSize: '16px', color: 'white' }}>
                    {addBrToDescription(recap as string)}
                </div>
            </div>

        </>
    )
}
export default PlayWindow;