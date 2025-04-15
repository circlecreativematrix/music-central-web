import { Ref, useEffect, useRef, useState } from "react";
import JZZ from "jzz";
import { Tiny } from "jzz-synth-tiny";
Tiny(JZZ);
interface PianoInputs {
    id: string;
    textBox: Ref<HTMLTextAreaElement>;
    setText: Function;
}

export function Piano(props: PianoInputs) {
    const volume = 0.4 
    const ENTRY_CHORDS = 'entry_chords'
    const isMobile = window.innerWidth <= 768
    const id = props.id || Math.floor(Math.random()*10000+1).toString()
    const octave = 3
    const whiteKey = {count: 14, leftOffset: 0, backgroundColor: 'rgb(255, 255, 255)', highlightColor: 'rgb(69, 121, 243)' ,borderColor: 'rgb(0, 0, 0)' }
    const blackKey = {count: 10, octaveOffset:10+43, offset: 0,leftOffset:[28, 43, 43*2-5, 43+2, 43+2], backgroundColor: 'rgb(128, 10, 10)', highlightColor:'rgb(69, 121, 243)', borderColor: 'rgb(0, 0, 0)' }
    const KeyMap = {whiteKeys: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], blackKeys: ['C#', 'D#', 'F#', 'G#', 'A#'] }
    const tiny = (JZZ as any).synth.Tiny()
    const pianoContainer = useRef<HTMLDivElement>(null)
    const [highlightedKey, setHighlightedKey] = useState({} as any)

    const mapKeyNote:any = {
        A:'F#4', Z:'G4', S:'G#4', X:'A4', D:'B@4', C:'B4', V:'C5', G:'C#5', B:'D5',
        H:'D#5', N:'E5', M:'F5', K:'F#5', '<':'G5', L:'G#5', '>':'A5', ':':'B@5'
      }
    const sendLineToTextBox = (line: string) => {
        if(!((props as PianoInputs).textBox as any).current){
            console.error('textBox ref is not set');
            return;
        }

        const textAreaSet = (props as PianoInputs).setText
        const textBoxRef = (props as PianoInputs).textBox as any
        textBoxRef.current.value += line + "\n"
        textAreaSet(textBoxRef.current.value)
        localStorage.setItem(`${ENTRY_CHORDS}_${id}`, textBoxRef.current.value)

    }
    const removeEventListenerToPiano = () => {
            if(!pianoContainer.current) return
            pianoContainer.current.removeEventListener('keydown', () => {})
            pianoContainer.current.removeEventListener('keyup', () => {})
            pianoContainer.current.removeEventListener('mousedown', () => {})
            pianoContainer.current.removeEventListener('mouseup', () => {})
    }
    const mouseUp = (e: MouseEvent|TouchEvent) => {
        const note = (e.target as HTMLElement)?.id.split('_')[0]
        const noteId = (e.target as HTMLElement)?.id
        if (noteId.includes('piano-container')) {
            console.log('piano-container ignored')
            return // ignore the container
                         }
        highlightedKey[noteId] = false
        setHighlightedKey({ ...highlightedKey })
       
        console.log('note',note)
        if (note) {
            console.log('mouseup-placeholder', note)
         
        }
    }
    const mouseDown = (e: MouseEvent|TouchEvent) => {
        const note = (e.target as HTMLElement)?.id.split('_')[0]
        const noteId = (e.target as HTMLElement)?.id
        if (noteId.includes('piano-container')) {
            console.log('piano-container ignored')
            return // ignore the container
                         }
        console.log('note',note)
        if (note) {
            console.log('mousedown', note)
            tiny.noteOn(0, note, Math.floor(127 * volume)).wait(500).noteOff(0, note)
        }
        
        highlightedKey[noteId] = true
        setHighlightedKey({ ...highlightedKey })
        sendLineToTextBox(`label:mousedown\nnote:${note.toUpperCase()},time:P+1/16`) // hardcoded , todo: make an entry for it
    }
    const addEventListenerToPiano = () => {
        if(pianoContainer.current){
           
            
            pianoContainer.current.addEventListener('mousedown', mouseDown )
            pianoContainer.current.addEventListener('mouseup',mouseUp )
            pianoContainer.current.addEventListener('touchstart', mouseDown )
            pianoContainer.current.addEventListener('touchend',mouseUp )
        pianoContainer.current.addEventListener('keydown', (e: KeyboardEvent) => {
            const key = e.key.toUpperCase()
            const note = mapKeyNote[key]
            const noteId = (e.target as HTMLElement)?.id
            console.log('noteId',noteId)
            setHighlightedKey({ ...highlightedKey, [noteId]: true })
            console.log('keydown')
           
            //const note = (e.currentTarget as HTMLElement)?.id.split('_')[0]
            // between 0 and 1 , todo, make a slider
           
            if (note) {
                console.log('keydown', note)
                tiny.noteOn(0, note, Math.floor(127 * volume))
                sendLineToTextBox(`label:keydown\nnote:${note.toUpperCase()},time:P+1/8note:${note.toUpperCase()},time:P+1/4`)
            }
        })
            pianoContainer.current.addEventListener('keyup', (e: KeyboardEvent) => {
            const key = e.key.toUpperCase()
            const noteId = (e.target as HTMLElement)?.id
            const note = mapKeyNote[key]
            setHighlightedKey({ ...highlightedKey, [noteId]: undefined })
            if (note) {
                console.log('keyUp', note)
                tiny.noteOff(0, note, )
            }
        })
    }
    }
    useEffect(() => {
        addEventListenerToPiano()
        return () => {
           removeEventListenerToPiano()
          };  
    }, [])
    function createWhiteKeys(count: number) {
        const refs = useRef<(HTMLDivElement | null)[]>([])
        
        const whiteKeys = []
        for (let i = 0; i < count; i++) {
            const ref = useRef<HTMLDivElement>(null)
            const left = i * 42 + whiteKey.leftOffset
            const note = KeyMap.whiteKeys[i % 7] + Math.floor(i / 7 + octave)
            const nameOfKey = `${note}_${id}`
            whiteKeys.push(
                <div
                
                    ref={ref}
                    key={i}
                    id={nameOfKey}
                    className="white-key"
                    style={{
                        backgroundColor: `${highlightedKey[nameOfKey] == true? ''+ whiteKey.highlightColor : whiteKey.backgroundColor}`,
                        borderColor: whiteKey.borderColor,
                        display: 'inline-block',
                        position: 'absolute',
                        margin: 0,
                        padding: 0,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        width: '41px',
                        height: '149px',
                        top: 0,
                        left: left,
                        verticalAlign: 'top'
                    }}
                />
            )
            refs.current.push(ref.current)
        }
        return whiteKeys
    }
    function createBlackKeys(count:number, mapping: number[]) {
        const blackKeys = []
        let currentLength = 0
        let octaveLength = 0 
        let octaveOffset = blackKey.octaveOffset 
        for (let i = 0; i < count; i++) {
            if (i % mapping.length == 0 && i != 0) {
                octaveLength += octaveOffset
                currentLength += octaveLength
            }
            const left = mapping[i%mapping.length] + currentLength + blackKey.offset
            currentLength += mapping[i%mapping.length]
            const note = KeyMap.blackKeys[i % 5] + Math.floor(i / 5 + octave)
            const nameOfKey = `${note}_${id}`
            blackKeys.push(
                <div
                    key={i}
                    id={nameOfKey}
                    className={`black-key`}
                    style={{
                        backgroundColor: `${highlightedKey[nameOfKey] == true?  blackKey.highlightColor : blackKey.backgroundColor}`,
                        borderColor: blackKey.borderColor,
                        display: 'inline-block',
                        position: 'absolute',
                        margin: 0,
                        padding: 0,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        width: '23px',
                        height: '99px',
                        top: 0,
                        left: left
                    }}
                />
            )
        }
        return blackKeys

    }
    
    return (<>
        <div className="piano-container" 
        onClick={() => {
            //focus 
            console.log('piano-container clicked')
            // if (pianoContainer.current) {
            //     pianoContainer.current.focus()
            // }
        }}
        id={`${'piano-container'}_${id}`}
        ref ={pianoContainer}
        tabIndex={0}
        style={{
            position: 'relative',
            margin: 0,
            padding: 0,
            width: '100%',
            height: '161px',
            userSelect: 'none',
            cursor: 'default',
            overflowX:  isMobile ? 'scroll' : 'hidden',
            overflowY: 'hidden',
        }}>
            {/* White keys */}
            {createWhiteKeys(whiteKey.count)}
            {/* Black keys */}
            {createBlackKeys(blackKey.count, blackKey.leftOffset)}
        </div>
    </>)

}