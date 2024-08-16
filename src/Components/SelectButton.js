import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  selectButton: {
    border: '1px solid gold',
    borderRadius: 5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: 'Montserrat',
    cursor: 'pointer',
    backgroundColor: (props) => (props.active ? 'gold' : 'transparent'),
    color: (props) => (props.active ? 'black' : 'inherit'),
    fontWeight: (props) => (props.active ? 700 : 500),
    '&:hover': {
      backgroundColor: 'gold',
      color: 'black',
    },
    width: '22%',
  },
});

const SelectButton = ({ children, id, active, onClick }) => {
  const classes = useStyles({ active });

  return (
    <span id={id} onClick={onClick} className={classes.selectButton}>
      {children}
    </span>
  );
};

export default SelectButton;
