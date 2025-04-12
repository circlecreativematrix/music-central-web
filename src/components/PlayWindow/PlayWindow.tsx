
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

interface CheckBoxType {
    isJZZ: boolean;
    isTone: boolean;
    isMidi: boolean;
    isAudio: boolean;
}
function btnHandlerConvert(standardText: string, checks:CheckBoxType, isQuit: Ref<boolean>,isExportable: Ref<boolean>, SetFileOut: (arg0: string) => void) {

    runWasmChordStandardNote(standardText).then(res => {
        console.log(res, 'chord_standard_note')
        runWasmStandardNote(res).then((res) => {
            // error handling?
            console.log(res, 'standardnote')
            const nbefYamlObj = YAML.load(res) as NBEF
            console.log('outputting audio')
            if(checks.isJZZ){
                jzzNbefToAudio(nbefYamlObj, isQuit, isExportable)
            }
            if(checks.isTone){
            toneNbefToAudio(nbefYamlObj, isQuit, checks.isAudio)
            }
            console.log('outputting midi')
            if(checks.isMidi){
                const smf = nbefSongToMidi(nbefYamlObj, 480, logger)
                SetFileOut(midiToBase64Save(smf.dump()))
                console.log("alldone!")
            }
          
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
    const [checks] = useState({isJZZ: true, isTone: false, isMidi: true, isAudio: true})
    const [player] = useState(undefined)
    const [standardText, SetStandardText] = useState("")
    const isQuit = React.useRef(false)
    const isExportable = React.useRef(false)
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
                        btnHandlerConvert(standardText,checks, isQuit, isExportable, SetFileOut)
                    }}>Convert</button> 
                        {/* <label>
                            <input type="checkbox" checked={checks.isJZZ} onChange={(e) => {
                                SetChecks({ ...checks, isJZZ: e.target.checked });
                            }} />
                            JZZ
                        </label>
                        <label>
                            <input type="checkbox" checked={checks.isTone} onChange={(e) => {
                                SetChecks({ ...checks, isTone: e.target.checked });
                            }} />
                            Tone
                        </label> */}

                    <button onClick={() => {
                        if (player) {
                            (player as any).stop();
                        }
                        isQuit.current = true
                        //SetQuitNow(true) 
                        console.log('stopping')
                    }}>Stop</button>
                    <a href={fileOut} download="Download.mid" target="_blank">
                        <button disabled={!isExportable.current as any} >Export Midi</button>
                        {/* <input type ="checkbox" checked={checks.isMidi} onChange={(e) => {
                            SetChecks({ ...checks, isMidi: e.target.checked });
                        }
                        } />
                        Midi
                        <input type ="checkbox" checked={checks.isAudio} onChange={(e) => {
                            SetChecks({ ...checks, isAudio: e.target.checked });
                        }
                        } />
                        Audio */}

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