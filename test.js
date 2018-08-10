/* global describe, it */

'use strict';

var assert = require('assert'),
    es = require('event-stream'),
    gutil = require('gulp-util'),
    PassThrough = require('stream').PassThrough,
    gccs = require('./index');


describe('gulp-gccs', () => {

    const js_codes = [
        // [ in, out ]
        ["let it = 'string' + 42 + \"concat\"", 'var it="string42concat";'],
        [";const x = () => 2*3*5; let val = x();", 'var x=function(){return 30},val=x();'],
    ];

    it('should work in buffer mode', (done) => {
        let idx = 0;
        const stream = gccs();

        stream.on('data', (newFile) => {
            // console.log(String(newFile.contents));
            assert.equal(js_codes[idx++][1], String(newFile.contents).trim());
        });

        stream.on('end', () => done());

        js_codes.forEach((v) => {
            let fakeFile = new gutil.File({
                contents: Buffer.from(v[0]),
            });

            stream.write(fakeFile);
        });

        stream.end();
    });

    it('should work in stream mode', function(done) {
        const stream = gccs();

        stream.on('data', function(file){
            let { idx } = file;

            file.pipe(es.wait((err, data) => {
                // console.log(String(data).trim());
                assert.equal(js_codes[idx][1], String(data).trim());
            }));
        });

        stream.on('end', () => done());

        js_codes.forEach((v, idx) => {
            const cnt = v[0];
            const fakeStream = new PassThrough();
            const fakeFile = new gutil.File({
                contents: fakeStream,
                idx
            });
            stream.write(fakeFile);

            for(let i=0,l=cnt.length; i<l; i+=10) {
                fakeStream.write(Buffer.from(cnt.slice(i, i+10)));
            }
            fakeStream.end();
        });

        stream.end();
    });

    it('should let null files pass through', (done) => {
        const stream = gccs();
        let n = 0;

        stream.pipe(es.through((file) => {
            assert.equal(file.path, 'null.md');
            assert.equal(file.contents,  null);
            n++;
        }, () => {
            assert.equal(n, 1);
            done();
        }));
        stream.write(new gutil.File({
            path: 'null.md',
            contents: null
        }));
        stream.end();
    });
});
