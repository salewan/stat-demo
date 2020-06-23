function compareFn(a, b) {
  return a - b;
}

const buff = [];
export const add = value => {
  buff.push(Number.parseFloat(value));
  buff.sort(compareFn);
}

export const calc = () => {
  const len = buff.length;
  let ans = false;

  if (len > 0) {
    if (len % 2 === 0) {
      ans = [ buff[Math.floor(len) / 2 - 1], buff[Math.floor(len) / 2] ];
    } else {
      ans = buff[Math.floor(len / 2)];
    }
  }

  postMessage({ type: 'med', payload: ans });
}
