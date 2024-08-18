import React, { useState} from 'react';
import { ethers } from 'ethers';
import { Button, TextField, Typography, Container ,Box } from '@mui/material';
import { CryptoState } from '../CryptoContext';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const TokenPage = () => {
    const { user, addToTransferHistory } = CryptoState();
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [tokenBalance, setTokenBalance] = useState('');
    const [allowance, setAllowance] = useState('');
    const [spenderAddress, setSpenderAddress] = useState('');
    const navigate = useNavigate();

    // Connect to wallet
    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const web3Provider = new ethers.BrowserProvider(window.ethereum);
                // const web3Provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/be44629b811844cb91607381af01e377');
                await web3Provider.send("eth_requestAccounts", []);
                const signer = await web3Provider.getSigner();
                setProvider(web3Provider);
                setSigner(signer);

                const address = await signer.getAddress();
                setWalletAddress(address);
            } else {
                alert('Please install MetaMask!');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet. Please try again.');
        }
    };

    const getTokenBalance = async () => {
        try {
            if (!signer || !tokenAddress) return;
            const tokenContract = new ethers.Contract(
                tokenAddress,
                ['function balanceOf(address owner) view returns (uint256)'],
                signer
            );
            const balance = await tokenContract.balanceOf(walletAddress);
            setTokenBalance(ethers.formatEther(balance));
        } catch (error) {
            console.error('Error getting token balance:', error.message || error);
            alert(`An error occurred while fetching the token balance: ${error.message || error}`);
        }
    };
    
    

    // Check allowance
    const checkAllowance = async () => {
        if (!signer || !tokenAddress || !spenderAddress) return;
        try {
            const tokenContract = new ethers.Contract(
                tokenAddress,
                ['function allowance(address owner, address spender) view returns (uint256)'],
                signer
            );
            const currentAllowance = await tokenContract.allowance(walletAddress, spenderAddress);
            setAllowance(ethers.formatEther(currentAllowance));
        } catch (error) {
            console.error('Error checking allowance:', error);
            alert('Failed to check allowance. Please try again.');
        }
    };

    // Transfer tokens with history logging
    const transferTokens = async () => {
        if (!signer || !tokenAddress || !recipientAddress || !transferAmount) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const tokenContract = new ethers.Contract(
                tokenAddress,
                ['function transfer(address to, uint256 amount) returns (bool)'],
                signer
            );

            const amountInWei = ethers.parseEther(transferAmount);
            const tx = await tokenContract.transfer(recipientAddress, amountInWei);
            await tx.wait();

            alert('Transfer Successful!');

            user &&
            await addToTransferHistory({
                tokenAddress,
                recipientAddress,
                amount: transferAmount,
                date: new Date().toISOString(),
                transactionHash: tx.hash,
            });
        } catch (error) {
            console.error('Error during token transfer:', error);
            alert('An error occurred. Check the console for details.');
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop:"50px",marginBottom:"50px", border:"1px solid #FFD700" ,borderRadius:"30px" , boxShadow: "0px 1px 10px #FFD700"}}>
            <FaArrowLeft 
          onClick={() => navigate('/')}
          style={{
            position: 'relative',
            top: 20,
            left: -0,
            fontSize: '24px',
            color: 'gold',
            cursor: 'pointer',
          }}
        /> 
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} style={{fontFamily :"Montserrat",paddingBottom:"20px" }} >
           
                <Typography variant="h4"  gutterBottom>Token Management</Typography>

                <Button variant="contained" color="primary" onClick={connectWallet}>
                    Connect Wallet
                </Button>
                {walletAddress && (
                    <Typography variant="body1" gutterBottom>
                        Connected Address: {walletAddress}
                    </Typography>
                )}

                <TextField
                    label="Token Contract Address"
                    variant="outlined"
                    fullWidth
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                />

                <Button variant="contained" color="secondary" onClick={getTokenBalance}>
                    Get Token Balance
                </Button>
                {tokenBalance && (
                    <Typography variant="body1">
                        Token Balance: {tokenBalance}
                    </Typography>
                )}

                <TextField
                    label="Spender Address for Allowance"
                    variant="outlined"
                    fullWidth
                    value={spenderAddress}
                    onChange={(e) => setSpenderAddress(e.target.value)}
                />

                <Button variant="contained" color="secondary" onClick={checkAllowance}>
                    Check Allowance
                </Button>
                {allowance && (
                    <Typography variant="body1">
                        Allowance: {allowance}
                    </Typography>
                )}

                <TextField
                    label="Recipient Address"
                    variant="outlined"
                    fullWidth
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                />

                <TextField
                    label="Amount to Transfer"
                    variant="outlined"
                    fullWidth
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                />

                <Button variant="contained" color="secondary" onClick={transferTokens}>
                    Transfer Tokens
                </Button>

            </Box>
        </Container>
    );
};

export default TokenPage;
