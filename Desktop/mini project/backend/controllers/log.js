
const Log = require('../models/logModel');
const logSchema = require('../models/logModel')


exports.addLog = async (req, res) => {
  
    console.log(req.body);
    const { message, deletedObjectId, action, user_id } = req.body;
  
    try {
      if (!user_id || !message || !deletedObjectId || !action)
        return res.status(400).json({
          message: "All fields are required",
        });
  
      const log = new Log({
        message, deletedObjectId, action, user_id
      });
  
      await log.save();
      res.status(200).json({ message: "Log added", log });
    } catch (error) {
      console.error("Error adding log:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.getLog = async (req, res) => {
    try {
      const userId = req.query.user_id;
        const logs = await logSchema.find({user_id: userId}).sort({ createdAt: -1 });
        res.status(200).json({ logs });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
 