class Average {
    name = 'Среднее';
    sum = 0;
    n = 0;

    add(arrayOfStringNumbers) {
        const numbers = arrayOfStringNumbers.map(n => Number.parseFloat(n));

        this.sum += numbers.reduce((a, b) => a + b, 0);
        this.n += arrayOfStringNumbers.length;
    }

    calc() {
        if (this.n === 0) return 0;
        return this.sum / this.n;
    }
}

class StandardDeviation {
    name = 'Стандартное отклонение';
    variance = 0;

    add(arrayOfStringNumbers) {
        if ( arrayOfStringNumbers.length > 1) {
            const numbers = arrayOfStringNumbers.map(n => Number.parseFloat(n));
            const average = numbers.reduce((a, b) => a + b, 0) / numbers.length;
            const n = numbers.length;
            this.variance += numbers.map(num => Math.pow(num - average, 2)).reduce((a, b) => a + b, 0) / (n - 1);
        }
    }

    calc() {
        if (this.variance === 0) return 0;
        else return Math.sqrt(this.variance);
    }
}

export const getData = async ({ min, max, count }) => {
    const t0 = new Date().getTime();
    const response = await fetch(`/api/data?min=${min}&max=${max}&count=${count}`);
    const genTime = new Date().getTime() - t0;
    const reader = response.body.getReader();

    let rest = "";
    const calculators = [new Average(), new StandardDeviation()];

    while(true) {
        const { done, value } = await reader.read();

        const str = rest + new TextDecoder("utf-8").decode(value);
        const arr = str.split(',');

        const head = arr.slice(0, arr.length - 1);
        rest = arr[arr.length - 1];

        if (done) {
            calculators.forEach(cal => cal.add(arr));
            break;
        } else {
            calculators.forEach(cal => cal.add(head));
        }
    }
    const values = calculators.reduce((acc, cal) => {
        return  {
            ...acc,
            [cal.name]: cal.calc()
        }
    }, {});

    return {
        genTime,
        values
    }
}
