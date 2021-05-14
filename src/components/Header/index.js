import { ButtonProps } from '@material-ui/core';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useHistory, withRouter } from 'react-router';
import superheroImg from './../../global/assets/icons/superhero.svg';
import JumboButton from './../JumboButton';
import Logo from './../Logo';
import './Header.scss';
import IndiaFlag from './india-flag.svg';

const Header = () => {
  const history = useHistory();
  const showLogo = history.location.pathname !== '/';
  const showSuperheroButton = history.location.pathname !== '/submit-a-lead';
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  return (<>
    {showLogo && <div className={`d-flex justify-content-end ${!isMobile ? 'my-2 mr-2' : ''}`}>
      <DonateButton fullWidth={isMobile} />
    </div>}
    <header
      className={`Header d-flex justify-content-between ${!!showLogo ? '' : 'justify-content-end'
        } ${!!showLogo ? '' : 'isHeader'}`}
    >
      {!!showLogo && <Logo onClick={() => history.push('/')} />}
      {showSuperheroButton && <JumboButton
        altText="superhero"
        className="superhero-button"
        iconSrc={superheroImg}
        primaryText="Be a Superhero!"
        secondaryText="Click here to submit info"
        onClick={() => history.push('/submit-a-lead')}
      />}
      {!showLogo && <DonateButton fullWidth={isMobile} />}
    </header></>
  );
};

const DonateButton = (props: ButtonProps) => {
  return <JumboButton
    fullWidth={props.fullWidth}
    color="primary"
    variant="contained"
    size="large"
    primaryText="Donate for Indian Army Covid Facility"
    onClick={() => window.open("https://milaap.org/fundraisers/support-army-hospital?utm_source=whatsapp&utm_medium=fundraisers-title&mlp_referrer_id=556901")}
    iconSrc={IndiaFlag}
  >
  </JumboButton>
}

export default withRouter(Header);
