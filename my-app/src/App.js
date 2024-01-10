import React from 'react';
import  CombinedEditor from './EditorComponent.js'; 
import Title from './Title.js';
import "./EditorComponent.css"

function App() {
  return (
    <div >
    <Title></Title>
    <div className='container'>
      <CombinedEditor></CombinedEditor>
      </div>
    </div>
    
  );
}

export default App;