import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./PageNotFound";
import { get } from "./api/api";
import { showToast } from "./toasts/toast";
import StarIcon from "@mui/icons-material/Star";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import { transliterate } from "./api/transliteration";

function SoftwareDetail() {
  const { name } = useParams();
  const [SoftwareData, setSoftwareData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    get
      .SoftwareAll()
      .then((data) => {
        const software = data.find(
          (software) => transliterate(software.name) === name
        );
        setSoftwareData(software);
        setLoading(false); // Set loading to false once the data is fetched
        console.log(software);
      })
      .catch((error) => {
        console.error("Error fetching software data:", error);
        showToast(error, "error");
        setLoading(false); // Set loading to false in case of an error
      });
  }, [name]);

  if (!SoftwareData) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-200 py-8 px-16 FadeInSmall">
      <div className="p-16">
        <div className="bg-white p-12 rounded-lg shadow-xl">
          <div className="flex items-center">
            {loading ? (
              <div className="flex justify-center items-center mx-auto">
                <ClipLoader color={"#B5B4B4"} loading={loading} size={250} />
              </div>
            ) : (
              <>
                {/* Big white container */}
                <div className="w-full">
                  {/* 1/3 and 2/3 container */}
                  <div className="flex">
                    <div className="w-1/3 flex justify-center items-center">
                      <img
                        src={SoftwareData.logo_link}
                        alt="Software Logo"
                        className="rounded-40 mr-6"
                        draggable="false"
                      />
                    </div>

                    <div className="w-2/3">
                      <div className="p-4">
                        <h2 className="text-3xl font-semibold p-4">
                          Név: {SoftwareData.name}
                        </h2>
                        <p className="text-lg font-semibold pt-4 pb-4 pl-4 pr-0">
                          Értékelés: 4,6 ideiglenes{SoftwareData.rating}
                          <StarIcon
                            fontSize="medium"
                            className="starmargin"
                            style={{ color: "rgb(255, 210, 48)" }}
                          />
                        </p>
                        <p className="text-lg mt-4 p-4">
                          Leírás: {SoftwareData.description}
                        </p>
                        <button
                          className="ml-4 mt-6 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-md text-gray-900 font-semibold transition duration-300 inline-block"
                          onClick={() =>
                            window.open(SoftwareData.company.website)
                          }
                        >
                          Tovább a szoftver oldalára
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-20 mt-12 border-gray-200 border-2">
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <div>
                        <h3 className="text-2xl font-semibold">Nyelvek:</h3>
                        <p className="text-lg mt-2">
                          {SoftwareData.languages.join(", ")}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold">
                          Támogatott nyelvek:
                        </h3>
                        <p className="text-lg mt-2">
                          {SoftwareData.supports.join(", ")}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold">
                          Operációs rendszerek:
                        </h3>
                        <p className="text-lg mt-2">
                          {SoftwareData.oSs.join(", ")}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold">Eszközök:</h3>
                        <p className="text-lg mt-2">
                          {SoftwareData.devices.join(", ")}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold">Modulok:</h3>
                        <p className="text-lg mt-2">
                          {SoftwareData.moduls.join(", ")}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold">Árak:</h3>
                        <table className="table-auto">
                          <thead>
                            <tr>
                              <th className="px-4 py-2">Szint</th>
                              <th className="px-4 py-2">Díj</th>
                            </tr>
                          </thead>
                          <tbody>
                            {SoftwareData.remunerations.map((remuneration) => (
                              <tr key={remuneration.remunerationID}>
                                <td className="border px-4 py-2">
                                  {remuneration.level}
                                </td>
                                <td className="border px-4 py-2">
                                  {remuneration.type === "ajánlatkérés"
                                    ? "Ajánlatkérés"
                                    : `${remuneration.price} Ft/${remuneration.type}`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="col-span-2">
                        <h3 className="text-2xl font-semibold">Funkciók:</h3>
                        <div className="mt-4">
                          {SoftwareData.functions.map((func) => (
                            <div
                              key={func.softwareFunctionID}
                              className="flex items-center mb-2"
                            >
                              <input
                                type="checkbox"
                                checked={func.sfunction}
                                readOnly
                                className="mr-2 w-4 h-4 text-indigo-600"
                              />
                              <span className="text-lg">
                                {func.functionality}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoftwareDetail;
