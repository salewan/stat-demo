const acc = [];

export const add = value => {
  acc.push(value);
};

export const calc = (n, avg) => {
  const sum = acc.map(({ quote, times }) => Math.pow(Number.parseFloat(quote) - avg, 2) * times / (n - 1))
    .reduce((acc, curr) => acc + curr, 0);

  const payload = Math.sqrt(sum);

  postMessage({ type: 'standardDeviation', payload });
}
