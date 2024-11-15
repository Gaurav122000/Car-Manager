import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './List.css';

function List() {
  const [cars, setCars] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState(''); // Track search keyword
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/cars', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error.response || error.message);
        alert("Failed to fetch cars. Please try again.");
      }
    };

    fetchCars();
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <div className='list-Back'>
          <Navbar />
          <div className="list-container">
            <h2>You are not logged in</h2>
            <p className="auth-message">
              Please <Link to="/">log in</Link> to view your cars.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Filter cars based on the search keyword
  const filteredCars = cars.filter(car =>
    car.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    car.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    (car.tags && car.tags.some(tag => tag.toLowerCase().includes(searchKeyword.toLowerCase())))
  );
  

  return (
    <div className='list-Back'>
      <Navbar />
      <div className="list-container">
        <h2>Your Cars</h2>
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search cars by title, description, or tags..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="search-input"
        />

        {/* Display Filtered Cars */}
        {filteredCars.length > 0 ? (
          filteredCars.map(car => (
            <Link to={`/car/${car._id}`} key={car._id} className="car-item-link">
              <div className="car-item">
                <h3>{car.title}</h3>
                {/* <p>{car.description}</p> */}
              </div>
            </Link>
          ))
        ) : (
          <p className="no-results">No cars match your search criteria.</p>
        )}
      </div>
    </div>
  );
}

export default List;
