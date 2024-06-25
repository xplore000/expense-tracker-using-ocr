import React, { useEffect } from 'react';
import axios from 'axios';

const ProcessTicket = ({ steps, triggerNextStep }) => {
  useEffect(() => {
    const userId=localStorage.getItem('userId')
    const userEmail=localStorage.getItem('userEmail')
    const processTicket = async () => {
      const userMessage = steps[4].value;

      // Generate a random ticket number (replace with your actual logic)
      const ticketNumber = Math.floor(100000 + Math.random() * 900000);

      try {
        // Make API call to backend to store ticket information
        await axios.post('http://localhost:3002/api/v1/store-ticket', {
          userMessage,
          ticketNumber,
          userId // Replace with actual user ID logic
        });

        // Upon successful storage, send email to user
        await axios.post('http://localhost:3002/api/v1/send-email', {
          userEmail, // Replace with actual user email
          ticketNumber,
          userMessage
        });

        console.log('Email sent to user.');
      } catch (error) {
        console.error('Error processing ticket:', error);
      }

      // Trigger the next step
      triggerNextStep();
    };

    processTicket();
  }, [steps, triggerNextStep]);

  return <div>Processing...</div>;
};

export default ProcessTicket;
    