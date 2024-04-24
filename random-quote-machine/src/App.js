import logo from './logo.svg';
import './App.css';
import Button from './components/Button'
import { useState } from 'react'
import { setSelectionRange } from '@testing-library/user-event/dist/utils';

const _ = require("lodash");

async function componentDidMount() {
  const url = 'https://gist.githubusercontent.com/natebass/b0a548425a73bdf8ea5c618149fe1fce/raw/f4231cd5961f026264bb6bb3a6c41671b044f1f4/quotes.json';
  return new Promise(async (resolve, reject) => {
      try {
        const data = await fetch(url);
        const quotes = await data.json();
        resolve(quotes);
      } catch (error) {
        console.error(error);
      }
    }
  )

}
function App() {
  const [quote, setQuote] = useState('xd');
  const [index, setIndex] = useState(-1);
  const loadQuotes = componentDidMount();
  let quotes;
  loadQuotes.then((q) => {quotes = q});
  function nextQuoteClickHandler() {
    let randInt = _.random(0, quotes.length);
    setIndex(randInt);
    setQuote(quotes[randInt]);
    console.log(randInt);
    console.log(quotes[randInt]);
  }
  return (
    <div className="App" id="quote-box">
      <Button displayName='Next Quote' clickHandler={nextQuoteClickHandler}/>
    </div>
  );
}

export default App;
