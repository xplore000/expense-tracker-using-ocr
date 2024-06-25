import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddManuallyComponent from './AddManuallyComponent';
import ScanBillComponent from './ScanBillComponent';

const AddExpensePopup = ({ onUpdateExpenses }) => {
  const [open, setOpen] = useState(false);
  const [showAddManually, setShowAddManually] = useState(false);
  const [showScanBill, setShowScanBill] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddManually = () => {
    setShowAddManually(true);
    setShowScanBill(false);
  };

  const handleScanBill = () => {
    setShowScanBill(true);
    setShowAddManually(false);
  };

  const handleBack = () => {
    setShowAddManually(false);
    setShowScanBill(false);
  };

  const handleExpenseAdded = () => {
    // Call the onUpdateExpenses function passed from parent
    onUpdateExpenses();
    handleClose(); // Close the dialog after adding expense
  };

  return (
    <div>
      <Button variant="contained" color="primary" style={{ marginBottom: '8px' }} onClick={handleOpen}>Add Expense</Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          {showAddManually && (
            <AddManuallyComponent onExpenseAdded={handleExpenseAdded} />
          )}
          {showScanBill && (
            <ScanBillComponent onExpenseAdded={handleExpenseAdded} />
          )}
          {!showAddManually && !showScanBill && (
            <div>
              <Button variant="contained" color="primary" onClick={handleAddManually}>
                Add Manually
              </Button>
              <Button variant="contained" color="primary" onClick={handleScanBill} style={{ marginLeft: '10px' }}>
                Scan Bill
              </Button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {(showAddManually || showScanBill) && (
            <Button onClick={handleBack}>
              Back
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddExpensePopup;
