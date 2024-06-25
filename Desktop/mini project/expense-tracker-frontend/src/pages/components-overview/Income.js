import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Income = ({ onAddOrEditIncome }) => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    category: '',
    amount: 0,
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId);
      setFormData((prevData) => ({ ...prevData, user_id: storedUserId }));
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3002/api/v1/add-income', formData)
      .then((response) => {
        if (response.status === 200) {
          setMonthlyIncome(formData.amount);
          setShowModal(false);
          toast.success('Income Added Successfully');
          setFormData({
            user_id: '',
            title: '',
            category: '',
            amount: 0,
          });
          onAddOrEditIncome();  // Trigger table refresh
        } else {
          throw new Error('Failed to add income');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEditIncome = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3002/api/v1/edit-income/${formData.id}`, formData)
      .then((response) => {
        if (response.status === 200) {
          setMonthlyIncome(formData.amount);
          setShowModal(false);
          toast.success('Income Edited Successfully');
          setFormData({
            user_id: '',
            title: '',
            category: '',
            amount: 0,
          });
          onAddOrEditIncome();  // Trigger table refresh
        } else {
          throw new Error('Failed to update income');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUpdateIncome = () => {
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
    setFormData({
      user_id: userId,
      title: '',
      category: '',
      amount: 0,
    });
  };

  return (
    <>
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={handleUpdateIncome}>
          Set Monthly Income
        </Button>
      </Stack>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-full max-w-md p-5 bg-gray-100 dark:bg-gray-100 border border-gray-300 dark:border-gray-700 shadow-md rounded-lg">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 dark:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {formData.id ? 'Edit' : 'Add'} Income
            </h2>
            <form onSubmit={formData.id ? handleEditIncome : handleAddIncome}>
              <div className="mb-5">
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-white::placeholder"
                  placeholder="Title"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 text-white"
                  placeholder="Category"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="amount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 text-white"
                  placeholder="Amount"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="outlined"
                className="w-full py-2 px-4 bg-primary-500 text-gray rounded-lg transition duration-300 hover:bg-gray-200 focus:outline-none focus:bg-primary-600"
              >
                {formData.id ? 'Edit' : 'Add'} Income
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Income;
