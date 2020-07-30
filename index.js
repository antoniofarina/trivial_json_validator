/*
 * Antonio Farina
 * ant.farina@gmail.com
 * Created on Wed Jul 29 2020 4:15:08 PM
 *
 *
 * The MIT License (MIT)
 * Copyright (c) 2020 Antonio Farina
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
 */


const jsonlint = require('jsonlint-mod')
const minify = require("jsonminify")
const beautify = require('js-beautify/js/lib/beautify');

const validate_json = async (input) => {
    let parse_error = ''
    try {
        parsed = JSON.parse(input)
        return input
    } catch (e) {
        parse_error = e
        console.error ("invalid json: will try to fix ")
    }

    try {
        let minified = minify(input)
        await jsonlint.parse(minified);
        let reformat = await beautify.js_beautify(minified, {
            indent_with_tabs: false
        })
        return reformat
    } catch (e) {
        let error_message = _get_error_message(parse_error, input)
        if (!error_message) {
            error_message = `Invalid json ${e.message}`
        }
        
        console.error("json validator error ", error_message);
        throw (error_message)
    }
}

const _get_error_message = (e, input_string) => {
    e = e.message? e.message: e.toString()
    let pos = e.match(/position (\d+)/)
    //console.log (pos)
    // unable to extract the position of the error. Exititing
    if (!pos[1]) {
        return null
    }
    let message = e.substr(0, pos['index']-1)

    // extrct the error position from the message
    let _abs_error_position = parseInt(pos[1]) + 1
    // extract the input string fro the beginning until the error position
    let _err_substr = input_string.substr(0, _abs_error_position)
    // split the substring by lines
    let _lines = _err_substr.split("\n")

    // the error is at last line
    let error_line = _lines.length 

    // the position of the error is at the last extracted char 
    let error_position = (_lines.pop().length) - 1 
    
    //console.log("error point",  error_line_content[error_position] )
    return `${message} line ${error_line} position ${error_position}`
}

exports.validate_json = validate_json
