import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import './MyChart.css'

Chart.register(zoomPlugin);

const MyChart = () => {
  const [chartData, setChartData] = useState({});
  const [timeframe, setTimeframe] = useState('daily');
  const chartRef = useRef(null);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Data:', data); 
        let filteredData;
        if (timeframe === 'daily') {
          filteredData = data;
        } else if (timeframe === 'weekly') {
          filteredData = aggregateData(data, 7);
        } else if (timeframe === 'monthly') {
          filteredData = aggregateData(data, 30);
        }

        const labels = filteredData.map(item => new Date(item.timestamp).toLocaleDateString());
        console.log(labels)
        const values = filteredData.map(item => item.value);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Values Over Time',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        });
        console.log('Chart Data:', { labels, values }); 
      });
  }, [timeframe]);

  const aggregateData = (data, days) => {
    const aggregated = [];
    for (let i = 0; i < data.length; i += days) {
      const slice = data.slice(i, i + days);
      const avgValue = slice.reduce((acc, item) => acc + item.value, 0) 
      aggregated.push({ timestamp: slice[0].timestamp, value: avgValue });
    }
    return aggregated;
  };

  const options = {
    responsive: true,
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const { index } = elements[0];
        alert(`Clicked on data point date: ${chartData.labels[index]} - Value: ${chartData.datasets[0].data[index]}`);
      }
    },
  };

  const downloadChart = () => {
    const link = document.createElement('a');
    link.href = chartRef.current.toBase64Image();
    link.download = 'chart.png';
    link.click();
  };

  return (
    <div>
      <div>
        <button onClick={() => setTimeframe('daily')} className='timeframes onhovering'>Daily</button>
        <button onClick={() => setTimeframe('weekly')} className='timeframes onhovering'>Weekly</button>
        <button onClick={() => setTimeframe('monthly')} className='timeframes onhovering'>Monthly</button>
        <button onClick={downloadChart} className='timeframes onhovering'>Download Chart</button>
      </div>
      {chartData.labels && chartData.labels.length > 0 ? ( 
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <p>please be there,chart Loading ...</p>
      )}
    </div>
  );
};

export default MyChart;
