import React, { useState } from 'react';
import { AppBar, Container, Toolbar, Typography, Select, MenuItem, Button } from '@mui/material';
import { makeStyles } from '@mui/styles'; 
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './Authentication/UserSidebar';
import logo from '../assets/logo.jpg';
import "../App.css";

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: '#CFB53B',
    fontFamily: 'Montserrat',
    fontWeight: 'extraBold',
    cursor: 'pointer',
     fontSize: '1.4rem'
,    position: 'sticky',
    '@media (max-width: 468px)': {
      fontSize: '1.1rem',
    },
    '@media (max-width: 478px)': {
      // display: "none",
      opacity: 0,
      fontSize: '3px',
    },
  },
  select: {
    '& .MuiSelect-select': {
      color: '#CFB53B',
      '&:hover': {
        '& .MuiSelect-select': '#CFB53B',
      }
    },
    '& .MuiSvgIcon-root': {
      color: '#CFB53B',
    },
  },
  menuItem: {
    color: '#CFB53B',
    // marginLeft: "20px",
    '&:hover': {
      backgroundColor: '#CFB53B',
      color: '#CFB53B',
    },
    '&:focus': {
      color: '#CFB53B',
    },
  },
  bar: {
    zIndex: 100,
    backgroundColor: 'black',
    width: '100%',
  },
  btn:{
    color: '#CFB53B',
    borderColor: '#CFB53B',
  }
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { currency, setCurrency, user } = CryptoState();

  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar className={classes.bar} position="sticky" style={{ backgroundColor: 'black', width: "100%", zIndex: "100" }}>
        <Container className="HeaderCnt" style={{ maxwidth: "100%" }}>
          <Toolbar>
            <img
              src={logo}
              alt="logo"
              style={{ width: 50, cursor: 'pointer', padding: 5 }}
              onClick={() => navigate('/')}
            />
            <Typography
              onClick={() => navigate("/")}
              className={classes.title}
              style={{ marginLeft: 10,fontFamily: 'Montserrat', fontWeight: 'extraBold' }}
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
                // marginLeft: 145,
                
              }}
            >
              <MenuItem value={"USD"} className={classes.menuItem}>USD</MenuItem>
              <MenuItem value={"EUR"} className={classes.menuItem}>EUR</MenuItem>
              <MenuItem value={"JPY"} className={classes.menuItem}>JPY</MenuItem>
              <MenuItem value={"GBP"} className={classes.menuItem}>GBP</MenuItem>
              <MenuItem value={"AUD"} className={classes.menuItem}>AUD</MenuItem>
              <MenuItem value={"INR"} className={classes.menuItem}>INR</MenuItem>
            </Select>
            {user ? (
              <UserSidebar />
            ) : (
              <Button 
                variant="outlined" 
                className={classes.btn}
                style={{ color: '#CFB53B', borderColor: '#CFB53B',marginLeft: 20 }} 
                onClick={handleOpen}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <AuthModal triggerOpen={openModal} handleClose={handleClose} />
    </ThemeProvider>
  );
};

export default Header;
