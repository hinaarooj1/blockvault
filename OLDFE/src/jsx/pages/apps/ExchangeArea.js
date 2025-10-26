import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import MoonPay from '../../../assets/images/logos/3.png'
import CoinBase from '../../../assets/images/logos/coinbase.svg'
import Bitpanda from '../../../assets/images/logos/bitpanda-fcb-acm-nfl-logos.gif'
import Binance from '../../../assets/images/logos/binance.png'
import Crypto from '../../../assets/images/logos/crypto-com-vector-logo.png'
import Kraken from '../../../assets/images/logos/kraken-logo@logotyp.us.svg'
import './ExchangeArea.css'
import Kucoin from '../../../assets/images/logos/kucoin.svg'
import Paybis from '../../../assets/images/logos/5.png'
import coinspot from '../../../assets/images/logos/6.png'
import bybit from '../../../assets/images/logos/8.png'
import gateio from '../../../assets/images/logos/gateio.png'
import bitgest from '../../../assets/images/bitget.svg'
import Mercury from '../../../assets/images/logos/mercuryo.png'
import bitvao from '../../../assets/images/logos/4.png'
import Ramp from '../../../assets/images/logos/7.png'
import safello from '../../../assets/images/logos/9.png'
import bitpay from '../../../assets/logo/bitpay.svg'
import transak from '../../../assets/logo/transak-logo.svg'
import bit2me from '../../../assets/logo/bit2me-logo-light.svg'
import bitget from '../../../assets/images/logos/10.png'
import bingx from '../../../assets/logo/bingx-logo-0C09A379A0-seeklogo.com.png'
import gemini from '../../../assets/images/logos/11.png'
import valr from '../../../assets/logo/valr.jpg'
import Upbit from '../../../assets/logo/upbit_logo.35a5b2a.svg'
import { getLinksApi } from "../../../Api/Service";
const exchanges = [
    { name: "Moonpay", logo: MoonPay, link: "https://www.moonpay.com" },
    { name: "Coinbase", logo: CoinBase, link: "https://www.coinbase.com" },
    { name: "Bitpanda", logo: Bitpanda, link: "https://www.bitpanda.com" },
    { name: "Binance", logo: Binance, link: "https://www.binance.com" },
    { name: "Mercuryo", logo: Mercury, link: "https://www.mercuryo.io" },
    { name: "Crypto.com", logo: Crypto, link: "https://crypto.com" },
    { name: "Kraken", logo: Kraken, link: "https://www.kraken.com" },
    { name: "Bitvavo", logo: bitvao, link: "https://bitvavo.com" },
    { name: "Kucoin", logo: Kucoin, link: "https://www.kucoin.com" },
    { name: "Paypis", logo: Paybis, link: "https://paybis.com" },
    { name: "Coinspot", logo: coinspot, link: "https://www.coinspot.com.au" },
    { name: "Bybit", logo: bybit, link: "https://www.bybit.com" },
    { name: "Gate.io", logo: gateio, link: "https://www.gate.io" },
    { name: "Bitget", logo: bitget, link: "https://www.bitget.com" },
    // 
    { name: "Ramp", logo: Ramp, link: "https://ramp.network/" },
    { name: "Safello", logo: safello, link: "https://safello.com/" },
    { name: "Bitpay", logo: bitpay, link: "https://bitpay.com/" },
    { name: "Transak", logo: transak, link: "https://transak.com/" },
    { name: "Bit2me", logo: bit2me, link: "https://bit2me.com/" },
    { name: "Bingx", logo: bingx, link: "https://bingx.com/en/" },
    { name: "Gemini", logo: gemini, link: "https://www.gemini.com/" },
    { name: "Valr", logo: valr, link: "https://www.valr.com/" },
    { name: "Upbit", logo: Upbit, link: "https://upbit.com" },
];

const ExchangeAreaa = () => {
    const [secLoading, setsecLoading] = useState(true);

    let Navigate = useNavigate();
    const fetchLinks = async () => {
        try {
            const data = await getLinksApi();
            console.log('data: ', data);

            if (data?.links[4]?.enabled) {

                setsecLoading(false)
            } else {
                Navigate(-1);
            }
        } catch (error) {
            console.error("Error fetching links:", error);
        }
    };
    useEffect(() => {
        fetchLinks()
    }, []);
    return (
        <div className="container mt-5">
            {secLoading ? "" :
                <div className="row">
                    {exchanges.map((exchange, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-4">
                            <Link to={exchange.link} target="_blank" className="nasaaa" rel="noopener noreferrer">
                                <div className="card new-bg-dark  shadow-sm text-center p-4">
                                    <img src={exchange.logo} alt={exchange.name} className="img-fluid" style={{ maxWidth: "200px", textAlign: 'center', margin: "auto" }} />
                                    <h5 className="mt-3 hasa text-white" >{exchange.name}</h5>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default ExchangeAreaa;
