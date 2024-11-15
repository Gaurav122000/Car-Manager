import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import './EditCar.css';

function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState({
    title: "",
    description: "",
    tags: "",
    images: [],
  });
  const [newImages, setNewImages] = useState([]); // Store new images only

  useEffect(() => {
    const fetchCar = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCar(response.data);
    };
    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({
      ...car,
      [name]: value,
    });
  };

  const handleFileUpload = (e) => {
    setNewImages(e.target.files); // Set new images
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", car.title);
    formData.append("description", car.description);
    formData.append("tags", car.tags);

    // Append new images only if files are selected
    if (newImages.length > 0) {
      Array.from(newImages).forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/cars/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Car details updated successfully!");
      navigate(`/car/${id}`);
    } catch (error) {
      console.error("Error updating car:", error);
      alert("Failed to update car. Please try again.");
    }
  };

  return (
    <div className="editcar-wrapper">
      <Navbar />
      <div className="editcar-center">
        <form className="editcar-form" onSubmit={handleSubmit}>
          <input
            className="editcar-input"
            type="text"
            name="title"
            value={car.title}
            placeholder="Car Title"
            onChange={handleChange}
          />

          <textarea
            className="editcar-textarea"
            name="description"
            placeholder="Description"
            value={car.description}
            onChange={handleChange}
          />

          <input
            className="editcar-input"
            type="text"
            name="tags"
            value={car.tags}
            onChange={handleChange}
            placeholder="Tags (comma seprated)"
          />

          <div>
            <input className="editcar-file-input" type="file" multiple onChange={handleFileUpload} accept="image/jpeg, image/png" />
            <div>
              {car.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image}`}
                  alt={`Car Image ${index + 1}`}
                  style={{ width: "100px", margin: "5px" }}
                />
              ))}
            </div>
          </div>
          <button className="editcar-submit-button" type="submit">
            Update Car
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCar;
