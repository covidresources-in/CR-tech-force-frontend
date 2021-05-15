import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { requirements } from '../../constants';
import ROUTES from '../../constants/routes';
import { logEvent } from '../../utils/gtag';
import JumboButton from './../../components/JumboButton';
import Logo from './../../components/Logo';
import PopularCities from './../../components/PopularCities';
import SearchBar from './../../components/SearchBar';
import { Context as SearchContext } from './../../context/SearchContext';
import bedImg from './../../global/assets/icons/bed.svg';
import hospitalImg from './../../global/assets/icons/hospital.svg';
import medicineImg from './../../global/assets/icons/medicine.svg';
import oxygenImg from './../../global/assets/icons/oxygen.svg';
import tiffinImg from './../../global/assets/icons/tiffin.svg';
import home_care from './../../global/assets/icons/home-care.svg';
import testing from './../../global/assets/icons/testing.svg';
import blood from './../../global/assets/icons/blood.svg';
import './Dashboard.scss';




const categoryData = [
  {
    id: 'hospital',
    imgSrc: hospitalImg,
    primaryText: 'ICU Beds',
    value: requirements[1],
    secondaryText: 'Click here to find beds in your location',
  },
  {
    id: 'bed',
    imgSrc: bedImg,
    primaryText: 'Oxygen Beds',
    value: requirements[1],
    secondaryText: 'Click here to find beds in your location',
  },
  {
    id: 'oxygen',
    imgSrc: oxygenImg,
    primaryText: 'Oxygen Supplies',
    value: requirements[0],
    secondaryText: 'Find cylinders, refillers in your locality',
  },
  {
    id: 'medicine',
    imgSrc: medicineImg,
    primaryText: 'Medicines / Remdesivir',
    value: requirements[2],
    secondaryText: 'Find medicines in your area',
  },
  {
    id: 'tiffin',
    imgSrc: tiffinImg,
    primaryText: 'Tiffin Services',
    value: requirements[6],
    secondaryText: 'Get food delivered at your doorsteps',
  },
  {
    id: 'covid_testing',
    imgSrc: testing,
    primaryText: 'Covid Testing',
    value: requirements[5],
    secondaryText: 'Find RT-PCR tests in your locality',
  },
  {
    id: 'blood',
    imgSrc: blood,
    primaryText: 'Blood',
    value: requirements[3],
    secondaryText: 'Find donors for blood therapy',
  },
  {
    id: 'home_care',
    imgSrc: home_care,
    primaryText: 'Home Care',
    value: requirements[4],
    secondaryText: 'Home ICU Setup, Nursing Staff',
  },
];

const Dashboard = () => {
  const { searchInputs, state } = useContext(SearchContext);
  const history = useHistory();

  const handleOnClick = (requirement) => {
    const searchQuery = {
      ...state?.searchInputs,
      requirement
    }
    searchInputs(searchQuery);
    history.push(`${ROUTES.SEARCH}?executeSearch=true`)
  }

  const categories = categoryData.map(
    ({ id, imgSrc, primaryText, secondaryText, value }) => (
      <JumboButton
        key={id}
        altText={id}
        iconSrc={imgSrc}
        primaryText={primaryText}
        secondaryText={secondaryText}
        onClick={() => {
          logEvent({
            action: 'submit_search',
            name: 'Search Looking for?',
            value,
            page_location: window.location.pathname
          })
          handleOnClick(value)
        }}
      />
    )
  );

  const handleFollowTwitterOnClick = () => {
    logEvent({
      action: 'click',
      name: 'Follow Twitter',
    })
  };

  return (
    <div className="Dashboard d-flex flex-direction-col align-items-center">
      <section className="Dashboard-top d-flex flex-direction-col align-items-center">
        <Logo isInline={false} />
        <div className="Dashboard-top__teamLabel">
          Powered by an army of selfless volunteers, working 24x7 to help you find verified resources related to all COVID needs. Follow us on Twitter for live updates
        </div>
        <div className="mb-3">
          <a onClick={handleFollowTwitterOnClick} href="https://twitter.com/COVResourcesIn?ref_src=twsrc%5Etfw" className="twitter-follow-button" data-size="large" data-show-count="false">Follow @COVResourcesIn</a>
        </div>
        <SearchBar />
        <PopularCities />
      </section>
      <section className="Dashboard-bottom">
        <div className="Dashboard-bottom__categoryHeading text-align-center">
          What are you looking for
        </div>
        <div className="Dashboard-bottom__categories d-flex flex-wrap-wrap justify-content-center">
          {categories}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
