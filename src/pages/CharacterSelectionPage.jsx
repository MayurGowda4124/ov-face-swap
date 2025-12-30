import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CharacterSelectionPage.css";

const CharacterSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Character images - 2 male and 2 female
  // You'll need to add these images to public/assets/ folder
  const characters = [
    { id: "male1", gender: "male", image: "/assets/male1.jpg", name: "Male Character 1" },
    { id: "male2", gender: "male", image: "/assets/male2.jpg", name: "Male Character 2" },
    { id: "female1", gender: "female", image: "/assets/female1.jpg", name: "Female Character 1" },
    { id: "female2", gender: "female", image: "/assets/female2.jpg", name: "Female Character 2" },
  ];

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleContinue = () => {
    if (selectedCharacter) {
      localStorage.setItem("selectedCharacter", selectedCharacter.image);
      navigate("/capture");
    } else {
      alert("Please select a character to continue");
    }
  };

  return (
    <div className="screen content-background">
      <div className="character-selection-content">
        <h1 className="page-title">Select Your Character</h1>
        
        <div className="characters-grid">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`character-card ${
                selectedCharacter?.id === character.id ? "selected" : ""
              }`}
              onClick={() => handleCharacterSelect(character)}
            >
              <img
                src={character.image}
                alt={character.name}
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ECharacter%3C/text%3E%3C/svg%3E";
                }}
              />
              <p className="character-name">{character.name}</p>
            </div>
          ))}
        </div>

        <button
          className="button continue-button"
          onClick={handleContinue}
          disabled={!selectedCharacter}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CharacterSelectionPage;

