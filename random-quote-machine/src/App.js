import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { MuiThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import './App.css';

import QuoteMachine from './components/QuoteMachine'
import { ThemeProvider } from '@emotion/react';

function App() {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState({quote: "Click to get your random quote!", author: "uwu"});
  const THEME = createTheme({
    typography: {
     "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
     "fontSize": 14,
     "fontWeightLight": 300,
     "fontWeightRegular": 400,
     "fontWeightMedium": 500
    }
 });
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
    <ThemeProvider theme={THEME}>
      <Box className="App" id="quote-box" sx={{
        backgroundColor: "#C1F7DC",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw"
      }}>
        <QuoteMachine quote={quote} nextQuoteClickHandler={nextQuoteClickHandler}/>
      </Box>
    </ThemeProvider>
  );
}

export default App;