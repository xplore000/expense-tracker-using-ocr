import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function CustomizedTables({ refreshTable }) {
  const [incomes, setIncomes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', amount: '', date: '' });
  const tableRef = useRef(null);

  const fetchIncomeData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:3002/api/v1/get-incomes?user_id=${userId}`);
      const apiData = response.data.incomes;
      console.log('API Data:', apiData);
      setIncomes(apiData);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, [refreshTable]);

  const handleClickOpen = (income) => {
    setSelectedIncome(income);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIncome(null);
  };

  const handleEditOpen = (income) => {
    setSelectedIncome(income);
    setFormData({
      title: income.title,
      category: income.category,
      amount: income.amount,
      date: new Date(income.date).toISOString().split('T')[0]
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedIncome(null);
    setFormData({ title: '', category: '', amount: '', date: '' });
  };

  const handleDelete = async () => {
    if (selectedIncome) {
      try {
        await axios.delete(`http://localhost:3002/api/v1/delete-income/${selectedIncome._id}`);
        setIncomes(incomes.filter((income) => income._id !== selectedIncome._id));
        handleClose();
        toast.success("Income Deleted Successfully")
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditSave = async () => {
    if (selectedIncome) {
      try {
        await axios.put(`http://localhost:3002/api/v1/update-income/${selectedIncome._id}`, formData);
        setIncomes(incomes.map((income) =>
          income._id === selectedIncome._id ? { ...income, ...formData } : income
        ));
        handleEditClose();
        toast.success("Income Updated Successfully")
      } catch (error) {
        console.error("Error updating income:", error);
      }
    }
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <div ref={tableRef}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell align="right">Category</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell align="right">Date</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomes.map((income) => (
                <StyledTableRow key={income._id}>
                  <StyledTableCell component="th" scope="row">
                    {income.title}
                  </StyledTableCell>
                  <StyledTableCell align="right">{income.category}</StyledTableCell>
                  <StyledTableCell align="right">{income.amount}</StyledTableCell>
                  <StyledTableCell align="right">{new Date(income.date).toLocaleDateString("en-US")}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button color="primary" variant="outlined" onClick={() => handleEditOpen(income)}>
                      <EditIcon />
                    </Button>
                    <span style={{ marginRight: '10px' }}></span>
                    <Button color="secondary" variant="outlined" onClick={() => handleClickOpen(income)}>
                      <DeleteIcon />
                    </Button> 
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this income entry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Income</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={formData.title}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            value={formData.category}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
