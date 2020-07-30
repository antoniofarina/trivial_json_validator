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

const fs = require('fs')
const validate_json = require("../index").validate_json
const expect = require('chai').expect
const assert = require('chai').assert



//1. unit under test
describe('Json validator',  function() {
    describe('Ok on non broken file',  function() {
        it('When valid json is passed, then it retunr as is', async () => {
            let valid = fs.readFileSync(__dirname + '/valid.json').toString()
            let fixed = await validate_json(valid)
            expect(valid === fixed );
        
      });
    });

    describe('On  broken file', function() {
        it('When invalid json is passed, then it is able to fix if the error is related to extra spaces/extra newlines', async function () {
            this.timeout(0)
            let broken = fs.readFileSync(__dirname + '/broken.json').toString()
            let fixed = await validate_json(broken)
            expect(typeof (fixed)).to.equal('string');
        });

        it('When invalid json is passed, then it throws if error is not related to extra spaces/extra newlines', async function () {
            this.timeout(0)
            let broken = fs.readFileSync(__dirname + '/broken_unfixable.json').toString()
            //let fixed = await validate_json(broken)
            let bind = validate_json.bind(validate_json, broken)
            expect(function (){ validate_json (broken)}).to.throw();
        });

      });
  });

