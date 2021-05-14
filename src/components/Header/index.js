import { Button, ButtonProps, SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useHistory, withRouter } from 'react-router';
import superheroImg from './../../global/assets/icons/superhero.svg';
import JumboButton from './../JumboButton';
import Logo from './../Logo';
import './Header.scss';

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
  return <Button
    fullWidth={props.fullWidth}
    color="primary"
    variant="contained"
    size="large"
    onClick={() => window.open("https://milaap.org/fundraisers/support-army-hospital?utm_source=whatsapp&utm_medium=fundraisers-title&mlp_referrer_id=556901")}
    startIcon={<DonateIcon fontSize="large" />}
  >
    Donate for Indian Army Covid center
      </Button>
}

const DonateIcon = (props: SvgIconProps) => {
  return <SvgIcon {...props}>
    <path fill="#8bb7f0" d="M16,51.5C8.556,51.5,2.5,45.444,2.5,38S8.556,24.5,16,24.5S29.5,30.556,29.5,38S23.444,51.5,16,51.5 z" /><path fill="#4e7ab5" d="M16,25c7.168,0,13,5.832,13,13s-5.832,13-13,13S3,45.168,3,38S8.832,25,16,25 M16,24 C8.268,24,2,30.268,2,38s6.268,14,14,14s14-6.268,14-14S23.732,24,16,24L16,24z" /><path fill="#8bb7f0" d="M64,51.5c-7.444,0-13.5-6.056-13.5-13.5S56.556,24.5,64,24.5S77.5,30.556,77.5,38 S71.444,51.5,64,51.5z" /><path fill="#4e7ab5" d="M64,25c7.168,0,13,5.832,13,13s-5.832,13-13,13s-13-5.832-13-13S56.832,25,64,25 M64,24 c-7.732,0-14,6.268-14,14s6.268,14,14,14s14-6.268,14-14S71.732,24,64,24L64,24z" /><path fill="#c2e8ff" d="M40,47.5c-7.444,0-13.5-6.056-13.5-13.5S32.556,20.5,40,20.5S53.5,26.556,53.5,34 S47.444,47.5,40,47.5z" /><path fill="#7496c4" d="M40,21c7.168,0,13,5.832,13,13s-5.832,13-13,13s-13-5.832-13-13S32.832,21,40,21 M40,20 c-7.732,0-14,6.268-14,14s6.268,14,14,14s14-6.268,14-14S47.732,20,40,20L40,20z" /><path fill="#ffeea3" d="M40 2.5A7.5 7.5 0 1 0 40 17.5A7.5 7.5 0 1 0 40 2.5Z" /><path fill="#ba9b48" d="M40,3c3.86,0,7,3.14,7,7s-3.14,7-7,7s-7-3.14-7-7S36.14,3,40,3 M40,2c-4.418,0-8,3.582-8,8 s3.582,8,8,8s8-3.582,8-8S44.418,2,40,2L40,2z" /><path fill="#ffeea3" d="M16 6.5A7.5 7.5 0 1 0 16 21.5A7.5 7.5 0 1 0 16 6.5Z" /><path fill="#ba9b48" d="M16,7c3.86,0,7,3.14,7,7s-3.14,7-7,7s-7-3.14-7-7S12.14,7,16,7 M16,6c-4.418,0-8,3.582-8,8 s3.582,8,8,8s8-3.582,8-8S20.418,6,16,6L16,6z" /><g><path fill="#ffeea3" d="M64 6.5A7.5 7.5 0 1 0 64 21.5A7.5 7.5 0 1 0 64 6.5Z" /><path fill="#ba9b48" d="M64,7c3.86,0,7,3.14,7,7s-3.14,7-7,7s-7-3.14-7-7S60.14,7,64,7 M64,6c-4.418,0-8,3.582-8,8 s3.582,8,8,8s8-3.582,8-8S68.418,6,64,6L64,6z" /></g><g><path fill="#bae0bd" d="M2.5 34.5H77.5V77.5H2.5z" /><path fill="#5e9c76" d="M77,35v42H3V35H77 M78,34H2v44h76V34L78,34z" /></g><g><path fill="#fff" d="M40,71.5c-8.547,0-15.5-6.953-15.5-15.5S31.453,40.5,40,40.5S55.5,47.453,55.5,56 S48.547,71.5,40,71.5z" /><path fill="#5e9c76" d="M40,41c8.271,0,15,6.729,15,15s-6.729,15-15,15s-15-6.729-15-15S31.729,41,40,41 M40,40 c-8.837,0-16,7.163-16,16s7.163,16,16,16s16-7.163,16-16S48.837,40,40,40L40,40z" /></g><g><path fill="#fff" d="M66 50.5A5.5 5.5 0 1 0 66 61.5A5.5 5.5 0 1 0 66 50.5Z" /><path fill="#5e9c76" d="M66,51c2.757,0,5,2.243,5,5s-2.243,5-5,5s-5-2.243-5-5S63.243,51,66,51 M66,50 c-3.314,0-6,2.686-6,6s2.686,6,6,6c3.314,0,6-2.686,6-6S69.314,50,66,50L66,50z" /></g><g><path fill="#fff" d="M14 50.5A5.5 5.5 0 1 0 14 61.5A5.5 5.5 0 1 0 14 50.5Z" /><path fill="#5e9c76" d="M14,51c2.757,0,5,2.243,5,5s-2.243,5-5,5s-5-2.243-5-5S11.243,51,14,51 M14,50 c-3.314,0-6,2.686-6,6s2.686,6,6,6s6-2.686,6-6S17.314,50,14,50L14,50z" /></g>
  </SvgIcon>
}

export default withRouter(Header);
