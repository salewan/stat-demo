import React from 'react';
import cs from './App.module.scss';
import { getData } from './controller';

function App() {
  const [values, setValues] = React.useState({
    min: '1',
    max: '10',
    count: '10000'
  });
  const [result, setResult] = React.useState(null);

  const doCalc = async () => {
    const res = await getData(values);
    setResult(res);
  }

  const onInputChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <div className={cs.App}>
      <label>
        Максимальное
        <input type='text' name='min' onChange={onInputChange} value={values.min}/>
      </label>
      <label>
        Минимальное
        <input type='text' name='max' onChange={onInputChange} value={values.max}/>
      </label>
      <label>
        Количество чисел
        <input type='text' name='count' onChange={onInputChange} value={values.count}/>
      </label>
      {result &&
        <div className={cs.results}>
          <div>Время генерации: {result.genTime} ms.</div>
          {Object.getOwnPropertyNames(result.values).map((name, i) => (
            <div key={i}>{name}: {result.values[name]}</div>
          ))}
        </div>
      }
      <div className={cs.submit}>
        <button onClick={doCalc}>Посчитать</button>
      </div>
    </div>
  );
}

export default App;
