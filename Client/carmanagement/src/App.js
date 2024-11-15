import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import CreateCar from './pages/CreateCar/CreateCar';
import CarDetail from './pages/CarDetail/CarDetail';
import List from './pages/List/List';
import EditCar from './pages/EditCar/EditCar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/create-car" element={<CreateCar />} /> {/* Route to CreateCar page */}
        <Route path="/car/:id" element={<CarDetail />} /> {/* Route to individual car detail page */}
        <Route path="/edit-car/:id" element={<EditCar />} />
      </Routes>
    </Router>
  );
}

export default App;
