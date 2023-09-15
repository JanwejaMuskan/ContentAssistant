import React, { useState, useRef } from "react";
import "./index.css"

function ImageEdit() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const applyFilter = () => {
    if (!selectedImage) return;

    // Create a new Image object
    const image = new Image();
    image.src = selectedImage;

    image.onload = () => {
      // Get the canvas context and draw the image on it
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      if (selectedFilter === "grayscale") {
        // Grayscale filter
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }

        ctx.putImageData(imageData, 0, 0);
      } else if (selectedFilter === "sepia") {
        // Sepia filter
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];

          data[i] = Math.min(255, 0.393 * red + 0.769 * green + 0.189 * blue);
          data[i + 1] = Math.min(255, 0.349 * red + 0.686 * green + 0.168 * blue);
          data[i + 2] = Math.min(255, 0.272 * red + 0.534 * green + 0.131 * blue);
        }

        ctx.putImageData(imageData, 0, 0);
      } else if (selectedFilter === "invert") {
        // Invert filter
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }

        ctx.putImageData(imageData, 0, 0);
      }

      // Update filteredImage state with the edited image
      const editedImageUrl = canvas.toDataURL("image/jpeg");
      setFilteredImage(editedImageUrl);
    };
  };

  return (
    <div className="image-edit-container">
      <h1>Image Editing</h1>
      <div className="image-upload">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            className="selected-image"
          />
        )}
        {selectedImage && <div className="filter-options">
          <label>Select a Filter:</label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="none">None</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
            <option value="invert">Invert</option>
            {/* Add more filter options here */}
          </select>
          <button className="Apply-filter" onClick={applyFilter}>Apply Filter</button>
        </div>
        }
      </div>

      <div>
        {selectedFilter !== "none" && (
          <>
            <h2>Edited Image</h2>
            <canvas ref={canvasRef}></canvas>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageEdit;
