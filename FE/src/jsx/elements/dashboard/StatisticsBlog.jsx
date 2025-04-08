import React, { useRef, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Nav, Tab } from "react-bootstrap";
import axios from "axios";

// Example cryptocurrency tabs
const cryptoTab = [
    { title: 'Bitcoin', type: 'btc' },
    { title: 'Ethereum', type: 'eth' },
];

const StatisticsBlog = () => {
    const earningRef = useRef();
    const [series, setSeries] = useState([
        {
            name: 'BTC/USDT',
            className: 'bg-primary',
            data: []
        },
        {
            name: 'ETH/USDT',
            className: 'bg-secondary',
            data: []
        }
    ]);

    const options = {
        chart: {
            height: 300,
            type: 'line',
            toolbar: {
                show: false
            }
        },
        colors: ["var(--primary)", "var(--secondary)"],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 6
        },
        legend: {
            show: false,
        },
        markers: {
            strokeWidth: 5,
            strokeColors: '#fff',
            hover: {
                size: 10,
            },
        },
        grid: {
            show: true,
            strokeDashArray: 6,
            borderColor: 'var(--border)',
            xaxis: {
                lines: {
                    show: true
                },
            },
            yaxis: {
                lines: {
                    show: false
                },
            },
        },
        yaxis: {
            show: false,
            labels: {
                style: {
                    colors: 'var(--text)',
                    fontSize: '12px',
                    fontFamily: 'Poppins',
                    fontWeight: 400
                },
                formatter: function (value) {
                    return value + " USD";
                }
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"], // Example categories
            labels: {
                style: {
                    colors: '#B5B5C3',
                    fontSize: '12px',
                    fontFamily: 'Poppins',
                    fontWeight: 400
                },
            },
            axisBorder: {
                show: false,
            },
            tooltip: {
                enabled: false,
            }
        },
        tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return `<div className="tooltip_box">
                  <div className="tooltip-data">
                    <span className="data-point ${w.config.series[0].className}">${w.config.series[0].name}</span>
                    <span>${series[0][dataPointIndex]} USD</span>
                  </div>
                  <div className="tooltip-data">
                    <span className="data-point ${w.config.series[1].className}">${w.config.series[1].name}</span>
                    <span>${series[1][dataPointIndex]} USD</span>
                  </div>
                </div>`;
            }
        },
        fill: {
            type: 'solid',
            opacity: 0
        },
    };

    // Fetch live data
    const fetchData = async (seriesType) => {
        try {
            let btcData = [];
            let ethData = [];
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/markets`,
                {
                    params: {
                        vs_currency: 'usd',
                        ids: 'bitcoin,ethereum',
                        order: 'market_cap_desc',
                        per_page: 10,
                        page: 1,
                        sparkline: true,
                    },
                }
            );

            if (response.data) {
                btcData = response.data.find(coin => coin.id === 'bitcoin').sparkline_in_7d.price.slice(-10);
                ethData = response.data.find(coin => coin.id === 'ethereum').sparkline_in_7d.price.slice(-10);

                if (seriesType === "btc") {
                    setSeries([
                        {
                            name: 'BTC/USDT',
                            data: btcData
                        },
                        {
                            name: 'ETH/USDT',
                            data: ethData
                        }
                    ]);
                } else if (seriesType === "eth") {
                    setSeries([
                        {
                            name: 'ETH/USDT',
                            data: ethData
                        },
                        {
                            name: 'BTC/USDT',
                            data: btcData
                        }
                    ]);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        // Initial fetch for BTC
        fetchData("btc");
    }, []);

    return (
        <>
            <div className="card-body pt-2">
                <Tab.Container defaultActiveKey="Bitcoin">
                    <Nav as="ul" className="nav nav-pills">
                        {cryptoTab.map((item, ind) => (
                            <Nav.Item as="li" className="nav-item" key={ind}>
                                <Nav.Link eventKey={item.title} onClick={() => fetchData(item.type)}>
                                    {item.title}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                    <div id="marketChart">
                        <ReactApexChart
                            options={options}
                            series={series}
                            ref={earningRef}
                            type="line"
                            height={300}
                        />
                    </div>
                </Tab.Container>
            </div>
        </>
    );
}

export default StatisticsBlog;
