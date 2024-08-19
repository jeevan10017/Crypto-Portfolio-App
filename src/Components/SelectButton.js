import React from 'react';
import { Button } from '@mui/material';

const SelectButton = ({ children, selected, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      style={{
        backgroundColor: selected ? '#EEBC1D' : 'transparent',
        color: selected ? 'black' : '#EEBC1D',
        border: '1px solid #EEBC1D',
        fontWeight: selected ? 600 : 500,
        width: '22%',
        margin: 5,
      }}
    >
      {children}
    </Button>
  );
};

export default SelectButton;
