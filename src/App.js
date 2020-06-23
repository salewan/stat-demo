import React from 'react';

import cs from './App.module.scss';
import Loader from './loader';

import { calculateStat, genQuotes, pingUrl } from './api';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 1,
      max: 10,
      count: 100,
      results: null,

      url: 'https://yandex.ru',
      pingResult: null
    }
  }

  calculate = () => {
    this.setState({ results: null, loading: true });
    const t0 = new Date().getTime();
    genQuotes(this.state).then(acc => {
      this.setState({
        genTime: new Date().getTime() - t0
      });

      const t00 = new Date().getTime();
      Promise.all(calculateStat(acc)).then(results => {
        this.setState({
          results,
          calcTime: new Date().getTime() - t00,
          loading: false
        });
      })
    })
  }

  ping = () => {
    this.setState({
      pingLoading: true,
      pingResult: null
    });
    pingUrl(this.state.url).then(pingResult => {
      this.setState({
        pingLoading: false,
        pingResult
      });
    });
  }

  onInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }

  render() {
    const { min, max, count, results, genTime, calcTime, loading } = this.state;
    const { url, pingLoading, pingResult } = this.state;
    return (
      <div className={cs.App}>

        <h1>Статистика</h1>
        <label>
          Минимальное
          <input type='text' name='min' onChange={this.onInputChange} value={min} disabled={loading}/>
        </label>
        <label>
          Максимальное
          <input type='text' name='max' onChange={this.onInputChange} value={max} disabled={loading}/>
        </label>
        <label>
          Количество чисел
          <input type='text' name='count' onChange={this.onInputChange} value={count} disabled={loading}/>
        </label>
        {results &&
          <div className={cs.results}>
            <div>Время генерации: {genTime} ms.</div>
            <div>Время вычислений: {calcTime} ms.</div>
            {results.map((res, i) => (
              <div key={i}>{res.name}: {JSON.stringify(res.value, ' ', 2)}</div>
            ))}
          </div>
        }
        {loading && <div className={cs.loader}><Loader /></div>}
        <div className={cs.submit}>
          <button onClick={this.calculate} disabled={loading}>Посчитать</button>
        </div>

        <h1>Пингователь</h1>
        <div>
          <label>
            Адрес
            <input type='text' name='url'
                   onChange={this.onInputChange}
                   value={url}
                   disabled={pingLoading}
                   className={cs.url}
            />
          </label>
          {pingResult &&
            <div className={cs.results}>
              <div>Статус: {pingResult.status}</div>
              {pingResult?.ping && <div>Пинг: approx. {pingResult.ping} ms.</div>}
            </div>
          }
          {pingLoading && <div className={cs.loader}><Loader /></div>}
          <div className={cs.submit}>
            <button onClick={this.ping} disabled={pingLoading}>Попинговать</button>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
