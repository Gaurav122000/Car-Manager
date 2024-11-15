import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./CarDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";

function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Car deleted successfully!");
      navigate("/list"); // Redirect to the list page after deletion
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete the car. Please try again.");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-car/${id}`); // Navigate to the edit car page
  };

  const handleBack = () => {
    navigate("/list"); // Go back to the previous page
  };

  return car ? (
    <div className="car-detail-container">
      <Navbar />
      <div className="car-detail-content">
        {/* Delete Button */}
        <FontAwesomeIcon
          className="delete-btn"
          onClick={handleDelete}
          icon={faTrash}
          size="sm"
          style={{ color: "#d21414" }}
        />
        {/* Edit Button */}
        <FontAwesomeIcon
          className="edit-btn"
          onClick={handleEdit}
          icon={faPenToSquare}
          size="xs"
          style={{ color: "#63E6BE" }}
        />

        {/* Car Title */}
        <h2 className="car-title">{car.title}</h2>

        {/* Image Slider */}
        <div className="car-slider">
          {car.images && car.images.length > 0 ? (
            car.images.map((image, index) => (
              <img
                key={index}
                src={
                  image.startsWith("http")
                    ? image
                    : `http://localhost:5000/${image}`
                }
                alt={`Car Image ${index + 1}`}
                className="car-image"
              />
            ))
          ) : (
            <p>No images available for this car.</p>
          )}
        </div>

        {/* Car Description */}
        <p className="car-description">
          {" "}
          <b>Description: </b> {car.description}
        </p>
      </div>

      {/* Back Button */}
      <div className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon
          icon={faArrowLeftLong}
          size="lg"
          style={{ color: "#fafafa" }}
        />{" "}
        Back
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default CarDetail;
