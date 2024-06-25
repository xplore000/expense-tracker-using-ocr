import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddExpensePopup from '../../components/AddExpensePopup';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import autoTable from 'jspdf-autotable';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ControlsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
});

const TableWithFiltersContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

export default function CustomizedTables() {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [sortOrder, setSortOrder] = useState('latest');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editExpense, setEditExpense] = useState({ title: '', category: '', amount: '', date: '' });
  const tableRef = useRef(null);

  const fetchUpdatedExpenses = async () => {
    try {
      const storedUserId = localStorage.getItem('userId')
      const response = await axios.get(`http://localhost:3002/api/v1/get-expenses?user_id=${storedUserId}`);
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const fetchIncomeData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/v1/get-incomes?${storedUserId}`);
        setIncomes(response.data.incomes);
      } catch (error) {
        console.error("Error fetching incomes:", error);
      }
    };

    const fetchData = async () => {
      try {
        
        const response = await axios.get(`http://localhost:3002/api/v1/get-expenses?user_id=${storedUserId}`);
        setExpenses(response.data.expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchData();
    fetchIncomeData();
  }, []);

  const handleOpenDialog = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExpenseId(null);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://localhost:3002/api/v1/delete-expense/${selectedExpenseId}`);
      setExpenses(expenses.filter((expense) => expense._id !== selectedExpenseId));
      handleCloseDialog();
      toast.success("Expense Deleted");
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEditRow = (expenseId) => {
    const expense = expenses.find((expense) => expense._id === expenseId);
    if (expense) {
      setEditExpense({ ...expense, date: new Date(expense.date).toISOString().substr(0, 10) });
      setEditDialogOpen(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:3002/api/v1/update-expense/${editExpense._id}`, editExpense);
      if (response.status === 200) {
        setExpenses((prev) => prev.map((exp) => (exp._id === editExpense._id ? editExpense : exp)));
        setEditDialogOpen(false);
        toast.success("Expense Updated");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Error updating expense");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const currentMonth = selectedMonth;

    const totalExpenseCurrentMonth = expenses
      .filter(expense => new Date(expense.date).getMonth() + 1 === currentMonth)
      .reduce((total, expense) => total + expense.amount, 0);

    const totalIncomeCurrentMonth = incomes
      .filter(income => new Date(income.date).getMonth() + 1 === currentMonth)
      .reduce((total, income) => total + income.amount, 0);

    const tableContent = expenses
      .filter(expense => new Date(expense.date).getMonth() + 1 === currentMonth)
      .map(expense => [expense.title, expense.category, `$${expense.amount.toFixed(2)}`, new Date(expense.date).toLocaleDateString("en-US")]);

    doc.text("Expense Tracker Weekly Report", 10, 10);
    doc.text(`Total Expense (Current Month): $${totalExpenseCurrentMonth.toFixed(2)}`, 10, 20);
    doc.text(`Total Income (Current Month): $${totalIncomeCurrentMonth.toFixed(2)}`, 10, 30);

    autoTable(doc, {
      head: [['Title', 'Category', 'Amount', 'Date']],
      body: tableContent,
      startY: 40,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontStyle: 'bold',
        fontSize: 10,
        textColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      margin: { top: 15 },
    });

    return doc;
  };

  const downloadPDF = () => {
    setLoadingPDF(true);
    const doc = generatePDF();
    doc.save(`Weekly Expense Report.pdf`);
  };

  const uploadPDF = async () => {
    try {
      const doc = generatePDF();
      const pdfBlob = doc.output('blob');

      const formData = new FormData();
      formData.append('pdf', pdfBlob, 'Weekly_Expense_Report.pdf');

      const response = await axios.post('http://localhost:3002/api/v1/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log("pdf uploaded successfully");
        sharePDF();
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const sharePDF = async () => {
    try {
      const userEmail=localStorage.getItem('userEmail')
      const response = await axios.post('http://localhost:3002/api/v1/share-pdf',{email:userEmail});
      if (response.status === 200) {
        toast.success("PDF shared successfully!");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      toast.error("Error sharing PDF");
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredExpenses = expenses.filter(expense => new Date(expense.date).getMonth() + 1 === selectedMonth);

  const sortedExpenses = filteredExpenses.sort((a, b) => {
    if (sortOrder === 'low-to-high') {
      return a.amount - b.amount;
    } else if (sortOrder === 'high-to-low') {
      return b.amount - a.amount;
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <div>
      <ControlsContainer>
        <div>
          <AddExpensePopup onUpdateExpenses={fetchUpdatedExpenses} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Button variant="contained" onClick={downloadPDF} style={{ marginBottom: '10px' }}>
              Download PDF
            </Button>
            <Button variant="contained" onClick={uploadPDF} style={{ marginRight: '30px' }}>
              Share PDF
            </Button>
            
          </div>
        </div>
        <div>
          <FormControl variant="outlined" style={{ marginRight: '10px' }}>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Month"
            >
              {[...Array(12).keys()].map(month => (
                <MenuItem key={month + 1} value={month + 1}>
                  {new Date(0, month).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel id="sort-order-select-label">Sort Order</InputLabel>
            <Select
              labelId="sort-order-select-label"
              id="sort-order-select"
              value={sortOrder}
              onChange={handleSortOrderChange}
              label="Sort Order"
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="low-to-high">Low to High</MenuItem>
              <MenuItem value="high-to-low">High to Low</MenuItem>
            </Select>
          </FormControl>
        </div>
      </ControlsContainer>
      <TableWithFiltersContainer>
        <TableContainer component={Paper} style={{ flexGrow: 1 }}>
          <div ref={tableRef}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell align="right">Category</StyledTableCell>
                  <StyledTableCell align="right">Amount</StyledTableCell>
                  <StyledTableCell align="right">Date</StyledTableCell>
                  <StyledTableCell align="right"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedExpenses.map((expense) => (
                  <StyledTableRow key={expense._id}>
                    <StyledTableCell component="th" scope="row">
                      {expense.title}
                    </StyledTableCell>
                    <StyledTableCell align="right">{expense.category}</StyledTableCell>
                    <StyledTableCell align="right">{expense.amount}</StyledTableCell>
                    <StyledTableCell align="right">{new Date(expense.date).toLocaleDateString("en-US")}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Button variant="outlined" color="secondary" onClick={() => handleOpenDialog(expense._id)}>
                        <DeleteIcon />
                      </Button>
                      <span style={{ marginRight: '10px' }}></span>
                      <Button variant="outlined" color="primary" onClick={() => handleEditRow(expense._id)}><EditIcon /></Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TableContainer>
      </TableWithFiltersContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this expense?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={editExpense.title}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            value={editExpense.category}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={editExpense.amount}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={editExpense.date}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
