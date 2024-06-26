// src/App.js
import React from 'react';
import MyChart from './components/MyChart';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chart.js with React</h1>
      </header>
      <main>
        <MyChart />
      </main>
    </div>
  );
};

export default App;
