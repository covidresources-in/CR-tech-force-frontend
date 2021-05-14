import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import './JumboButton.scss';

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: '8px',
    textTransform: 'capitalize',
    padding: '10px 22px 10px 18px',
  },
}));

const JumboButton = (props: any) => {
  const { altText, iconSrc, primaryText, secondaryText } = props;
  const classes = useStyles();
  const btnImg = <img alt={altText} src={iconSrc} />;

  return (
    <Button
      {...props}
      variant="contained"
      color="primary"
      size="large"
      className={clsx(classes.button, 'JumboButton linear-gradient', props.className)}
      startIcon={btnImg}
    >
      <div className="text-align-left">
        <div className="JumboButton-primaryText">{primaryText}</div>
        <div className="JumboButton-secondaryText">{secondaryText}</div>
      </div>
    </Button>
  );
};

export default JumboButton;
