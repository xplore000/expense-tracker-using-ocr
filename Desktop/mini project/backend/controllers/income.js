// In your incomeController.js file

const Income = require('../models/incomeModel');

exports.addIncome = async (req, res) => {
  const { user_id, title, category, amount } = req.body;

  try {
    if (!user_id || !title || !category || !amount)
      return res.status(400).json({
        message: "User ID, title, category, and amount are required!",
      });

    const income = new Income({
      user_id,
      title,
      category,
      amount,
    });

    await income.save();
    res.status(200).json({ message: "Income added", income });
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.extraIncome = async (req, res) => {
  const { user_id, title, category, amount } = req.body;

  try {
    if (!user_id || !title || !category || !amount)
      return res.status(400).json({
        message: "User ID, title, category, and amount are required!",
      });

    const income = new Income({
      user_id,
      title,
      category,
      amount,
    });

    await income.save();
    res.status(200).json({ message: "Extra Income added", income });
  } catch (error) {
    console.error("Error adding extra income:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  const { title, category, amount, date } = req.body;

  try {
    if (!title || !category || !amount || !date)
      return res.status(400).json({
        message: "Title, category, amount, and date are required!",
      });

    const income = await Income.findByIdAndUpdate(
      id,
      { title, category, amount, date },
      { new: true }
    );

    if (!income) return res.status(404).json({ message: "Income not found" });

    res.status(200).json({ message: "Income updated", income });
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getIncome = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const incomes = await Income.find({ user_id: userId }).sort({ createdAt: -1 });
    res.status(200).json({ incomes });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;

  try {
    const income = await Income.findByIdAndDelete(id);
    if (!income)
      return res.status(404).json({ message: "Income not found" });
    res.status(200).json({ message: "Income deleted" });
  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({ message: "Server error" });
  }
};
