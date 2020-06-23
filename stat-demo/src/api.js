import MedWorker from 'workerize-loader!./MedWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import ModWorker from 'workerize-loader!./ModWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import AverageWorker from 'workerize-loader!./AverageWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import STDWorker from 'workerize-loader!./STDWorker'; // eslint-disable-line import/no-webpack-loader-syntax

function randomInRange(min, max, precision) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return precision > 0 ? rand.toFixed(precision) : Math.round(rand) + '';
}

const DEFAULT_PRECISION = 0;
export function genQuotes({ count, min, max, precision = DEFAULT_PRECISION }) {
  const CHUNK_SIZE = 100;
  let index = 0;
  const acc = {};
  return new Promise(resolve => {
    function doChunk() {
      let cnt = CHUNK_SIZE;
      while (cnt-- && index < count) {
        const quote = randomInRange(min, max, precision);
        acc[quote] = (acc[quote] || 0) + 1;
        ++index;
      }
      if (index < count) {
        setTimeout(doChunk, 1);
      } else {
        resolve(acc);
      }
    }

    doChunk();
  })
}

export function calculateStat(acc) {
  const med = MedWorker();
  const mod = ModWorker();
  const avg = AverageWorker();
  const std = STDWorker();

  const promises = [];

  promises.push(new Promise(resolve => {
    med.addEventListener('message', e => {
      if (e.data.type === 'med') {
        resolve({ name: 'Медиана', value: e.data.payload });
      }
    })
  }));

  promises.push(new Promise(resolve => {
    mod.addEventListener('message', e => {
      if (e.data.type === 'mod') {
        resolve({ name: 'Мода', value: e.data.payload });
      }
    })
  }));

  promises.push(new Promise(resolve => {
    std.addEventListener('message', e =>{
      if (e.data.type === 'standardDeviation') {
        resolve({ name: 'Стандартное отклонение', value: e.data.payload });
      }
    })
  }));

  promises.push(new Promise(resolve => {
    avg.addEventListener('message', e => {
      if (e.data.type === 'avg') {
        std.calc(e.data.payload.n, e.data.payload.avg);
        resolve({ name: 'Среднее', value: e.data.payload.avg });
      }
    })
  }));

  Object.getOwnPropertyNames(acc).forEach(quote => {
    med.add(quote);
    mod.add({ quote, times: acc[quote] });
    avg.add({ quote, times: acc[quote] });
    std.add({ quote, times: acc[quote] });
  });

  med.calc();
  mod.calc();
  avg.calc();

  return promises;
}
