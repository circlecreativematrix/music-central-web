import { parse } from 'smol-toml'
export const flags = {
    JS_START: 'mode:js',
    JS_END: 'mode:/js',
    REPLACE_START: 'mode:replace',
    REPLACE_END: 'mode:/replace',
    JS_MODE: 'js',
    DEFAULT_MODE: 'default',
    REPLACE_MODE: 'replace',
}
function resetVars(vars: any) {
    vars.mode = flags.DEFAULT_MODE
    vars.nameForBuffer = undefined
    vars.modeBuffer = []
}
export function handleModesSeparate(text: string, bag:any) {
    const lines = text.split('\n')
    let resultingOutText = text
    const vars = {
        mode: flags.DEFAULT_MODE,
        nameForBuffer: '' as string,
        modeBuffer: [] as string[],
    }
    let lineNumber = -1
    for (let line of lines) {
        lineNumber++
        if (vars.mode === flags.JS_MODE) {

            if (line.includes(flags.JS_END)) {
                const buffer= vars.modeBuffer.join('\n')
                const jsLines= processJS(buffer)
                bag[vars.nameForBuffer || 'default'] = { val: jsLines, lineNumber }
                replaceIfExistsInValues(bag, vars.nameForBuffer, jsLines)
                resultingOutText = resultingOutText.replace(buffer,'')
                resetVars(vars)
                continue
            }

            vars.modeBuffer.push(line)
            continue

        }
        if (vars.mode === flags.REPLACE_MODE) {
            if (line.includes(flags.REPLACE_END)) {
                const buffer = vars.modeBuffer.join('\n')
                const findReplaceBag = processReplace(buffer, lineNumber)  // may need to add a line number for context
                for (let key of Object.keys(findReplaceBag)) {
                    bag[key] = findReplaceBag[key]
                    replaceIfExistsInValues(bag, key, findReplaceBag[key].val)
                }
               
                resultingOutText = resultingOutText.replace(buffer, '')
               
               
                resetVars(vars)
                continue
            }
            vars.modeBuffer.push(line)
            continue
        }

        if (line.includes(flags.JS_START)) {
            vars.mode = flags.JS_MODE
            if (line.includes(flags.JS_START + '|')) {
                vars.nameForBuffer = line.replace(flags.JS_START + '|', '')
            }
            continue
        }
        if (line.includes(flags.REPLACE_START)) {
            vars.mode = flags.REPLACE_MODE
            continue
        }

    }
    resultingOutText = resultingOutText.replace(new RegExp('mode:.*','g'), '')
    resultingOutText = resultingOutText.replace(new RegExp('\n\n\n\n','gs'), '') // spaces issue, not sure how else to fix this one.
    // replace everything in text area with the bag, except default - those don't get written out since they have no name and there's no where
    // to put them except there. 
    resultingOutText = findAndReplaceText(resultingOutText, bag)
    return resultingOutText
}

/**  
 example :
 mode: 
 $foo 
 $foo 
 foo = `bar` . will work, it's backwards, but it saves some time on vars
mode: 
  **/
export function replaceIfExistsInValues(bag: any, name: string | undefined, val: any) {
    //console.log('replaceIfExistsInValues', 'name',name, 'val', val, 'bag', bag)
    if (!name) {return}
    for (let key of Object.keys(bag)) {
        if ( bag[key].val.includes(name)) {
            bag[key].val = bag[key].val.replace(new RegExp('\\$'+name,'g'), val)
           
        }
    }
}
export function findAndReplaceText(outText: string, bag: any){
    for (let key of Object.keys(bag)) {
        // console.log('findAndReplaceText', 'key', '$'+key)
        if (outText.includes('$'+key)){
           
            outText=outText.replace(new RegExp(`\\$`+key,'gm'), bag[key].val)
            // console.log('found', key, bag[key].val)
        }
    }
    return outText 
}
// this will just make the bag, it's up to the caller to replace all calls following the line number with the new values. 
export function processReplace(findReplaceSection: string, lineNumber: number) {
    // make an object with key and {val, lineNumber:0} for each key
    let findReplaceBag =    parse(findReplaceSection)
    let outBag:any = {}
    for(let key of Object.keys(findReplaceBag)) {
        outBag[key] = {val: findReplaceBag[key] , lineNumber} 
    }
    return outBag
}
// todo, I might filter this out - do my own parsing or something, disable some fields such as fetch, filter it. 
export function processJS(text: string) {
    return eval(text)
}