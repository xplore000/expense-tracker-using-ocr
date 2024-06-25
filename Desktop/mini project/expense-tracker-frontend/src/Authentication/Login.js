import React, { useEffect, useState } from 'react';
import { message, Modal, Input } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import './style.css';
import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import { Backdrop } from '@mui/material';

const PasswordStrengthMeter = ({ password }) => {
  const testResult = zxcvbn(password);
  const num = testResult.score * 100 / 4;

  const createPassLabel = () => {
    switch (testResult.score) {
      case 0:
        return 'Very weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const funcProgressColor = () => {
    switch (testResult.score) {
      case 0:
        return '#828282';
      case 1:
        return '#EA1111';
      case 2:
        return '#FFAD00';
      case 3:
        return '#9bc158';
      case 4:
        return '#00b500';
      default:
        return 'none';
    }
  };

  const changePasswordColor = () => ({
    width: `${num}%`,
    background: funcProgressColor(),
    height: '7px'
  });

  return (
    <>
      <div className="progress" style={{ height: '7px' }}>
        <div className="progress-bar" style={changePasswordColor()}></div>
      </div>
      <p style={{ color: funcProgressColor() }}>{createPassLabel()}</p>
    </>
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const MovedPasswordStrengthMeter = styled(PasswordStrengthMeter)`
    margin-bottom: 10px;
  `;

  useEffect(() => {
    const inputs = document.querySelectorAll('.input-field');
    const toggle_btn = document.querySelectorAll('.toggle');
    const main = document.querySelector('main');
    const bullets = document.querySelectorAll('.bullets span');
    const images = document.querySelectorAll('.image');

    let currentIndex = 0;

    if (location.pathname === '/') {
      window.location.reload();
    }

    function moveSlider() {
      const index = parseInt(this.dataset.value, 10) - 1;

      images.forEach((img, i) => {
        img.classList.remove('show');
        if (i === index) {
          img.classList.add('show');
        }
      });

      const textSlider = document.querySelector('.text-group');
      textSlider.style.transform = `translateY(${-index * 2.2}rem)`;

      bullets.forEach((bull) => bull.classList.remove('active'));
      this.classList.add('active');
      currentIndex = index;
    }

    function moveToNextImage() {
      const nextIndex = (currentIndex + 1) % images.length;
      bullets[nextIndex].click();
    }

    bullets.forEach((bullet) => {
      bullet.addEventListener('click', moveSlider);
    });

    toggle_btn.forEach((btn) => {
      btn.addEventListener('click', toggleForm);
    });

    function toggleForm() {
      main.classList.toggle('sign-up-mode');
    }

    const intervalId = setInterval(moveToNextImage, 3000);

    return () => {
      inputs.forEach((inp) => {
        inp.removeEventListener('focus', () => {
          inp.classList.add('active');
        });
        inp.removeEventListener('blur', () => {
          if (inp.value !== '') return;
          inp.classList.remove('active');
        });
      });

      toggle_btn.forEach((btn) => {
        btn.removeEventListener('click', toggleForm);
      });

      bullets.forEach((bullet) => {
        bullet.removeEventListener('click', moveSlider);
      });

      clearInterval(intervalId);
    };
  }, [location.pathname]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const formData = {
        email: email,
        password: password
      };

      console.log(formData);

      const response = await axios.post('http://localhost:3002/api/v1/userLogin', formData);

      setLoading(false);
      navigate('/');
      message.success('Logged in successfully!');
      console.log(response.data);

      const userData = {
        userId: response.data.user._id,
        userName: response.data.user.name,
        userEmail: response.data.user.email
      };

      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('userName', userData.userName);
      localStorage.setItem('userEmail', userData.userEmail);
      localStorage.setItem('isReturningUser', 'true');
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const registerSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const formDataJSON = {};
    formData.forEach((value, key) => {
      formDataJSON[key] = value;
    });

    console.log(formDataJSON);

    try {
      const response = await axios.post('http://localhost:3002/api/v1/userRegister', formDataJSON);

      console.log(response.data);
      setEmail(formDataJSON.email);
      setIsOtpModalVisible(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      await axios.post('http://localhost:3002/api/v1/verifyOtp', {
        email,
        otp
      });

      message.success('OTP verified successfully!');
      setIsOtpModalVisible(false);
      navigate('/');
    } catch (error) {
      message.error('Invalid OTP, please try again.');
      console.error('Error:', error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:3002/api/v1/resendOtp', { email });

      message.success('OTP resent successfully!');
    } catch (error) {
      message.error('Error resending OTP. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <main>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form autoComplete="off" className="sign-in-form" id="login-form" onSubmit={handleSubmit}>
              <div className="logo">
                <h4
                  style={{
                    fontWeight: 'bold',
                    color: 'rgb(45, 82, 231)',
                    fontSize: 25
                  }}
                >
                  Expense Tracker!
                </h4>
              </div>
              <div className="heading">
                <h2>Welcome Back</h2>
                <h6>Not registered yet?</h6>
                <a href="#" className="toggle">
                  Sign up
                </a>
              </div>
              <div className="actual-form">
                <label htmlFor="email" className="">
                  Email
                </label>
                <div className="input-wrap">
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm rounded-md w-full px-12 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your@email.com"
                    style={{ paddingLeft: '10px' }}
                  />
                </div>
                <label htmlFor="password" className="">
                  Password
                </label>
                <div className="input-wrap">
                  <input
                    id="password"
                    type="password"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="login-button-class">
                  <input type="submit" defaultValue="Sign In" className="sign-btn" />
                </div>

                <p className="text">
                  Forgotten your password or your login details?
                  <a href="#">Get help</a> signing in
                </p>
              </div>
            </form>
            <form autoComplete="off" className="sign-up-form" onSubmit={registerSubmit}>
              <div className="logo">
                <h4
                  style={{
                    fontWeight: 'bold',
                    color: 'rgb(45, 82, 231)',
                    fontSize: 25
                  }}
                >
                  Expense Tracker!
                </h4>
              </div>
              <div className="heading">
                <h2>Get Started</h2>
                <h6>Already have an account?</h6>
                <a href="#" className="toggle">
                  Sign in
                </a>
              </div>
              <div className="actual-form">
                <label htmlFor="name" className="">
                  Name
                </label>
                <div className="input-wrap">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="shadow-sm rounded-md w-full px-12 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Name :"
                    style={{ paddingLeft: '10px' }}
                  />
                </div>
                <label htmlFor="email" className="">
                  Email
                </label>
                <div className="input-wrap">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="shadow-sm rounded-md w-full px-12 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your@email.com"
                    style={{ paddingLeft: '10px' }}
                  />
                </div>
                <label htmlFor="password" className="">
                  Password
                </label>
                <div className="input-wrap">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <MovedPasswordStrengthMeter password={password} />
                <div className="input-wrap">
                  <div className="login-button-class">
                    <input type="submit" defaultValue="Sign Up" className="sign-btn" id="reg-button" />
                  </div>
                </div>

                <p className="text">
                  By signing up, I agree to the
                  <a href="#">Terms of Services</a> and
                  <a href="#">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>
          <div className="carousel">
            <div className="images-wrapper">
              <img src="./expense3.png" className="image img-1 show" alt="invalid" />
              <img src="./expense4.png" className="image img-2" alt="invalid" />
              <img src="./expense1.png" className="image img-3" alt="invalid" />
            </div>
            <div className="text-slider">
              <div className="text-wrap">
                <div className="text-group">
                  <h2>Explore our expense tracker!</h2>
                  <h2>Track your expenses</h2>
                  <h2>Lets save together</h2>
                </div>
              </div>
              <div className="bullets">
                <span className="active" data-value={1} />
                <span data-value={2} />
                <span data-value={3} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal title="OTP Verification" open={isOtpModalVisible} onOk={handleOtpSubmit} onCancel={() => setIsOtpModalVisible(false)}>
        <p>Please enter the OTP sent to your email:</p>
        <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={handleResendOtp}
            style={{ color: 'blue', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            Resend OTP
          </button>
        </div>
      </Modal>
    </main>
  );
};

export default Login;
