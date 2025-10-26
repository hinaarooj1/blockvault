import React, { useEffect, useState, CSSProperties } from "react";
import { ClipLoader } from "react-spinners"
import axios from "axios";
import './table.css'
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import Spinner from 'react-bootstrap/Spinner';
const TodayStatsChart = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loadTotal, setLoadTotal] = useState(0);
    const [isLoading, setisLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0] // default today
    );

    const fetchData = async (date) => {

        try {
            const res = await axios.get(`https://watchpower-api-main-1.onrender.com/stats?date=${date}`);
            if (res.data.success) {
                const graphData = res.data.graph;

                // Calculate totals (assume ~5min interval per record)
                let pvSum = 0;
                let loadSum = 0;
                const intervalHours = 5 / 60;

                graphData.forEach((point) => {
                    pvSum += point.pv_power * intervalHours;
                    loadSum += point.load_power * intervalHours;
                });

                setData(graphData);
                setTotal((pvSum / 1000).toFixed(2));
                setLoadTotal((loadSum / 1000).toFixed(2));
            } else {
                setData([]);
                setTotal(0);
                setLoadTotal(0);
            }
        } catch (err) {
            console.error("Error fetching API:", err);
        } finally {
            setisLoading(false)

        }
    };

    useEffect(() => {
        fetchData(selectedDate);
        setisLoading(true)
    }, [selectedDate]);
    useEffect(() => {
        // initial fetch
        fetchData(selectedDate);

        // auto refresh every 30 sec
        const interval = setInterval(() => {
            fetchData(selectedDate);
        }, 309000);

        // cleanup on unmount
        return () => clearInterval(interval);
    }, [selectedDate]);
    return (
        <div style={{ width: "100%", height: 550 }}>
            <h2>Solar Stats</h2>

            {/* Date Picker */}
            <div style={{ marginBottom: "15px" }}>
                <label><b>Select Date: </b></label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <p><b>Total Production (PV):</b> {isLoading ? <>...</> : `${total} kWh`} </p>
            <p><b>Total Usage (Load):</b> {isLoading ? <>...</> : `${loadTotal} kWh`} </p>

            {isLoading ?
                <> <div className="center-asa">

                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner></div></>
                : <ResponsiveContainer height={400}>
                    <AreaChart
  data={data}
  margin={{ top: 20, right: 30, left: 10, bottom: 0 }} // smaller left
>

                        <defs>
                            <linearGradient id="pvColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="loadColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="time" />
                   <YAxis
  width={40}
  tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
  tickFormatter={(value) => `${value / 1000}k`} // e.g., 2000 → 2k
/>
                        <Tooltip />
                        <Legend />

                        <Area
                            type="monotone"
                            dataKey="pv_power"
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#pvColor)"
                            name="PV Power (W)"
                        />
                        <Area
                            type="monotone"
                            dataKey="load_power"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#loadColor)"
                            name="Load Power (W)"
                        />
                    </AreaChart>
                </ResponsiveContainer>}
        </div>
    );
};

export default TodayStatsChart;
