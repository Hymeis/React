// src/Canvas.js
import React, { useRef, useState, useEffect } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [color, setColor] = useState('#000000'); // Default drawing color is black
  const [history, setHistory] = useState([]); // To store the history of canvas states

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        cancelLastAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [history]);

  const saveState = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prevHistory) => [...prevHistory, imageData]);
  };

  const startDrawing = (event) => {
    saveState(); // Save the current state before starting a new action
    const { offsetX, offsetY } = event.nativeEvent;
    const context = canvasRef.current.getContext('2d');
    context.lineWidth = isErasing ? 10 : 2;
    context.strokeStyle = isErasing ? '#ffffff' : color; // Use selected color if not erasing
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const context = canvasRef.current.getContext('2d');
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    canvasRef.current.getContext('2d').closePath();
  };

  const saveDrawing = () => {
    const dataURL = canvasRef.current.toDataURL('image/png');
    fetch('http://localhost:5000/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: dataURL }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const cancelLastAction = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove the last action from history
      context.putImageData(lastState, 0, 0); // Restore the canvas to the previous state
    }
  };

  const handleColorChange = (event) => {
    setColor(event.target.value); // Update the color state with the selected color
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        width={800}
        height={600}
        style={{ border: '1px solid #000' }}
      />
      <div>
        <button onClick={saveDrawing}>Save Drawing</button>
        <button onClick={toggleEraser}>
          {isErasing ? 'Switch to Draw' : 'Switch to Erase'}
        </button>
        <button onClick={cancelLastAction}>Cancel Last Action</button>
      </div>
      <div>
        <label htmlFor="colorPicker">Select Color: </label>
        <input
          type="color"
          id="colorPicker"
          value={color}
          onChange={handleColorChange}
          disabled={isErasing} // Disable color selection in eraser mode
        />
      </div>
    </div>
  );
};

export default Canvas;
