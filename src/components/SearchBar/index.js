/* eslint-disable/ */
import React, { useState, useContext, useEffect } from "react";
import { withRouter } from "react-router";
import SearchIcon from "@material-ui/icons/Search";

import statesCitiesData from "./../../utils/state-city-map";
import { requirements } from "./../../constants";
import { resourcesMap } from "../../containers/add-edit-resource/resources-data";
import ROUTES from "./../../constants/routes";

import { Context as SearchContext } from "./../../context/SearchContext";

import Button from "./../Button";
import SelectInput from "./../SelectInput";

import "./SearchBar.scss";
import { logEvent } from "../../utils/gtag";

const SearchBar = (props) => {
  const { history } = props;
  const { searchInputs, state } = useContext(SearchContext);
  const [selectedState, setSelectedState] = useState(
    state.searchInputs ? state.searchInputs.state : ""
  );
  const [selectedCity, setSelectedCity] = useState(
    state.searchInputs ? state.searchInputs.city : ""
  );
  const [selectedRequirement, setSelectedRequirement] = useState(
    state.searchInputs ? state.searchInputs.requirement : ""
  );
  const [cities, setCities] = useState([]);
  const [selectedSubrequirement, setSelectedSubrequirement] = useState(
    state.searchInputs ? state.searchInputs.subrequirement : ""
  );
  const subrequirements = resourcesMap.find((resource) => {
    return resource.type === selectedRequirement;
  })?.subTypes;

  useEffect(() => {
    if (state && state.searchInputs) {
      setSelectedState(selectedState);
      setSelectedCity(selectedCity);
      const selectedStatData = statesCitiesData.find((state) => state.state === selectedState);

      const citiesData =
        !!selectedStatData && !!selectedStatData.cities && selectedStatData.cities.length > 0
          ? selectedStatData.cities
          : [];

      setCities(citiesData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const states = statesCitiesData.map((state) => state.state);

  const handleStateChange = (selectedState) => {
    setSelectedState(selectedState);
    setSelectedCity("");
    const selectedStatData = statesCitiesData.find((state) => state.state === selectedState);

    const citiesData =
      !!selectedStatData && !!selectedStatData.cities && selectedStatData.cities.length > 0
        ? selectedStatData.cities
        : [];

    setCities(citiesData);

    logEvent({
      action: "selection",
      name: "Select State",
      value: selectedState,
      page_location: window.location.pathname,
    });
  };

  const handleCityChange = (selectedCity) => {
    setSelectedCity(selectedCity);
    logEvent({
      action: "selection",
      name: "Select City",
      value: selectedCity,
      page_location: window.location.pathname,
    });
  };

  const handleRequirementChange = (selectedRequirement) => {
    setSelectedRequirement(selectedRequirement);
    logEvent({
      action: "selection",
      name: "Select Requirement",
      value: selectedRequirement,
      page_location: window.location.pathname,
    });
  };

  const handleSubrequirementChange = (selectedSubrequirement) => {
    setSelectedSubrequirement(selectedSubrequirement);
    logEvent({
      action: "selection",
      name: "Select Subrequirement",
      value: selectedSubrequirement,
      page_location: window.location.pathname,
    });
  };

  const handleSubmit = () => {
    const {
      location: { pathname },
    } = history;
    const searchQuery = {
      state: selectedState,
      city: selectedCity,
      requirement: selectedRequirement,
      subrequirement: selectedSubrequirement,
    };
    searchInputs(searchQuery);

    if (props.onSubmit) {
      props.onSubmit();
    }

    pathname === "/" && history.push(`${ROUTES.SEARCH}?executeSearch=true`);
  };

  return (
    <div className="SearchBar d-flex w-100">
      <SelectInput
        label="Select State"
        placeholder="Enter your state"
        value={selectedState || ""}
        options={states}
        onChange={handleStateChange}
      />
      <SelectInput
        label="Select City / Region"
        placeholder="Enter your city"
        value={selectedCity || ""}
        options={cities}
        onChange={handleCityChange}
      />
      <SelectInput
        label="What are you looking for?"
        placeholder="eg. ICU Beds, Oxygen"
        value={selectedRequirement || ""}
        options={requirements}
        onChange={handleRequirementChange}
      />
      {selectedRequirement && (
        <SelectInput
          label="Tell us more"
          placeholder="Select a requirement"
          value={selectedSubrequirement || ""}
          options={subrequirements}
          onChange={handleSubrequirementChange}
        />
      )}
      <Button
        label="Find Leads"
        icon={<SearchIcon />}
        name="Search leads"
        onClick={() => handleSubmit()}
        disabled={!(selectedRequirement || selectedCity || selectedState)}
      />
    </div>
  );
};

export default withRouter(SearchBar);
