import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">ChatBot</Link>
        </li>
        <li>
          <Link to="/meme">Meme Generation</Link>
        </li>
        <li>
          <Link to="/imageEdit">Image Editing</Link>
        </li>
        <li>
          <Link to="/speechToText">Speech To Text</Link>
        </li>
      </ul>
    </nav>
  );
}
