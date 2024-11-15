import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./CreateCar.css";

function CreateCar() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("tags", formData.tags);

    Array.from(images).forEach((image) => data.append("images", image));

    try {
      await axios.post("http://localhost:5000/api/cars", data, config);
      alert("Car created successfully!");
    } catch (err) {
      alert("Failed to create car. Please try again.");
    }
  };

  return (
    <div className="createcar-wrapper">
      <Navbar />
      <div className="createcar-center">
        <form className="createcar-form" onSubmit={handleSubmit}>
          <input
            className="createcar-input"
            type="text"
            placeholder="Car Title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            className="createcar-textarea"
            placeholder="Description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
          <input
            className="createcar-input"
            type="text"
            placeholder="Tags (comma separated)"
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
          <input
            className="createcar-file-input"
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
          />
          <button className="createcar-submit-button" type="submit">
            Add Car
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCar;
