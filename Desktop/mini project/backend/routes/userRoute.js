const express = require("express");
const { loginController, registerController, verifyOtpController, resendOtpController } = require("../controllers/user");

// Router object
const router = express.Router();

// Routers
// POST || login
router.post("/userLogin", loginController);

// POST || register
router.post("/userRegister", registerController);

// POST || verify OTP
router.post("/verifyOtp", verifyOtpController);

router.post("/resendOtp",resendOtpController)

module.exports = router;
