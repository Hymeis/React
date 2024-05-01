import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import './App.css';
import Button from './components/Button';
import QuoteMachine from './components/QuoteMachine'

function App() {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState({quote: "Click to get your random quote!", author: "uwu"});

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const url = 'https://gist.githubusercontent.com/natebass/b0a548425a73bdf8ea5c618149fe1fce/raw/f4231cd5961f026264bb6bb3a6c41671b044f1f4/quotes.json';
        const response = await fetch(url);
        const data = await response.json();
        setQuotes(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchQuotes();
  }, []); // Empty dependency array to fetch quotes only once when the component mounts

  function nextQuoteClickHandler() {
    const randInt = _.random(0, quotes.length - 1);
    setQuote(quotes[randInt]);
    console.log(quotes[randInt]);
  }

  return (
    <div className="App" id="quote-box">
      <QuoteMachine quote={quote} nextQuoteClickHandler={nextQuoteClickHandler} classname='App'/>
    </div>
  );
}

export default App;