import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Button, Container, Typography } from '@mui/material';
import backgroundImg from '../../assets/newbg.jpg';
import Carousel from './Carousel';
import { useNavigate } from 'react-router-dom';
import { CryptoState } from '../../CryptoContext';
import AuthModal from '../Authentication/AuthModal';

const useStyles = makeStyles(() => ({
  banner: {
    backgroundImage: `url(${backgroundImg})`, 
    zIndex: -1,
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    height: 450, 
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 25,
    justifyContent: 'space-around',
    '@media (max-width: 768px)': {
      height: '75%', 
    },
    '@media (max-width: 440px)': {
      height: '85%', 
    },
  },
  bannerContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 25,
    justifyContent: 'space-around',
    zIndex: 1,
  },
  tagline: {
    display: 'flex',
    height: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: "5%",
    left: 0,
    width: '100%',
    height: "70%", 
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 0,
    borderRadius: '10px',
    '@media (max-width: 868px)': {
      height: '80%', 
    },
    '@media (max-width: 470px)': {
      height: '94%', 
    },
  },
  new: {
    zIndex: 100,
  },
}));

const Banner = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = CryptoState(); 

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className={classes.banner}>
      <div className={classes.overlay} />
      <Container className={classes.bannerContent}>
        <div className={classes.tagline}>
          <Typography variant='h3' style={{ color: 'white', fontWeight: 'bold', marginBottom: 15, fontFamily: "Montserrat" }}>
            Welcome to Crypto Portfolio
          </Typography>
          <Typography className={classes.new} variant='h6' style={{ color: 'white', fontFamily: "Montserrat" }}>
            Keep track of your favorite cryptocurrencies
          </Typography>
          {!user && (
            <Button
              variant='outlined'
              style={{ backgroundColor:"rgba(0,0,0,0.3)",color: '#CFB53B', marginTop: 25, marginBottom: 8 }}
              onClick={() => setOpenModal(true)}
            >
              Signup Now for Token Management
            </Button>
          )}

          {user && (
            <Button
              variant='contained'
              onClick={() => navigate("/tokens")}
              style={{ backgroundColor: '#CFB53B', color: 'black', marginTop: 25, marginBottom: 8 }}
            >
              Manage Tokens
            </Button>
          )}
        </div>
        <Carousel />
      </Container>
      <AuthModal triggerOpen={openModal} handleClose={() => setOpenModal(false)} /> {/* No extra button generated */}
    </div>
  );
};

export default Banner;
