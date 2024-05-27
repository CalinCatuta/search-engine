import React, { useContext, useEffect, useRef, useState } from "react";

import TagsContext from "../context/TagsContext";
import sageata from "../assets/svg/arrow_bottom.svg";
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";
// scss
import "../scss/filtre.scss";
import { getNameOfCompanies } from "../utils/fetchData";
import { orase } from "../utils/getCityName";

// Regular expressions for replacing special characters
const aREG = new RegExp("ș", "g");
const bREG = new RegExp("ț", "g");
const cREG = new RegExp("â", "g");
const dREG = new RegExp("ă", "g");
const eREG = new RegExp("î", "g");

interface CheckboxFilterProps {
  items: string[];
  filterKey: string;
  searchFor: string;
  dropDown: boolean[];
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  items,
  filterKey,
  searchFor,
  dropDown
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

  useEffect(() => {
    if (dropDown[0] || dropDown[1]) {
      setSearchQuery("");
    }
  }, [dropDown]);

  const filteredItems = items.filter(
    (item) =>
      (searchQuery.length >= 1 &&
        item
          .toLowerCase()
          .replace(aREG, "s")
          .replace(bREG, "t")
          .replace(cREG, "a")
          .replace(dREG, "a")
          .replace(eREG, "i")
          .includes(searchQuery.toLowerCase())) ||
      item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setError(filteredItems.length === 0 && searchQuery.length > 0);
  }, [filteredItems, searchQuery]);

  let displayItems = filteredItems;

  const checkedItems = displayItems.filter((item) =>
    fields[filterKey].includes(item)
  );
  const uncheckedItems = displayItems.filter(
    (item) => !fields[filterKey].includes(item)
  );
  displayItems = [...checkedItems, ...uncheckedItems.slice(0, 10)];

  return (
    <div className="search-input">
      <div className="search-container">
        <img className="lupa" src={magnifyGlass} alt="magnify-glass" />
        <input
          type="search"
          value={searchQuery}
          placeholder={`Cauta ${searchFor}`}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="checkbox-container">
        {error ? (
          <div>Nu există rezultate "{searchQuery}"</div>
        ) : (
          displayItems.map((item, index) => (
            <div key={index} className="checkbox-parent">
              <input
                type="checkbox"
                id={item}
                name={filterKey}
                value={item}
                checked={fields[filterKey].includes(item)}
                onChange={(e) => handleCheckBoxChange(e, filterKey)}
              />
              <label htmlFor={item}>{item}</label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const FiltreGrup: React.FC = () => {
  const [data, setData] = useState<string[]>([]);

  const refDropdown = useRef<HTMLDivElement>(null);
  const { fields, handleCheckBoxChange } = useContext(TagsContext);
  const [dropDown, setDropDown] = useState<boolean[]>([false, false, false]);

  function handleDropDown(index: number) {
    const updatedDropDown = dropDown.map((item, i) =>
      i === index ? !item : false
    );
    setDropDown(updatedDropDown);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNameOfCompanies();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getButtonStyle = (index: number) => {
    if (index === 0 && fields.orase.length >= 1) {
      return { color: "#048a81" };
    } else if (index === 1 && fields.company.length >= 1) {
      return { color: "#048a81" };
    } else if (index === 2 && fields.remote.length >= 1) {
      return { color: "#048a81" };
    } else {
      return {};
    }
  };

  const getButtonLabel = (index: number) => {
    if (index === 0) {
      return `Oraș ${
        fields.orase.length >= 1 ? `(${fields.orase.length})` : ""
      }`;
    } else if (index === 1) {
      return `Companie ${
        fields.company.length >= 1 ? `(${fields.company.length})` : ""
      }`;
    } else {
      return `Mod de lucru ${
        fields.remote.length >= 1 ? `(${fields.remote.length})` : ""
      }`;
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (
        dropDown &&
        refDropdown.current &&
        !refDropdown.current.contains(e.target as Node)
      ) {
        setDropDown([false, false, false]);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [dropDown]);

  // Rendering the component
  return (
    <div className="drop-down-parent" ref={refDropdown}>
      {/* Mapping through each dropdown */}
      {dropDown.map((isOpen, index) => (
        <div key={index}>
          {/* Button for toggling the dropdown */}
          <button
            className="drop-down"
            onClick={() => handleDropDown(index)}
            style={getButtonStyle(index)}
          >
            {/* Dynamically set button label based on index */}
            {getButtonLabel(index)}
            {/* Arrow icon for indicating dropdown state */}
            <img
              src={sageata}
              className={`arrow-bottom ${isOpen ? "up" : ""}`}
              alt="drop-down"
            />
          </button>
          {/* Dropdown container */}
          <div className={`drop-down-container ${isOpen ? "open" : ""}`}>
            {/* Dynamically rendering checkbox based on index */}

            {/* Cities Drop-down */}
            {index === 0 && (
              <React.Fragment>
                <CheckboxFilter
                  items={orase}
                  filterKey="orase"
                  searchFor="oras"
                  dropDown={dropDown}
                />
              </React.Fragment>
            )}

            {/* Companies Drop-down */}
            {index === 1 && (
              <React.Fragment>
                <CheckboxFilter
                  items={data}
                  filterKey="company"
                  searchFor="companie"
                  dropDown={dropDown}
                />
              </React.Fragment>
            )}

            {index === 2 && (
              <React.Fragment>
                <div className="checkbox-remote">
                  <div>
                    <input
                      type="checkbox"
                      id="on-site"
                      name="on-site"
                      value="on-site"
                      className="mdl"
                      checked={fields.remote.includes("on-site")}
                      onChange={(e) => handleCheckBoxChange(e, "remote")}
                    />
                    <label htmlFor="on-site">La fata locului</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="hibrid"
                      name="hibrid"
                      value="hibrid"
                      className="mdl"
                      checked={fields.remote.includes("hibrid")}
                      onChange={(e) => handleCheckBoxChange(e, "remote")}
                    />
                    <label htmlFor="hibrid">Hibrid</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="Remote"
                      name="remote"
                      value="Remote"
                      className="mdl"
                      checked={fields.remote.includes("Remote")}
                      onChange={(e) => handleCheckBoxChange(e, "remote")}
                    />
                    <label htmlFor="Remote">La distanță</label>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FiltreGrup;
