import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExercisePage from './pages/AddExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import { useState } from 'react';
import Navigation from './components/Navigation';


function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState([]);

  return (
    <div className="App">
       <header>
            <h1>Exercise Tracker</h1>
            <p>Full Stack MERN App Demonstration</p>
        </header>

          
      <Router>
      <Navigation />
        <div className="App-header">
         
          <Routes>
            <Route path="/" element={<HomePage setExerciseToEdit={setExerciseToEdit} />} />
            <Route path="/add-exercise" element={<AddExercisePage />} />
            <Route path="/edit-exercise" element={<EditExercisePage exerciseToEdit={exerciseToEdit} />} />
          </Routes>
        </div>
      </Router>
      <footer>
        <p>© 2022 Jennifer Hoang</p>
      </footer>
    </div>
  );
}

export default App;