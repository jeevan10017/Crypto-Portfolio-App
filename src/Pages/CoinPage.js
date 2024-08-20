import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SingleCoin } from '../config/api';
import axios from 'axios';
import { CryptoState } from '../CryptoContext';
import { makeStyles } from '@mui/styles';
import { LinearProgress, Typography, Box } from '@mui/material';
import parse from 'html-react-parser';
import { numberWithCommas } from '../Components/Banner/Carousel';
import CoinInfo from '../Components/CoinInfo'; 
import Button from '@mui/material/Button';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import AuthModal from '../Components/Authentication/AuthModal';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    padding: '20px',
    gap: '40px', 
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px', 
    },
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#1a1a1d', 
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', 
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: 'none',
    justifyContent: 'center',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Montserrat',
    color: '#f5f5f5', 
  },
  description: {
    width: '100%',
    fontFamily: 'Montserrat',
    padding: 15,
    textAlign: 'justify',
    color: '#b0b0b0', 
  },
  marketData: {
    alignSelf: 'start',
    padding: 15,
    width: '100%',
    borderTop: '1px solid gray',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      justifyContent: 'space-around',
      borderTop: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  marketDataItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
    color: '#f5f5f5', 
  },
  button: {
    '&:hover': {
      backgroundColor: '#CFB53B',
      color: 'black',
    },
  },
  nsymbol: {
    color: '#CFB53B', 
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  [theme.breakpoints.down('xs')]: {
    alignItems: 'start',
  },

}));

const Coinpage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  const { currency, symbol, user, watchlist, setAlert } = CryptoState(); 

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
      setErrorMessage(''); 
    } catch (error) {
      console.error('Error fetching coin:', error);
      let message = 'An unknown error occurred.';
      if (error.response) {
        message = `API Error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        message = "Free API limit is exceeded, come back in 30 seconds or wait for 30 seconds.";
      } else {
        message = `Error: ${error.message}`;
      }
      setErrorMessage(message); 
    }
  };

  useEffect(() => {
    fetchCoin();
  }, [currency]);

  const isWatchlisted = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, 'watchlist', user.uid);

    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin.id] : [coin.id],
      });
      setAlert({
        open: true,
        message: `${coin.name} added to watchlist!`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      setAlert({
        open: true,
        message: 'Error adding to watchlist!',
        severity: 'error',
      });
    }
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, 'watchlist', user.uid);

    try {
      await setDoc(
        coinRef, 
        {
          coins: watchlist.filter((watch) => watch !== coin?.id),
        },
        { merge: true }
      );
      setAlert({
        open: true,
        message: `${coin.name} removed from watchlist!`, 
        severity: 'success',
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      setAlert({
        open: true,
        message: 'Error removing from watchlist!',
        severity: 'error',
      });
    }
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const classes = useStyles();

  if (!coin && !errorMessage) return <LinearProgress style={{ backgroundColor: '#CFB53B' }} />;
  
  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <FaArrowLeft
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: 100,
            left: 30,
            fontSize: '24px',
            color: '#CFB53B',
            cursor: 'pointer',
            zIndex:10,
          }}
        />
        {errorMessage ? (
          <Typography style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
            {errorMessage}
          </Typography>
        ) : (
          <>
            <img
              src={coin?.image.large}
              alt={coin?.name}
              height="200"
              style={{ marginBottom: 20 }}
            />
            <Typography variant="h4" className={classes.heading}>
              <span className={classes.nsymbol}>{coin?.name} </span>
              <span style={{ color: "gray" }}>({coin?.symbol.toUpperCase()})</span>
            </Typography>
            <Typography className={classes.description}>
              {parse(coin?.description.en.split('. ')[0])}.
            </Typography>
            <div className={classes.marketData}>
              <Box className={classes.marketDataItem}>
                <Typography variant="h5" className={classes.heading}>
                  Rank:
                </Typography>
                <Typography variant="h5" className={classes.nsymbol}>
                  {coin?.market_cap_rank}
                </Typography>
              </Box>
              <Box className={classes.marketDataItem}>
                <Typography variant="h5" className={classes.heading}>
                  Current Price:
                </Typography>
                <Typography variant="h5" className={classes.nsymbol}>
                  {symbol}{' '}
                  {numberWithCommas(
                    coin?.market_data.current_price[currency.toLowerCase()]
                  )}
                </Typography>
              </Box>
              <Box className={classes.marketDataItem}>
                <Typography variant="h5" className={classes.heading}>
                  Market Cap:
                </Typography>
                <Typography variant="h5" className={classes.nsymbol}>
                  {symbol}{' '}
                  {numberWithCommas(
                    coin?.market_data.market_cap[currency.toLowerCase()]
                      .toString()
                      .slice(0, -6)
                  )}
                  M
                </Typography>
              </Box>
              <Box className={classes.marketDataItem}>
                <Typography variant="h5" className={classes.heading}>
                  24h Change:
                </Typography>
                <Typography
                  variant="h5"
                  className={classes.nsymbol}
                  style={{
                    color: coin?.market_data.price_change_percentage_24h > 0 ? 'green' : 'red',
                  }}
                >
                  {coin?.market_data.price_change_percentage_24h.toFixed(2)}%
                </Typography>
              </Box>
            </div>
            <div style={{ width: '100%', marginTop: 20 }}>
              <div style={{display:"flex" , alignItems:"center" , justifyContent:"center"}}>
                {!user && (
                    <Button 
                    className={classes.button}
                      variant="outlined" 
                      style={{ color: '#CFB53B', borderColor: '#CFB53B' }} 
                      onClick={handleOpen}
                    >
                      Login / Sign Up for wallet and Token management
                    </Button>
                  )}
              </div>
              {user && (
                <Button
                  variant="outlined"
                  style={{
                    width: '100%',
                    height: 40,
                    marginTop: 20,
                    backgroundColor: isWatchlisted ? "#ed1806" : "#CFB53B",
                    color: isWatchlisted ? "white" : "black",
                  }}
                  onClick={isWatchlisted ? removeFromWatchlist : addToWatchlist}
                >
                  {isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"} 
                </Button>
              )}
              {user && (
                <Button
                variant='contained'
                color='secondary'
                onClick={() => navigate("/tokens")}
                style={{  marginTop: 25, marginBottom: 8, width: '100%',
                    height: 40,
                    marginTop: 20, }}
              >
                Manage Tokens
              </Button>
              )}
            </div>
          </>
        )}
      </div>
      <CoinInfo coin={coin} />
      <AuthModal triggerOpen={openModal} handleClose={handleClose} />
    </div>
  );
};

export default Coinpage;
