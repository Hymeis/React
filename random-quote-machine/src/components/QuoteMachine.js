import React from "react";
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function QuoteMachine({quote, nextQuoteClickHandler}) {
    return (
        <Card variant="outlined" display="flex" sx={{backgroundColor: 'transparent'}}>
            <Box>
                <p >{quote.quote} -- {quote.author}</p>
                <Button variant="contained" 
                    onClick={nextQuoteClickHandler} 
                    color="success">Next Quote
                </Button>
            </Box>
            {/* <Button displayName='Next Quote' clickHandler={nextQuoteClickHandler}/> */}
        </Card>
    )
}

export default QuoteMachine;