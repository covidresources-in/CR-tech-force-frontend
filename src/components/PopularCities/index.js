import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import { logEvent } from '../../utils/gtag';
import Button from '../Button';
import ROUTES from './../../constants/routes';
import { Context as SearchContext } from './../../context/SearchContext';
import './PopularCities.scss';

const popularStateCity = [
  {
    state: 'Delhi',
    city: 'Delhi'
  },
  {
    state: 'Uttar Pradesh',
    city: 'Kanpur'
  },
  {
    state: 'Gujarat',
    city: 'Ahmadabad'
  },
  {
    state: 'Maharashtra',
    city: 'Mumbai'
  },
  {
    state: 'Maharashtra',
    city: 'Pune'
  },
  {
    state: 'Madhya Pradesh',
    city: 'Indore'
  },
  {
    state: 'Rajasthan',
    city: 'Jaipur'
  },
  {
    state: 'Karnataka',
    city: 'Bangalore'
  },
  {
    state: 'West Bengal',
    city: 'Kolkata'
  },
]

const PopularCities = (props) => {
  const { searchInputs } = useContext(SearchContext);
  const { history } = props;

  const cityButtons = popularStateCity.map(({ state, city }) => (
    <Button
      underlined={true}
      variant="text"
      name="Popular cities"
      style={{ marginRight: '8px', marginBottom: '8px' }}
      key={city}
      text={city}
      onClick={() => {
        logEvent({
          action: 'submit_search',
          page_location: window.location.pathname,
          name: 'Search Popular Cities',
          value: `State - ${state}, City - ${city}`
        })
        handleSubmit(city, state)
      }}
    />
  ));

  const handleSubmit = (city, state) => {
    const searchQuery = {
      state,
      city,
    };
    searchInputs(searchQuery);
    history.push(`${ROUTES.SEARCH}?executeSearch=true`);
  };

  return (
    <div className="PopularCities">
      <div className="PopularCities-title text-align-center">
        POPULAR CITIES
      </div>
      <div className="d-flex PopularCities-cities">{cityButtons}</div>
    </div>
  );
};

export default withRouter(PopularCities);
