const express = require("express");
const { Readable } = require('stream');
const app = express();

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

class Counter extends Readable {
    constructor(opt) {
        super(opt);

        this._rowSize = 10;
        this._index = 0;
        this._min = opt.min;
        this._max = opt.max;
        this._count = opt.count;
    }

    _read() {
        const n = Math.min(this._rowSize, this._count - this._index);
        this._index += n;

        if (n === 0) {
            this.push(null);
        } else {
            const numbers = new Array(n);
            for (let i = 0; i < n; i ++) {
                numbers[i] = randomInRange(this._min, this._max);
            }
            const str = (this._index === n ? '' : ',') + numbers.join(',');
            const buf = Buffer.from(str, 'utf8');
            this.push(buf);
        }
    }
}

function validateRequest(query) {
    const errors = [];
    const { min, max, count } = query;
    if (!min) {
        errors.push('min required');
    }
    if (!max) {
        errors.push('max required');
    }
    if (!count) {
        errors.push('count required');
    }
    return errors;
}

app.get('/api/data', function (req, res) {
    const errors = validateRequest(req.query);
    if (errors.length > 0) {
        res.status(400).send(errors.join('\n'));
    }

    const counter = new Counter({ highWaterMark: 16384, ...req.query });
    counter.pipe(res);
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
