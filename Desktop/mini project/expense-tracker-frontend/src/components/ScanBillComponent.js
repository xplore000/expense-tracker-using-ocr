import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const fileTypes = ["jpg", "png", "gif", "jpeg"];

export default function ScanBillComponent({ onExpenseAdded }) {
  const [file, setFile] = useState(null);
  const [TotalExpense, setTotalExpense] = useState(0);
  const [newBillName, setNewBillName] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [localFileUrl, setLocalFileUrl] = useState(null);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [isOverBudget, setIsOverBudget] = useState(false);

  const handleChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleNameChange = (event) => {
    setNewBillName(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

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
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:3002/api/v1/get-incomes?user_id=${userId}`);
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
  }, []);

  useEffect(() => {
    if (monthlyExpense !== null && monthlyIncome !== null) {
      setIsOverBudget(monthlyExpense > monthlyIncome);
    }
  }, [monthlyExpense, monthlyIncome]);

  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Please select a file.');
        return;
      }

      if (!newBillName) {
        alert('Please enter a new bill name.');
        return;
      }

      if (!title) {
        alert('Please enter a title.');
        return;
      }

      setLoading(true);

      const category = "scan";
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      const finalFileName = `${newBillName}_${userId}`;
      formData.append('file', file, finalFileName);

      // Upload file
      const uploadResponse = await axios.post('http://localhost:3002/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("file Uploaded :", uploadResponse.data);

      // Save locally
      const reader = new FileReader();
      reader.onload = () => {
        setLocalFileUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Fetch expense data
      const expenseResponse = await axios.get('http://localhost:3002/api/v1/text-detection');

      // Calculate total expense
      let total = 0;
      expenseResponse.data.forEach((expense) => {
        if (expense.Type && expense.Type.Text === 'PRICE' && expense.ValueDetection && expense.ValueDetection.Text) {
          total += parseFloat(expense.ValueDetection.Text);
        }
      });

      setTotalExpense(total);
      setLoading(false);
      setConfirmationOpen(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file');
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      const category = "scan";
      const userId = localStorage.getItem('userId');

      const newExpenseTotal = monthlyExpense + TotalExpense;
      if (newExpenseTotal > monthlyIncome) {
        const confirm = window.confirm("Adding this expense will put you over your monthly budget. Do you want to continue?");
        if (!confirm) {
          setConfirmationOpen(false);
          return;
        }
      }

      // Save expense data to MongoDB
      const expenseData = {
        user_id: userId,
        category: category,
        bill_name: newBillName,
        title: title,
        amount: TotalExpense
      };
      await axios.post('http://localhost:3002/api/v1/add-expense', expenseData);

      onExpenseAdded();
      toast.success('Expense added successfully');
      if (newExpenseTotal > monthlyIncome) {
        toast.warning('Warning: You are over your monthly budget!');
      }
      setConfirmationOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding expense');
    }
  };

  useEffect(() => {
    const label = document.querySelector("label[for='fileInput']");
    if (label) {
      label.textContent = "Upload Bill";
    }
  }, []);

  return (
    <Card>
      <CardContent style={{ textAlign: 'center' }}>
        <form>
          <TextField
            type="text"
            placeholder="Enter new bill name"
            value={newBillName}
            onChange={handleNameChange}
            style={{ marginBottom: '10px' }}
          />
          <br />
          <TextField
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={handleTitleChange}
            style={{ marginBottom: '10px' }}
          />
          <br />
          <input
            type="file"
            id="fileInput"
            accept={fileTypes.map(type => `.${type}`).join(',')}
            onChange={handleChange}
          />
          <br />
          {file && (
            <div>
              <p>Selected file: {file.name}</p>
            </div>
          )}
          <br />
          <Button type="button" variant="contained" onClick={handleUpload} disabled={loading}>
            Upload & Calculate Expense
          </Button>
          {loading && <CircularProgress style={{ marginLeft: '10px' }} />}
        </form>
      </CardContent>
      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
      >
        <DialogTitle><Typography variant="body1" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Confirm Expense
          </Typography></DialogTitle>
          <DialogContent>
  <div style={{ border: '2px solid #ccc', padding: '10px', maxWidth: '100%', width: '300px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    {localFileUrl && <img src={localFileUrl} alt="Uploaded Bill" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
  </div>
  <Typography variant="body1" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '10px' }}>
    Is this the expense in the bill? Total Expense: ₹{TotalExpense.toFixed(2)}
  </Typography>
</DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
