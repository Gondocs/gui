import React, { useState, useEffect } from 'react';
import '../css/softwareList.css';
import StarIcon from '@mui/icons-material/Star';
import { Link, useParams } from 'react-router-dom';
import { transliterate } from './api/transliteration';
import { get } from './api/api';
import { showToast } from './toasts/toast';




const SoftwareList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { category } = useParams();

  console.log("hello: " + category)


  const [SoftwareData, setSoftwareData] = useState([]);
  const [MainCategoryData, setMainCategoryData] = useState([]);

  useEffect(() => {
    get.SoftwareAll()
      .then((data) => {
        setSoftwareData(data);
      })
      .catch((error) => {
        showToast('Hiba történt az adatok lekérése közben', 'error');
      });

    get.Category()
      .then((data) => {
        setMainCategoryData(data);
      })
      .catch((error) => {
        showToast('Hiba történt az adatok lekérése közben', 'error');
      });
  }, []);

  // transliterate the URL category parameter if it exists, DONE
  const transliteratedCategory = category ? transliterate(category) : '';

  // calculate unique categories based on the data from the API, DONE
  const uniqueCategories = Array.from(
    new Set(MainCategoryData.map((category) => transliterate(category.categoryGroup.name)))
  );

  // determine if the category is a main category, DONE
  const isMainCategory = uniqueCategories.includes(transliteratedCategory);

  let filteredSoftwareData;
  if (category) {
    if (isMainCategory) {
      // Filter by main category (including all subcategories)
      filteredSoftwareData = SoftwareData.filter(
        (software) =>
          transliterate(software.category.categoryGroup.name) === transliteratedCategory &&
          software.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by software name
      );
    } else {
      // Filter by subcategory
      filteredSoftwareData = SoftwareData.filter(
        (software) =>
          transliterate(software.category.name) === transliteratedCategory &&
          software.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by software name
      );
    }
  } else {
    // If the category is empty, display all software items
    filteredSoftwareData = SoftwareData.filter((software) =>
      software.name.toLowerCase().includes(searchTerm.toLowerCase()) // filter by software name
    );
  }

  const noResultsMessage = filteredSoftwareData.length === 0 ? (
    
    <div className="bg-white rounded-40 flex justify-center items-center fadeIn" style={{height: "10%", width: "50%", margin: "auto", marginTop: "7%"}}>
  <div className="text-gray-600 text-4xl text-center">A keresett szoftver nem található.</div>
</div>

  ) : null;

  return (
    <div className="flex min-h-screen bg-gray-100 py-8 px-16 FadeInSmall">

      <div className="w-1/5 bg-gray-200 p-8 rounded-40 mr-16">
        <h2 className="text-lg font-semibold mb-4 hover-scale-element:hover hover-scale-element">Szoftverkeresés</h2>
        <input
          type="text"
          placeholder="Szoftver neve..."
          className="border rounded-lg p-2 w-full hover-scale-element:hover hover-scale-element"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-3/4 p-4 bg-gray-200 rounded-40 ">
        <h1 className="text-2xl font-semibold mb-8 mt-2 ml-12 hover-scale-element:hover hover-scale-element">Szoftverlista</h1>
        <ul>
  {filteredSoftwareData.map((software) => (
    <li key={software.softwareID} className="mb-6 px-4 hover-scale-element:hover hover-scale-element FadeInSmall">
      <div className="bg-white rounded-40 p-4">
        <div className="flex mb-2 pl-4 pt-4">

          <Link to={`/szoftverek/${category}/${transliterate(software.name)}`}>
            <img
              src={software.logo_link}
              alt="Software Placeholder"
              className="w-56 h-28 mr-4 rounded-40"
              draggable="false"
            />
          </Link>
          <div>
            <Link
              to={`/szoftverek/${category}/${transliterate(software.name)}`}
              className="text-3xl font-semibold text-black"
            >
              {software.name}
            </Link>
            <Link to={`/szoftverek/${category}/${transliterate(software.company.name)}`}>
            <p className="text-gray-600 text-xl mb-2 mt-2">{software.company.name}</p>
            </Link>
            <div className="flex items-center">
              <span className="text-black text-lg mr-2">
                Vélemények: 
                <StarIcon fontSize="medium" className='starmargin' style={{ color: 'rgb(255, 210, 48)' }}/>
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-700 m-4">{software.description}</p>
      </div>
    </li>
  ))}
</ul>
      {noResultsMessage}


      </div>
    </div>
  );
};

export default SoftwareList;