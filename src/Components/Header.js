import React from 'react';
import { AppBar, Container, Toolbar, Typography, Select, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles'; 
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './Authentication/UserSidebar';
import logo from '../assets/logo.jpg';
import { AiOutlineFontSize } from 'react-icons/ai';
import "../App.css";

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: 'gold',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    cursor: 'pointer',
    position: 'sticky',
    '@media (max-width: 468px)': {
     
      fontSize: '1.5rem',
    },
    
  },
  select: {
    '& .MuiSelect-select': {
      color: 'gold', 
      '&:hover': {  
        '& .MuiSelect-select': 'gold',
      }
    },
    // '& .MuiOutlinedInput-notchedOutline': {
    //   borderColor: 'gold',
    //   '&:hover': {  
    //     borderColor: 'gold',
    //   } 
    // },
    // '&:hover .MuiOutlinedInput-notchedOutline': {
    //   borderColor: 'gold', 
      
    // },
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

  const { currency, setCurrency,user } = CryptoState();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar  color='transparent' position="sticky" >
        <Container className="HeaderCnt"style={{zIndex:100  ,width:"100%" }}>
          <Toolbar >
            <img
              src={logo}
              alt="logo"
              style={{ width: 45, cursor: 'pointer', padding: 5 }}
              onClick={() => navigate('/')}
            />
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
                width: 75,
                height: 35,
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
             {user ? <UserSidebar/> : <AuthModal/>}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
