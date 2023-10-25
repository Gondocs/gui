import React, { useState, useEffect } from "react";
import "../../css/softwareList.css";
import StarIcon from "@mui/icons-material/Star";
import { Link, useParams } from "react-router-dom";
import { transliterate } from "../api/transliteration";
import { get } from "../api/api";
import { showToast } from "../toasts/toast";
import { ClipLoader } from "react-spinners";
import Pagination from "../Pagination/pagination";
// eslint-disable-next-line no-unused-vars
import { css } from "@emotion/react";

const SoftwareList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { Maincategory, Subcategory } = useParams();

  const [currentMainCategoryName, setCurrentMainCategoryName] = useState("");
  const [currentSubCategoryName, setCurrentSubCategoryName] = useState("");

  const [SoftwareData, setSoftwareData] = useState([]);
  const [FunctionsData, setFunctionsData] = useState([]);
  const [CompatibilityData, setCompatibilityData] = useState([]);
  const [LanguageData, setLanguageData] = useState([]);
  const [OsData, setOsData] = useState([]);
  const [SupportData, setSupportData] = useState([]);

  const [selectedFunctions, setSelectedFunctions] = useState([]);
  const [selectedCompatibility, setSelectedCompatibility] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedOs, setSelectedOs] = useState([]);
  const [selectedSupport, setSelectedSupport] = useState([]);

  const [isFuncCollapsed, setIsFuncCollapsed] = useState(false);
  const [isCompatibilityCollapsed, setIsCompatibilityCollapsed] =
    useState(false);
  const [isLanguageCollapsed, setIsLanguageCollapsed] = useState(false);
  const [isOSCollapsed, setIsOSCollapsed] = useState(false);
  const [isSupportCollapsed, setIsSupportCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    get
      .SoftwareAll()
      .then((data) => {
        setSoftwareData(data);
        setLoading(false);
      })
      .catch((error) => {
        showToast("Hiba történt az adatok lekérése közben", "error");
        console.log(error);
        setLoading(false);
      });

    get
      .GetAllWithFunctions()
      .then((functionsData) => {
        setFunctionsData(functionsData);
      })
      .catch((error) => {
        showToast(
          "Hiba történt az adatok lekérése közben (AllFunctions)",
          "error"
        );
        console.log(error);
      });

    get
      .SoftwareCompConnect()
      .then((compatibiliyData) => {
        setCompatibilityData(compatibiliyData);
      })
      .catch((error) => {
        showToast("Hiba történt az adatok lekérése közben", "error");
        console.log(error);
      });

    get
      .SoftwareLangConnect()
      .then((LanguageData) => {
        setLanguageData(LanguageData);
      })
      .catch((error) => {
        showToast("Hiba történt az adatok lekérése közben", "error");
        console.log(error);
      });

    get
      .SoftwareOSConnect()
      .then((OsData) => {
        setOsData(OsData);
      })
      .catch((error) => {
        showToast("Hiba történt az adatok lekérése közben", "error");
        console.log(error);
      });

    get
      .Support()
      .then((SupportData) => {
        setSupportData(SupportData);
      })
      .catch((error) => {
        showToast("Hiba történt az adatok lekérése közben", "error");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(SoftwareData);
  }, [SoftwareData]);

  const transliteratedCategory = Maincategory
    ? transliterate(Maincategory)
    : "";

  const uniqueCategories = Array.from(
    new Set(
      SoftwareData.map((category) =>
        transliterate(category.category.categoryGroup.name)
      )
    )
  );

  const isMainCategory = uniqueCategories.includes(transliteratedCategory);

  let filteredSoftwareData;

  if (Maincategory) {
    if (Subcategory) {
      filteredSoftwareData = SoftwareData.filter((software) => {
        return (
          transliterate(software.category.categoryGroup.name) ===
            transliteratedCategory &&
          transliterate(software.category.name) ===
            transliterate(Subcategory) &&
          software.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          selectedFunctions.every((selectedFunc) =>
            software.functions
              .filter((func) => func.sfunction)
              .map((func) => func.functionality)
              .includes(selectedFunc)
          ) &&
          selectedCompatibility.every((selectedComp) =>
            software.devices.includes(selectedComp)
          ) &&
          selectedLanguage.every((selectedLang) =>
            software.languages.includes(selectedLang)
          ) &&
          selectedOs.every((selectedOS) => software.oSs.includes(selectedOS)) &&
          selectedSupport.every((selectedSupport) =>
            software.supports.includes(selectedSupport)
          )
        );
      });
    } else if (isMainCategory) {
      filteredSoftwareData = SoftwareData.filter((software) => {
        return (
          transliterate(software.category.categoryGroup.name) ===
            transliteratedCategory &&
          software.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          selectedFunctions.every((selectedFunc) =>
            software.functions
              .filter((func) => func.sfunction)
              .map((func) => func.functionality)
              .includes(selectedFunc)
          ) &&
          selectedCompatibility.every((selectedComp) =>
            software.devices.includes(selectedComp)
          ) &&
          selectedLanguage.every((selectedLang) =>
            software.languages.includes(selectedLang)
          ) &&
          selectedOs.every((selectedOS) => software.oSs.includes(selectedOS)) &&
          selectedSupport.every((selectedSupport) =>
            software.supports.includes(selectedSupport)
          )
        );
      });
    } else {
      filteredSoftwareData = SoftwareData.filter((software) => {
        return (
          transliterate(software.category.name) === transliteratedCategory &&
          software.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          selectedFunctions.every((selectedFunc) =>
            software.functions
              .filter((func) => func.sfunction)
              .map((func) => func.functionality)
              .includes(selectedFunc)
          ) &&
          selectedCompatibility.every((selectedComp) =>
            software.devices.includes(selectedComp)
          ) &&
          selectedLanguage.every((selectedLang) =>
            software.languages.includes(selectedLang)
          ) &&
          selectedOs.every((selectedOS) => software.oSs.includes(selectedOS)) &&
          selectedSupport.every((selectedSupport) =>
            software.supports.includes(selectedSupport)
          )
        );
      });
    }
  } else {
    filteredSoftwareData = SoftwareData.filter((software) => {
      return (
        software.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        selectedFunctions.every((selectedFunc) =>
          software.functions
            .filter((func) => func.sfunction)
            .map((func) => func.functionality)
            .includes(selectedFunc)
        ) &&
        selectedCompatibility.every((selectedComp) =>
          software.devices.includes(selectedComp)
        ) &&
        selectedLanguage.every((selectedLang) =>
          software.languages.includes(selectedLang)
        ) &&
        selectedOs.every((selectedOS) => software.oSs.includes(selectedOS)) &&
        selectedSupport.every((selectedSupport) =>
          software.supports.includes(selectedSupport)
        )
      );
    });
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSoftwareData = filteredSoftwareData.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFunctionClick = (func) => {
    if (selectedFunctions.includes(func)) {
      // Function is already selected, remove it
      setSelectedFunctions((prevSelected) =>
        prevSelected.filter((selected) => selected !== func)
      );
    } else {
      // Function is not selected, add it
      setSelectedFunctions((prevSelected) => [...prevSelected, func]);
    }
    setCurrentPage(1);
  };

  const handleCompatibilityClick = (compatibility) => {
    if (selectedCompatibility.includes(compatibility)) {
      // Compatibility is already selected, remove it
      setSelectedCompatibility((prevSelected) =>
        prevSelected.filter((selected) => selected !== compatibility)
      );
    } else {
      // Compatibility is not selected, add it
      setSelectedCompatibility((prevSelected) => [
        ...prevSelected,
        compatibility,
      ]);
    }
    setCurrentPage(1);
  };

  const handleLanguageClick = (language) => {
    if (selectedLanguage.includes(language)) {
      setSelectedLanguage((prevSelected) =>
        prevSelected.filter((selected) => selected !== language)
      );
    } else {
      // Compatibility is not selected, add it
      setSelectedLanguage((prevSelected) => [...prevSelected, language]);
    }
    setCurrentPage(1);
  };

  const handleOSClick = (OS) => {
    if (selectedOs.includes(OS)) {
      setSelectedOs((prevSelected) =>
        prevSelected.filter((selected) => selected !== OS)
      );
    } else {
      // Compatibility is not selected, add it
      setSelectedOs((prevSelected) => [...prevSelected, OS]);
    }
    setCurrentPage(1);
  };

  const handleSupportClick = (Support) => {
    if (selectedSupport.includes(Support)) {
      setSelectedSupport((prevSelected) =>
        prevSelected.filter((selected) => selected !== Support)
      );
    } else {
      // Compatibility is not selected, add it
      setSelectedSupport((prevSelected) => [...prevSelected, Support]);
    }
    setCurrentPage(1);
  };

  const toggleFuncCollapse = () => {
    setIsFuncCollapsed(!isFuncCollapsed);
  };

  const toggleCompatibilityCollapse = () => {
    setIsCompatibilityCollapsed(!isCompatibilityCollapsed);
  };

  const toggleLanguageCollapse = () => {
    setIsLanguageCollapsed(!isLanguageCollapsed);
  };

  const toggleOSeCollapse = () => {
    setIsOSCollapsed(!isOSCollapsed);
  };

  const toggleSupportCollapse = () => {
    setIsSupportCollapsed(!isSupportCollapsed);
  };

  useEffect(() => {
    setSelectedFunctions([]); // Reset when URL changes
    setSelectedCompatibility([]); // Reset when URL changes
    setSelectedLanguage([]); // Reset when URL changes
    setSelectedOs([]); // Reset when URL changes
    setSelectedSupport([]); // Reset when URL changes
  }, [Maincategory, Subcategory]);

  useEffect(() => {
    console.log(selectedFunctions);
    console.log(selectedCompatibility);
    console.log(selectedLanguage);
    console.log(selectedOs);
  });

  useEffect(() => {
    if (!Maincategory) {
      // If Maincategory is empty, set both CurrentMainCategoryName and CurrentSubCategoryName to empty
      setCurrentMainCategoryName("");
      setCurrentSubCategoryName("");
    } else {
      // Find the matching main category in SoftwareData
      const mainCategoryMatch = SoftwareData.find(
        (software) =>
          transliterate(software.category.categoryGroup.name) ===
          transliterate(Maincategory)
      );

      if (mainCategoryMatch) {
        setCurrentMainCategoryName(
          mainCategoryMatch.category.categoryGroup.name
        );
      }

      if (Subcategory) {
        // Find the matching main category in SoftwareData
        const subCategoryMatch = SoftwareData.find(
          (software) =>
            transliterate(software.category.name) === transliterate(Subcategory)
        );

        if (subCategoryMatch) {
          setCurrentSubCategoryName(subCategoryMatch.category.name);
        }
      }
    }
  }, [Maincategory, Subcategory, SoftwareData]);

  const totalPages = Math.ceil(filteredSoftwareData.length / itemsPerPage);

  const paginationControls = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
    />
  );

  const noResultsMessage =
    paginatedSoftwareData.length === 0 ? (
      <div
        className="bg-white rounded-40 flex justify-center items-center fadeIn"
        style={{
          height: "auto",
          width: "65%",
          margin: "auto",
          marginTop: "7%",
          padding: "2%",
        }}
      >
        <div className="text-black text-4xl text-center">
          A keresett szoftver nem található.
        </div>
      </div>
    ) : null;

  return (
    <div className="flex min-h-screen bg-gray-200 py-8 px-8 FadeInSmall">
      <div
        className="w-1/4 bg-white p-10 rounded-25 mr-4 ml-4 shadow-lg border border-gray-400"
        style={{ height: "100%", marginTop: "6.3%" }}
      >
        <h2 className="text-lg font-semibold mb-4 hover-scale-element:hover hover-scale-element">
          Szoftverkeresés
        </h2>
        <input
          type="text"
          placeholder="Szoftver neve..."
          className="border rounded-xl p-2 w-full hover-scale-element:hover hover-scale-element"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul>
          {FunctionsData.map((category) => {
            const mainCategory = transliterate(category.category_group);
            const subCategory = transliterate(category.name);
            const isMainCategoryMatch = mainCategory === Maincategory;
            const isSubCategoryMatch = subCategory === Subcategory;
            if (isMainCategoryMatch && (isSubCategoryMatch || !Subcategory)) {
              return (
                <li key={category.categoryID}>
                  <h3
                    className={`text-lg text-white my-4 p-2 rounded-xl text-center hover-scale-element:hover hover-scale-element ${
                      isFuncCollapsed
                        ? " bg-gray-700 transition-class"
                        : "bg-gray-800 transition-class"
                    }`}
                    onClick={toggleFuncCollapse}
                  >
                    {category.name}
                  </h3>
                  {!isFuncCollapsed ? null : (
                    <ul>
                      {category.func_list.map((func, index) => (
                        <li key={index} className="">
                          <label className="flex items-center text-md bg-white p-2 shadow-md mt-5 mb-5 rounded-xl pl-4 hover-scale-element:hover hover-scale-element hover:bg-gray-100 fadeInFast">
                            <input
                              type="checkbox"
                              checked={selectedFunctions.includes(func)}
                              onChange={() => handleFunctionClick(func)}
                              className="mr-2 cursor-pointer w-6 h-6"
                              style={{
                                minWidth: "25px",
                                maxWidth: "25px",
                                minHeight: "25px",
                                maxHeight: "25px",
                              }}
                            />
                            {func}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return null;
          })}
        </ul>

        <ul>
          <h1
            className={`text-lg text-white my-4 p-2 rounded-xl text-center hover-scale-element:hover hover-scale-element ${
              isCompatibilityCollapsed
                ? "bg-gray-600 transition-class"
                : "bg-gray-700 transition-class"
            }`}
            onClick={toggleCompatibilityCollapse}
          >
            Kompatibilítás
          </h1>
          {!isCompatibilityCollapsed ? null : (
            <ul>
              {CompatibilityData.map((compatibility, index) => (
                <li key={index}>
                  <label className="flex items-center text-md bg-white p-2 shadow-md mt-5 mb-5 rounded-xl pl-4 hover-scale-element:hover hover-scale-element hover:bg-gray-100 fadeInFast">
                    <input
                      type="checkbox"
                      checked={selectedCompatibility.includes(compatibility)}
                      onChange={() => handleCompatibilityClick(compatibility)}
                      className="mr-2 cursor-pointer w-6 h-6"
                      style={{
                        minWidth: "25px",
                        maxWidth: "25px",
                        minHeight: "25px",
                        maxHeight: "25px",
                      }}
                    />
                    {compatibility}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </ul>

        <ul>
          <h1
            className={`text-lg text-white my-4 p-2 rounded-xl text-center hover-scale-element:hover hover-scale-element ${
              isLanguageCollapsed
                ? "bg-gray-600 transition-class"
                : "bg-gray-700 transition-class"
            }`}
            onClick={toggleLanguageCollapse}
          >
            Szoftver Nyelve
          </h1>
          {!isLanguageCollapsed ? null : (
            <ul>
              {LanguageData.map((language, index) => (
                <li key={index}>
                  <label className="flex items-center text-md bg-white p-2 shadow-md mt-5 mb-5 rounded-xl pl-4 hover-scale-element:hover hover-scale-element hover:bg-gray-100 fadeInFast">
                    <input
                      type="checkbox"
                      checked={selectedLanguage.includes(language)}
                      onChange={() => handleLanguageClick(language)}
                      className="mr-2 cursor-pointer w-6 h-6"
                      style={{
                        minWidth: "25px",
                        maxWidth: "25px",
                        minHeight: "25px",
                        maxHeight: "25px",
                      }}
                    />
                    {language}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </ul>

        <ul>
          <h1
            className={`text-lg text-white my-4 p-2 rounded-xl text-center hover-scale-element:hover hover-scale-element ${
              isOSCollapsed
                ? "bg-gray-600 transition-class"
                : "bg-gray-700 transition-class"
            }`}
            onClick={toggleOSeCollapse}
          >
            Operációs Rendszerek
          </h1>
          {!isOSCollapsed ? null : (
            <ul>
              {OsData.map((OS, index) => (
                <li key={index}>
                  <label className="flex items-center text-md bg-white p-2 shadow-md mt-5 mb-5 rounded-xl pl-4 hover-scale-element:hover hover-scale-element hover:bg-gray-100 fadeInFast">
                    <input
                      type="checkbox"
                      checked={selectedOs.includes(OS)}
                      onChange={() => handleOSClick(OS)}
                      className="mr-2 cursor-pointer w-6 h-6"
                      style={{
                        minWidth: "25px",
                        maxWidth: "25px",
                        minHeight: "25px",
                        maxHeight: "25px",
                      }}
                    />
                    {OS}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </ul>

        <ul>
          <h1
            className={`text-lg text-white my-4 p-2 rounded-xl text-center hover-scale-element:hover hover-scale-element ${
              isSupportCollapsed
                ? "bg-gray-600 transition-class"
                : "bg-gray-700 transition-class"
            }`}
            onClick={toggleSupportCollapse}
          >
            Támogatás Nyelve
          </h1>
          {!isSupportCollapsed ? null : (
            <ul>
              {SupportData.map((Support, index) => (
                <li key={index}>
                  <label className="flex items-center text-md bg-white p-2 shadow-md mt-5 mb-5 rounded-xl pl-4 hover-scale-element:hover hover-scale-element hover:bg-gray-100 fadeInFast">
                    <input
                      type="checkbox"
                      checked={selectedSupport.includes(Support)}
                      onChange={() => handleSupportClick(Support)}
                      className="mr-2 cursor-pointer w-6 h-6"
                      style={{
                        minWidth: "25px",
                        maxWidth: "25px",
                        minHeight: "25px",
                        maxHeight: "25px",
                      }}
                    />
                    {Support}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </ul>
      </div>

      <div className="w-4/5 p-4 bg-gray-200 rounded-40">
        {!currentMainCategoryName && !currentSubCategoryName ? (
          <h1 className="text-2xl text-black font-semibold mb-8 mt-2 ml-12 hover-scale-element:hover hover-scale-element">
            Szoftverlista
          </h1>
        ) : (
          <h1 className="text-3xl text-black font-semibold mb-8 mt-2 ml-12">
            {Maincategory && (
              <Link to={`/szoftverek/${transliterate(Maincategory)}`}>
                {currentMainCategoryName}
              </Link>
            )}
            {currentSubCategoryName && Subcategory && (
              <>
                &nbsp;&raquo;&nbsp;
                <Link
                  to={`/szoftverek/${transliterate(
                    Maincategory
                  )}/${transliterate(Subcategory)}`}
                >
                  {currentSubCategoryName}
                </Link>
              </>
            )}
          </h1>
        )}

        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <ClipLoader color={"#B5B4B4"} loading={loading} size={250} />
          </div>
        ) : (
          <>
            <ul>
              {paginatedSoftwareData.map((software) => (
                <li
                  key={software.softwareID}
                  className="pb-8 px-4 hover-scale-element:hover hover-scale-element FadeInSmall"
                >
                  <div
                    className="bg-white rounded-25 pt-12 pb-12 pr-12 pl-6 border border-gray-400 flex shadow-xl"
                    style={{ height: "300px" }}
                  >
                    {/* Container for the image (1/3 of the width) */}
                    <Link
                      to={`/szoftverek/${transliterate(
                        software.category.categoryGroup.name
                      )}/${transliterate(
                        software.category.name
                      )}/${transliterate(software.name)}`}
                      className="w-1/3 flex justify-center items-center shadow-custom m-4 rounded-25"
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      <div className="flex items-center">
                        <img
                          src={software.company.logo_link}
                          alt="Software Placeholder"
                          className="pl-4 pr-4"
                          draggable="false"
                          style={{
                            width: "auto",
                            height: "auto",
                            maxHeight: "150px",
                          }}
                        />
                      </div>
                    </Link>

                    {/* Container for the data (2/3 of the width) */}
                    <div className="w-2/3 flex flex-col justify-center pl-6 pr-4 ">
                      <Link
                        to={`/szoftverek/${transliterate(
                          software.category.categoryGroup.name
                        )}/${transliterate(
                          software.category.name
                        )}/${transliterate(software.name)}`}
                        className="text-3xl font-semibold text-black"
                        onClick={() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                      >
                        {software.name}
                      </Link>
                      <Link
                        to={`/cegek/${transliterate(software.company.name)}`}
                        onClick={() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                      >
                        <p className="text-gray-600 text-xl mb-2">
                          {software.company.name}
                        </p>
                      </Link>
                      <div className="flex items-center ">
                        <span className="text-black text-lg mr-2">
                          Vélemények: {software.average_stars}
                          <StarIcon
                            fontSize="medium"
                            className="starmargin"
                            style={{ color: "rgb(255, 210, 48)" }}
                          />
                        </span>
                      </div>
                      <p className="text-gray-700">{software.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {noResultsMessage}
            {totalPages > 1 && paginationControls}
          </>
        )}
      </div>
    </div>
  );
};

export default SoftwareList;