import { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
// chart options
const barChartOptions = {
  series: [{
    name: 'Income',
  }],
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: [], // Initially empty, will be populated with fetched data
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  grid: {
    show: false
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: function(val) {
        return "<strong>$ " + val + "</strong>"; // Display the amount as the tooltip label
      }
    },
    x: {
      formatter: function(val) {
        return "<strong>Month: " + val + "</strong>"; // Display the month with 'Month:' prefix as the tooltip label for x-axis
      }
    }
  }
};



// ==============================|| MONTHLY BAR CHART ||============================== //

const MonthlyBarChart = () => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  const [series,setSeries] = useState([
    {
      name:"<strong>Income</strong>",
      data: [] // Initially empty, will be populated with fetched data
    }
  ]);

  const [options, setOptions] = useState(barChartOptions);

  useEffect(() => {
    const userId=localStorage.getItem('userId')
    // Fetch data from your backend API
    axios.get(`http://localhost:3002/api/v1/get-incomes?user_id=${userId}`)
      .then(response => {
        const apiData = response.data.incomes;
        console.log('API Data:', apiData);

        // Extracting data for x-axis categories and bar chart series
        const categories = apiData.map(item => item.title.split('-')[0]); // Extracting month from title
        const data = apiData.map(item => item.amount); // Amount from API data

        // Update options with fetched data
        setOptions(prevState => ({
          ...prevState,
          xaxis: {
            categories,
            labels: {
              style: {
                colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
              }
            }
          },
          tooltip: {
            name:"Income",
            theme: 'light'
          }
        }));

        // Update series with fetched data
        setSeries([{ data }]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [primary, info, secondary]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </div>
  );
};

export default MonthlyBarChart;
