import React from 'react';
import { AppBar, Container, Toolbar, Typography, Select, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles'; 
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CryptoState } from '../CryptoContext';

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: 'gold',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  select: {
    '& .MuiSelect-select': {
      color: 'gold', 
      '&:hover': {  
        '& .MuiSelect-select': 'gold',
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'gold',
      '&:hover': {  
        borderColor: 'gold',
      } 
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'gold', 
      
    },
    '& .MuiSvgIcon-root': {
      color: 'gold', 
    },
  },
  menuItem: {
    color: 'gold',
    '&:hover': {
      backgroundColor: 'gold',
      color: 'gold', 
     
    },
    '&:focus': {
      color: 'gold',
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      mode: 'dark',
    },
  });

  const { currency, setCurrency } = CryptoState();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color='transparent' position="static">
        <Container>
          <Toolbar>
            <Typography
              onClick={() => navigate("/")}
              className={classes.title}
              variant="h6"
            >
              CRYPTO PORTFOLIO
            </Typography>
            <Select
              variant='outlined'
              className={classes.select}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                width: 100,
                height: 40,
                marginRight: 15,
              }}
            >
              <MenuItem value={"USD"} className={classes.menuItem}>USD</MenuItem>
              <MenuItem value={"EUR"} className={classes.menuItem}>EUR</MenuItem>
              <MenuItem value={"JPY"} className={classes.menuItem}>JPY</MenuItem>
              <MenuItem value={"GBP"} className={classes.menuItem}>GBP</MenuItem>
              <MenuItem value={"AUD"} className={classes.menuItem}>AUD</MenuItem>
              <MenuItem value={"INR"} className={classes.menuItem}>INR</MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
