const THREAD_POOL_SIZE = 4;
let sum = 0;
let n = 0;

export const add = ({ quote: quoteStr, times }) => {
  const quote = Number.parseFloat(quoteStr);
  sum += quote * times;
  n += times;
}

export const calc = () => {
  let avg = n > 0 ? sum / n : 0;
  postMessage({ type: 'avg', payload: {avg, n } });
}
