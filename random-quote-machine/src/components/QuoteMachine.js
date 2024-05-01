import React from "react";
import Button from "./Button";

function QuoteMachine({quote, nextQuoteClickHandler}) {
    return (
        <>
            <p>{quote.quote} -- {quote.author}</p>
            <Button displayName='Next Quote' clickHandler={nextQuoteClickHandler}/>
        </>
    )
}

export default QuoteMachine;