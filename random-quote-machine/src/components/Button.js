import React from 'react';

function Button({displayName, clickHandler}){
    return (
        <button onClick={clickHandler}>{displayName}</button>
    )
};

export default Button;