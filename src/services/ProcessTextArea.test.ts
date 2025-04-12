import { expect, test } from "vitest";
import { placeholderProgram } from "./MidiFileOut";
import { handleModesSeparate } from "./ProcessTextArea";

// todo , rewrite in Golang so macros can be sandboxed for golang go macro, python interpreter, and javascript interpreter. 

test("ProcessTextArea", async () => {
    const placeholderText = placeholderProgram();
    let bag:any = {}
    const modesSeparate = handleModesSeparate(placeholderText, bag)
    console.log(modesSeparate)
    expect(true).toBe(true)
})

