import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Stack,
  Button,
  Typography,
  Tooltip,
  Avatar // Import IconButton from Material-UI
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import ChatbotComponent from 'components/ChatbotComponent';

import ChatBubbleIcon from '@mui/icons-material/ChatBubble'; // Import the messaging icon
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'; // Import the rupee icon

const DashboardDefault = () => {
  const userId = localStorage.getItem('userId');
  const [slot, setSlot] = useState('week');
  const [monthlyExpense, setMonthlyExpense] = useState(0); // Initialize with 0
  const [monthlyIncome, setMonthlyIncome] = useState(0); // Initialize with 0
  const [isOverBudget, setIsOverBudget] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const fetchMonthlyExpense = async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:3002/api/v1/get-expenses?user_id=${userId}`);
      const expenses = response.data.expenses;

      const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = expenseDate.getMonth() + 1;
        const expenseYear = expenseDate.getFullYear();
        return expenseMonth === currentMonth && expenseYear === currentYear;
      });

      const totalMonthlyExpense = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
      setMonthlyExpense(totalMonthlyExpense);
    } catch (error) {
      console.error('Error fetching monthly expense:', error);
    }
  };

  const fetchMonthlyIncome = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/v1/get-incomes?user_id=${userId}`
      );
      const incomes = response.data.incomes;
      const currentMonth = new Date().getMonth() + 1;
      const currentMonthIncomes = incomes.filter(income => {
        const incomeMonth = new Date(income.date).getMonth() + 1;
        return incomeMonth === currentMonth;
      });
      const totalCurrentMonthIncome = currentMonthIncomes.reduce((total, income) => total + income.amount, 0);
      setMonthlyIncome(totalCurrentMonthIncome);
    } catch (error) {
      console.error('Error fetching monthly income:', error);
    }
  };

  useEffect(() => {
    fetchMonthlyExpense();
    fetchMonthlyIncome();
  }, [slot]);

  useEffect(() => {
    // Check if monthlyExpense and monthlyIncome are not null before setting isOverBudget
    if (monthlyExpense !== null && monthlyIncome !== null) {
      setIsOverBudget(monthlyExpense > monthlyIncome);
    }
  }, [monthlyExpense, monthlyIncome]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title={
            <>
              Monthly Expense
              {isOverBudget && (
                <Tooltip title={`Your expense is greater than\nyour income`} placement="right">
                  <WarningIcon sx={{ color: 'red', ml: 1 }} />
                </Tooltip>
              )}
            </>
          }
          count={<span style={{ color: isOverBudget ? 'red' : 'inherit' }}>
            {monthlyExpense !== null ? <><CurrencyRupeeIcon />{monthlyExpense.toFixed(2)}</> : 'Loading...'}
          </span>}
          sx={isOverBudget ? { border: '1px solid red', backgroundColor: '#ffebee' } : {}}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Monthly Income"
          count={monthlyIncome !== null ? <><CurrencyRupeeIcon />{monthlyIncome.toFixed(2)}</> : 'Loading...'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Balance Money"
          count={monthlyIncome !== null && monthlyExpense !== null ? <><CurrencyRupeeIcon />{(monthlyIncome - monthlyExpense).toFixed(2)}</> : 'Loading...'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Savings" count="0" />
      </Grid>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Expenses & Incomes</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                Income Statistics
              </Typography>
              <Typography variant="h3">{monthlyIncome !== null ? <><CurrencyRupeeIcon />{monthlyIncome.toFixed(2)}</> : 'Loading...'}</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <Avatar sx={{ backgroundColor: '#000000' }} onClick={() => setShowChatbot(!showChatbot)}>
          <ChatBubbleIcon />
        </Avatar>
        {showChatbot && (
          <div style={{ marginTop: '10px' }}>
            <ChatbotComponent />
          </div>
        )}
      </div>
    </Grid>
  );
};

export default DashboardDefault;
