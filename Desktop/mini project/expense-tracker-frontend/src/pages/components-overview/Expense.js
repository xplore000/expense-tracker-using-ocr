import React, { useState } from "react";
import axios from "axios";

const Expense = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const expenseData = { ...formData, user_id: userId };

      await axios.post(
        "http://localhost:3002/api/v1/add-expense",
        expenseData
      );

      // Reset form after successful submission
      setFormData({ title: "", category: "", amount: 0 });
      alert("Expense added successfully");
      
    } catch (error) {
      console.error("Error adding expense:", error.message);
      alert("Failed to add expense. Please try again later.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-full max-w-md p-5 bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg">
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
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Sample title"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Sample category"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="amount"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Sample amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary-500 text-white rounded-lg transition duration-300 hover:bg-primary-600 focus:outline-none focus:bg-primary-600"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"></div>
    </>
  );
};

export default Expense;
