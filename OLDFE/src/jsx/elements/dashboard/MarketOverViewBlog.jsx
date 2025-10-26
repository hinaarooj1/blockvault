import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Nav, Tab } from 'react-bootstrap';
import axios from 'axios';

const cryptoTab = [
  { title: 'Week', type: 'week' },
  { title: 'Month', type: 'month' },
  { title: 'Year', type: 'year' },
];

const MarketOverViewBlog = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    chart: {
      type: 'candlestick',
      height: 280,
      toolbar: {
        show: false,
      }
    },
    grid: {
      show: false,
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#3ab67a',
          downward: '#fd5353'
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          color: 'var(--text)',
        },
      }
    },
    yaxis: {
      opposite: true,
      tooltip: {
        enabled: true
      }
    }
  };

  useEffect(() => {
    const fetchData = async (type) => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.example.com/crypto-data/${type}`);
        const data = response.data.map(item => ({
          x: new Date(item.timestamp),
          y: item.prices,
        }));
        setSeries([{ data }]);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    // Fetch initial data for the default tab (Week)
    fetchData('week');
  }, []);

  const handleTabChange = (type) => {
    setSeries([]);
    setLoading(true);
    setError(null);
    fetchData(type);
  };

  const fetchData = async (type) => {
    try {
      const response = await axios.get(`https://api.example.com/crypto-data/${type}`);
      const data = response.data.map(item => ({
        x: new Date(item.timestamp),
        y: item.prices,
      }));
      setSeries([{ data }]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Tab.Container defaultActiveKey={cryptoTab[0].type}>
        <Nav variant="pills">
          {cryptoTab.map(tab => (
            <Nav.Item key={tab.type}>
              <Nav.Link eventKey={tab.type} onClick={() => handleTabChange(tab.type)}>
                {tab.title}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="week">
            <ReactApexChart options={options} series={series} type="candlestick" height={350} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default MarketOverViewBlog;
