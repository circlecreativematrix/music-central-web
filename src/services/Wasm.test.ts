
import { expect, test } from 'vitest'
import { runWasmAdd } from './Wasm'
import cMajorScale  from '../assets/example_standard_note.yaml';

test.skip("This only works if lots of effort goes into wasm", async () => {
   let add = await runWasmAdd(JSON.stringify(cMajorScale))
    console.log(add)
    expect(add).toBeTruthy()
    })
