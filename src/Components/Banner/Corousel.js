import { makeStyles } from '@mui/styles';
import React, { useEffect } from 'react'
import { TrendingCoins } from '../../config/api';
import axios from 'axios';
import { CryptoState } from '../../CryptoContext';

const useStyles = makeStyles((theme) => ({
  Corousel: {
    height: '50%',
    display: 'flex',
    alignItems: 'center',
  },
}));


const Corousel = () => {
    const Classes = useStyles();
    const [trending, setTrending] = React.useState([]);

    const {currency} = CryptoState();

    const fetchTrendingCoins = async() => {
        const {data} = await axios.get(TrendingCoins(currency));
        setTrending(data);
    };
console.log(trending)
    useEffect(() => {
        fetchTrendingCoins();
    }, [currency]);

  return (
    <div className={Classes.Corousel}>Corousel</div>
  )
}

export default Corousel