import React from "react";

function LanguageFilter({
  isLanguageCollapsed,
  toggleLanguageCollapse,
  LanguageData,
  selectedLanguage,
  handleLanguageClick,
}) {
  return (
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
              <label className="flex items-center text-md bg-white p-2 shadow-md mt-5 mb-5 rounded-xl pl-4 hover-scale-element:hover hover-scale-element hover:bg-gray-100">
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
  );
}

export default LanguageFilter;