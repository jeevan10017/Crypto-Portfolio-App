import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CoinsList } from './config/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';


const Crypto = createContext();

const CryptoContext = ({ children }) => {
    const [currency, setCurrency] = useState('INR');
    const [symbol, setSymbol] = useState('₹');
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        if (user) {
            const coinRef = doc(db, 'watchlist', user.uid);
            var unsubscribe = onSnapshot(coinRef, coin => {
                if (coin.exists()) {
                    setWatchlist(coin.data().coins);
                }
                else {
                    console.log('No Items in Watchlist');
                }
            })
            return () => unsubscribe();
        }

    }, [user]);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
            }
            else {
                setUser(null);
            }
        }
        );
    })

    const fetchCoins = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(CoinsList(currency));
            setCoins(data);
        } catch (error) {
            console.error("Error fetching coins:", error);
        }
        setLoading(false);
    };


    useEffect(() => {
        if (currency === 'USD') setSymbol('$');
        else if (currency === 'EUR') setSymbol('€');
        else if (currency === 'JPY') setSymbol('¥');
        else if (currency === 'GBP') setSymbol('£');
        else if (currency === 'AUD') setSymbol('A$');
        else if (currency === 'INR') setSymbol('₹');
    }, [currency]);

    return (
        <Crypto.Provider value={{ currency, symbol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user, watchlist }}>
            {children}
        </Crypto.Provider>
    );
};

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto);
};
