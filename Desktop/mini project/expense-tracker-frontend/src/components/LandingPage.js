// src/components/LandingPage.js
import React from 'react';
import './LandingPage.css'; // Create this file for styles

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Expense Tracker</h1>
        <p>Manage your expenses efficiently and effortlessly.</p>
        <a href="/login" className="landing-button">Get Started</a>
      </header>
      <section className="landing-features">
        <div className="feature">
          <img src="/path/to/expense1.png" alt="Track Expenses" />
          <h2>Track Expenses</h2>
          <p>Easily track all your expenses in one place.</p>
        </div>
        <div className="feature">
          <img src="/path/to/graph.png" alt="Visualize Data" />
          <h2>Visualize Data</h2>
          <p>Gain insights with our detailed charts and graphs.</p>
        </div>
        <div className="feature">
          <img src="/path/to/scan.png" alt="Scan Bills" />
          <h2>Scan Bills</h2>
          <p>Quickly scan and save your bills and receipts.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
