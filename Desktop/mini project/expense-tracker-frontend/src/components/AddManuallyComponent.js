import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddManuallyComponent({ onCancel, onExpenseAdded }) {
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    amount: 0,
  });
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [monthlyExpense, setMonthlyExpense] = useState(0); // Initialize with 0
  const [monthlyIncome, setMonthlyIncome] = useState(0); // Initialize with 0
  const [isOverBudget, setIsOverBudget] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/v1/get-incomes?${userId}`);
        const apiData = response.data.incomes;
        setIncomes(apiData);
      } catch (error) {
        console.error("Error fetching incomes:", error);
      }
    };

    const fetchExpensesData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/v1/get-expenses?${userId}`);
        const apiData = response.data.expenses;
        setExpenses(apiData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchIncomeData();
    fetchExpensesData();
  }, []);
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
  });

  useEffect(() => {
    if (monthlyExpense !== null && monthlyIncome !== null) {
      setIsOverBudget(monthlyExpense > monthlyIncome);
    }
  }, [monthlyExpense, monthlyIncome]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpenseTotal = monthlyExpense + parseFloat(formData.amount);
    if (newExpenseTotal > monthlyIncome) {
      setShowConfirmation(true);
    } else {
      addExpense();
    }
  };

  const addExpense = async () => {
    try {
      const expenseData = { ...formData, user_id: userId };
      const response = await axios.post('http://localhost:3002/api/v1/add-expense', expenseData);

      setExpenses([...expenses, response.data.expense]);

      setFormData({ title: '', category: '', amount: 0 });

      onExpenseAdded();

      toast.success('Expense added successfully');

      if (monthlyExpense + parseFloat(formData.amount) > monthlyIncome) {
        toast.warning('Warning: You are over your monthly budget!');
      }
    } catch (error) {
      console.error('Error adding expense:', error.message);
      toast.error('Failed to add expense. Please try again later.');
    }
  };

  const handleConfirmationClose = (confirm) => {
    setShowConfirmation(false);
    if (confirm) {
      addExpense();
    }
  };

  return (
    <Card>
      <CardContent>
        <h2>Add Expense Manually</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            id="category"
            name="category"
            label="Category"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <TextField
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button type="button" onClick={onCancel} variant="contained" style={{ marginLeft: '8px' }}>
            Cancel
          </Button>
        </form>
        <Dialog
          open={showConfirmation}
          onClose={() => handleConfirmationClose(false)}
        >
          <DialogTitle>Over Budget Warning</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Adding this expense will put you over your monthly budget. Do you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleConfirmationClose(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleConfirmationClose(true)} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
