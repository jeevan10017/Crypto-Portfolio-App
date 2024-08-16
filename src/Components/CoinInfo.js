import React, { useEffect, useState } from 'react';
import { CircularProgress, createTheme, ThemeProvider, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { HistoricalChart } from '../config/api';
import { chartDays } from '../config/constants';
import SelectButton from './SelectButton';
import { CryptoState } from '../CryptoContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const useStyles = makeStyles((theme) => ({
  container: {
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
}));

const CoinInfo = ({ coin }) => {
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);
  const [flag, setFlag] = useState(false);
  const [percentageChange, setPercentageChange] = useState(0);
  const [color, setColor] = useState('#EEBC1D');

  const { currency } = CryptoState();
  const classes = useStyles();

  const fetchHistoricalData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setFlag(true);
    setHistoricalData(data.prices);

    // Calculate percentage change
    const startPrice = data.prices[0][1];
    const endPrice = data.prices[data.prices.length - 1][1];
    const change = ((endPrice - startPrice) / startPrice) * 100;

    setPercentageChange(change.toFixed(2));

    if (change > 0) {
      setColor('green');
    } else {
      setColor('red');
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [days, currency]);

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
      <div className={classes.container}>
        {!historicalData || flag === false ? (
          <CircularProgress style={{ color: 'gold' }} size={250} thickness={1} />
        ) : (
          <>
            <Typography variant="h5" style={{ color, marginBottom: 20 }}>
              {`Change: ${percentageChange}%`}
            </Typography>
            <Line
              data={{
                labels: historicalData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: color,
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                justifyContent: 'space-around',
                width: '100%',
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setFlag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
