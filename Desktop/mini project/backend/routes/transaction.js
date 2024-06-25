const { addExpense, deleteExpense,getExpense, updateExpense } = require('../controllers/expense')
const { addIncome,getIncome,deleteIncome,editIncome, extraIncome, updateIncome } = require('../controllers/income')
const uploadRoutes = require('../routes/upload')
const { getFileName } = require('../controllers/filename')
const { processTextDetection } = require('../controllers/textDetection')
const { addLog, getLog } = require('../controllers/log')

const router  = require('express').Router()


router.get('/',(req,res)=>{
    res.send('Expense Tracker Backend')
})
//income
router.post('/add-income',addIncome)
router.post('/extra-income',extraIncome)

router.get('/get-incomes',getIncome)
router.delete('/delete-income/:id',deleteIncome)
router.put('/update-income/:id', updateIncome);
//expense
router.post('/add-expense',addExpense)
router.get('/get-expenses',getExpense)
router.delete('/delete-expense/:id',deleteExpense)
router.put('/update-expense/:id',updateExpense);
router.use('/upload', uploadRoutes);
router.get('/filename', getFileName);
router.get('/text-detection',processTextDetection)
router.post('/add-log',addLog)
router.get('/get-log',getLog)
module.exports = router