// src/Canvas.js
import React, { useRef, useState, useEffect } from 'react';
import './Canvas.css'; // Assuming we have some basic styling

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('draw'); // 'draw' or 'erase'
  const [color, setColor] = useState('#000000'); // Default drawing color is black
  const [undoHistory, setUndoHistory] = useState([]); // To store the history of canvas states for undo
  const [redoHistory, setRedoHistory] = useState([]); // To store the history of canvas states for redo

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        undoLastAction();
      }
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        redoLastAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undoHistory, redoHistory]);

  const saveState = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setUndoHistory((prevHistory) => [...prevHistory, imageData]);
    setRedoHistory([]); // Clear redo history on new action
  };

  const startDrawing = (event) => {
    saveState(); // Save the current state before starting a new action
    const { offsetX, offsetY } = event.nativeEvent;
    const context = canvasRef.current.getContext('2d');
    context.lineWidth = mode === 'erase' ? 10 : 2;
    context.strokeStyle = mode === 'erase' ? '#ffffff' : color; // Use selected color if not erasing
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
    fetch('http://localhost:5000/send-image', {
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

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'draw' ? 'erase' : 'draw'));
  };

  const undoLastAction = () => {
    if (undoHistory.length === 0) return; // Do nothing if there's nothing to undo

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Move the current state to redoHistory before undoing
    const currentImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setRedoHistory((prevHistory) => [currentImageData, ...prevHistory]);

    // Apply the last state from undoHistory
    const lastState = undoHistory[undoHistory.length - 1];
    setUndoHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove the last action from undo history
    context.putImageData(lastState, 0, 0); // Restore the canvas to the previous state
  };

  const redoLastAction = () => {
    if (redoHistory.length === 0) return; // Do nothing if there's nothing to redo

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Move the current state to undoHistory before redoing
    const currentImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setUndoHistory((prevHistory) => [...prevHistory, currentImageData]);

    // Apply the last state from redoHistory
    const lastState = redoHistory[0];
    setRedoHistory((prevHistory) => prevHistory.slice(1)); // Remove the last action from redo history
    context.putImageData(lastState, 0, 0); // Restore the canvas to the redone state
  };

  const handleColorChange = (event) => {
    setColor(event.target.value); // Update the color state with the selected color
  };

  return (
    <div className="canvas-container">
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
      <div className="controls">
        <button onClick={saveDrawing}>Save Drawing</button>
        <button onClick={toggleMode}>
          {mode === 'erase' ? 'Switch to Draw' : 'Switch to Erase'}
        </button>
        <button onClick={undoLastAction}>Undo Last Action</button>
        <button onClick={redoLastAction}>Redo Last Action</button>
        <label htmlFor="colorPicker">Select Color: </label>
        <input
          type="color"
          id="colorPicker"
          value={color}
          onChange={handleColorChange}
          disabled={mode === 'erase'} // Disable color selection in eraser mode
        />
      </div>
    </div>
  );
};

export default Canvas;
