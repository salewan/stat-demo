let maxTimes = 0;
let current = [];

export const add = ({ quote: quoteStr, times }) => {
  const quote = Number.parseFloat(quoteStr);
  if (times > maxTimes) {
    maxTimes = times;
    current = [quote];
  } else if (times === maxTimes) {
    current.push(quote);
  }
}

export const calc = () => {
  let ans = false;
  if (current.length === 1) {
    ans = current[0];
  } else if (current.length > 1) {
    ans = current;
  }
  postMessage({ type: 'mod', payload: ans });
}
