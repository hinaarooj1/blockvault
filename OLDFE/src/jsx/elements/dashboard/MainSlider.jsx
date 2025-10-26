import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SolanaImg from '../../../assets/images/solana-sol-vector-logo-seeklogo/solana-sol-seeklogo.svg'
import bNBImg from '../../../assets/images/bnb-bnb-logo.svg'
import axios from 'axios';
import SwiperLineChart from './SwiperLineChart';
import { SVGICON } from '../../constant/theme';
import { useAuthUser } from 'react-auth-kit';
import { getsignUserApi } from '../../../Api/Service';
import { toast } from 'react-toastify';

const MainSlider = () => {
    const [isUser, setIsUser] = useState({});

    let authUser = useAuthUser();
    const [swiperData, setSwiperData] = useState([
        { color: 'card-primary', amount: '0', chartcolor: 'rgba(148, 150, 176, 1)', svgicon: SVGICON.SwiperEthSvg },
        { color: 'card-primary', amount: '0', chartcolor: 'rgba(247, 215, 168, 1)', svgicon: SVGICON.SwiperBitSvg },
        { color: 'card-primary', amount: '0', chartcolor: 'rgba(247, 215, 168, 1)', svgicon: SVGICON.XrpUsdIcon },
    ]);
    const getsignUser = async () => {
        try {
            const formData = new FormData();
            formData.append("id", authUser().user._id);
            const userCoins = await getsignUserApi(formData);

            if (userCoins.success) {
                setIsUser(userCoins.signleUser);

                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
        }
    };
    useEffect(() => {
        getsignUser()
        const fetchCryptoPrices = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                    params: {
                        ids: 'bitcoin,ethereum,tether,solana,binancecoin',
                        vs_currencies: 'usd',
                    },
                });

                const { bitcoin, ethereum, binancecoin, solana } = response.data;

                setSwiperData([
                    { color: 'card-primary', amount: bitcoin.usd, chartcolor: 'rgba(247, 215, 168, 1)', svgicon: SVGICON.SwiperBitSvg },
                    { color: 'card-primary', amount: ethereum.usd, chartcolor: 'rgba(148, 150, 176, 1)', svgicon: SVGICON.SwiperEthSvg },
                    { color: 'card-primary', amount: binancecoin.usd, chartcolor: 'rgba(247, 215, 168, 1)', svgicon: <img style={{ width: "60px" }} src={bNBImg} /> },
                    { color: 'card-primary', amount: solana.usd, chartcolor: 'rgba(247, 215, 168, 1)', svgicon: <img style={{ width: "60px" }} src={SolanaImg} /> },
                ]);
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
            }
        };

        fetchCryptoPrices();

        // Optionally, set an interval to update prices every minute
        const interval = setInterval(fetchCryptoPrices, 60000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);
    const convertCurrency = (amount, isUser, eurConversionRate = 0.92) => {
        if (isUser.currency === "EUR") {
            return {
                symbol: "€",
                value: (parseFloat(amount) * eurConversionRate).toFixed(2),
            };
        }
        return {
            symbol: "$",
            value: parseFloat(amount).toFixed(2),
        };
    };
    return (
        <>
            <Swiper
                className="mySwiper-counter position-relative overflow-hidden"
                slidesPerView={4}
                speed={1500}
                spaceBetween={40}
                parallax={true}
                loop={false}

                autoplay={{
                    delay: 5000,
                }}
                breakpoints={{
                    300: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    991: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                }}
            >
                {swiperData.map((item, i) => {
                    const convertedAmount = convertCurrency(item.amount, isUser);

                    return (
                        <SwiperSlide key={i}>
                            <div className={`card card-box bg- ${item.color}`}>
                                <div className="card-header border-0 pb-0">
                                    <div className="chart-num">
                                        <h2 className="font-w600 mb-0">
                                            {convertedAmount.symbol}{convertedAmount.value}
                                        </h2>
                                    </div>
                                    <div className="dlab-swiper-circle">
                                        {item.svgicon}
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div id="widgetChart1" className="chart-primary">
                                        <SwiperLineChart chartcolor={item.chartcolor} />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}

            </Swiper>
        </>
    );
};

export default MainSlider;
