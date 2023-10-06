import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DropdownMenu from "./dropDown";
import { get } from "../api/api";
import { showToast } from "../toasts/toast";
import { transliterate } from "../api/transliteration";

export const Navbar = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [SoftwareData, setSoftwareData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSoftwareData, setFilteredSoftwareData] = useState([]);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLinkClick = () => {
    setSearchQuery(""); // Clear the search query on link click
  };

  const filterSoftwareData = () => {
    const filteredData = SoftwareData.filter((software) =>
      software.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Limit to the top 5 results
    const top5Results = filteredData.slice(0, 5);
    setFilteredSoftwareData(top5Results);
  };

  useEffect(() => {
    get
      .GettAllInfos()
      .then((data) => {
        setSoftwareData(data);
        filterSoftwareData();
      })
      .catch((error) => {
        showToast("Hiba történt az adatok lekérése közben", "error");
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterSoftwareData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <nav className="bg-gray-800 p-5 rounded-b-lg flex-grow relative">
      <div className="flex items-center">
        <Link
          to="/"
          className="text-white hover:text-gray-400 block mr-24 ml-4 text-[1.5rem] hover-scale hover-scalemain hover-scalemain:hover"
        >
          Főoldal
        </Link>

        <div
          className="relative group block mr-8 ml-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to={"/szoftverek"}>
            <button
              className={`text-white ${
                isDropdownVisible ? "text-gray-400" : "hover:text-gray-400"
              } block mr-8 hover-scale hover-scale:hover text-[1.2rem]`}
            >
              Szoftverek
            </button>
          </Link>
          {isDropdownVisible && <DropdownMenu />}
        </div>

        <Link
          to="/cegek"
          className="text-white hover:text-gray-400 block mr-12 hover-scale hover-scale:hover text-[1.2rem]"
        >
          Cégek
        </Link>

        <Link
          to="/osszehasonlitas"
          className="text-white hover:text-gray-400 block mr-12 hover-scale hover-scale:hover text-[1.2rem]"
        >
          Összehasonlítás
        </Link>

        <div className="flex-grow px-8 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Keresés"
              className="pl-8 pr-10 py-2 rounded-lg bg-gray-700 text-white focus:outline-none w-full hover-scale-small hover-scale-small:hover"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </div>

          {searchQuery && (
            <div className="absolute left-0 mt-2 z-10 bg-white rounded-lg shadow-md w-full">
              {filteredSoftwareData.map((software) => (
                <Link
                  key={software.softwareID}
                  to={`/szoftverek/${transliterate(
                    software.category_group
                  )}/${transliterate(software.category)}/${transliterate(
                    software.name
                  )}`}
                  className="block px-4 py-2 hover:bg-gray-200 text-gray-800 hover:text-black hover:rounded-lg"
                  onClick={handleLinkClick}
                >
                  {software.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/belepes"
          className="text-white hover:text-gray-400 ml-8 hover-scale hover-scale:hover text-[1rem] pr-3"
        >
          Belépés
        </Link>
        <Link
          to="/regisztracio"
          className="text-white hover:text-gray-400 mr-4 hover-scale hover-scale:hover text-[1rem]"
        >
          Regisztráció
        </Link>
      </div>
    </nav>
  );
};
