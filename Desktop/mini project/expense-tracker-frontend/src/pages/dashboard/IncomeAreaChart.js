import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios'
// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot }) => {
  const [monthlyExpenseTotal, setMonthlyExpenseTotal] = useState([]);
  const [monthlyIncome,setMonthlyIncome]=useState([])
  const [weeklyExpenseTotal, setWeeklyExpenseTotal] = useState([]);
  
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const userId=localStorage.getItem('userId')
        // Fetch expense data from backend API
        const response = await axios.get(`http://localhost:3002/api/v1/get-expenses?user_id=${userId}`);
        const expenses = response.data.expenses;
        const response1=await axios.get(`http://localhost:3002/api/v1/get-incomes?user_id=${userId}`)
        const incomes=response1.data.incomes
        // Initialize an array to store monthly totals
        const incomemonth=Array(12).fill(0) 
        const monthlyTotals = Array(12).fill(0); // Initialize with zeros for each month

        // Loop through expenses to accumulate totals for each month
        expenses.forEach(expense => {
          const date = new Date(expense.date);
          const month = date.getMonth();
          monthlyTotals[month] += expense.amount;
        });
        incomes.forEach(income => {
          const date = new Date(income.date);
          const month = date.getMonth();
          incomemonth[month]+=income.amount;
        });
        console.log(incomemonth)

        // Set the state with the calculated totals
        setMonthlyIncome(incomemonth)
        setMonthlyExpenseTotal(monthlyTotals);
       

        // Get current date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        const currentDayOfWeek = currentDate.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday

        // Get the first day of the current week
        const firstDayOfWeek = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek);

        // Get the last day of the current week
        const lastDayOfWeek = new Date(currentYear, currentMonth, currentDay + (6 - currentDayOfWeek));

        // Filter expenses for the current month
        const currentMonthExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });

        // Initialize an array to store daily totals for the current week (Monday to Sunday)
        const dailyTotals = Array(7).fill(0); // Initialize with zeros for each day

        // Loop through current month expenses to accumulate totals for each day of the current week
        currentMonthExpenses.forEach(expense => {
          const expenseDate = new Date(expense.date);
          if (expenseDate >= firstDayOfWeek && expenseDate <= lastDayOfWeek) {
            const dayOfWeek = expenseDate.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
            dailyTotals[dayOfWeek] += expense.amount;
          }
        });

        // Set the state with the calculated totals
        setWeeklyExpenseTotal(dailyTotals);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    // Call the fetchExpenseData function
    fetchExpenseData();
  }, []);
  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories:
          slot === 'month'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary
            ]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [primary, secondary, line, theme, slot]);

  const [series, setSeries] = useState([
    {
      name: 'Expense',
      data: [0, 86, 28, 115, 48, 210, 136]
    },
    {
      name: 'Incomes',
      data: [0, 43, 14, 56, 24, 105, 68]
    }
  ]);


  useEffect(() => {
    setSeries([
      {
        name: 'Expenses',
        data: slot === 'month' ? monthlyExpenseTotal : weeklyExpenseTotal
      },
      {
        name: 'Incomes',
        data: slot === 'month' ? monthlyIncome : monthlyExpenseTotal
      }
    ]);
  }, [slot]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;