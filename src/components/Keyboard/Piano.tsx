interface PianoInputs {
    id: string;
}
export function Piano(props: PianoInputs) {
    const id = props.id || Math.floor(Math.random()*10000+1).toString()
    const octave = 3
    const whiteKey = {count: 17, leftOffset: 42, backgroundColor: 'rgb(255, 255, 255)', borderColor: 'rgb(0, 0, 0)' }
    const blackKey = {offset: 42, backgroundColor: 'rgb(128, 10, 10)', borderColor: 'rgb(0, 0, 0)' }
    const KeyMap = {whiteKeys: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], blackKeys: ['C#', 'D#', 'F#', 'G#', 'A#'] }
    function createWhiteKeys(count: number) {
        const whiteKeys = []
        for (let i = 0; i < count; i++) {
            const left = i * 42 + whiteKey.leftOffset
            const note = KeyMap.whiteKeys[i % 7] + Math.floor(i / 7 + octave)
            whiteKeys.push(
                <div
                    key={i}
                    id={`${note}_${id}`}
                    className="white-key"
                    style={{
                        backgroundColor: whiteKey.backgroundColor,
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
        }
        return whiteKeys
    }
    function createBlackKeys(mapping: number[]) {
        const blackKeys = []
        for (let i = 0; i < mapping.length; i++) {
            const left = mapping[i] + blackKey.offset
            const note = KeyMap.blackKeys[i % 5] + Math.floor(i / 5 + octave)
            blackKeys.push(
                <div
                    key={i}
                    id={`${note}_${id}`}
                    className="black-key"
                    style={{
                        backgroundColor: blackKey.backgroundColor,
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
        id={`${'piano-container'}_${id}`}
        style={{
            position: 'relative',
            margin: 0,
            padding: 0,
            width: '100%',
            height: '151px',
            userSelect: 'none',
            cursor: 'default'
        }}>
            {/* White keys */}
            {createWhiteKeys(whiteKey.count)}
            {/* Black keys */}
            {createBlackKeys([27, 75, 150, 198, 246, 321, 369, 444, 492, 540, 615, 663])}
        </div>
    </>)

}