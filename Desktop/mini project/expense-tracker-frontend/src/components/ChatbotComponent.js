import React from 'react';
import ChatBot from 'react-simple-chatbot';
import ProcessTicket from './ProcessTicket'; // Import your custom component

const steps = [
  {
    id: '1',
    message: 'Welcome To Expense Tracker! How can I help you today?',
    trigger: '2',
  },
  {
    id: '2',
    options: [
      { value: 'problem', label: 'I have a problem', trigger: '3' },
    ],
  },
  {
    id: '3',
    message: 'Please describe your problem:',
    trigger: '4',
  },
  {
    id: '4',
    user: true,
    trigger: '5',
  },
  {
    id: '5',
    message: 'Thank you for the information. A ticket has been raised for your problem.',
    trigger: '6',
    delay: 1000, // Delay before triggering the action
  },
  {
    id: '6',
    component: <ProcessTicket />,
    waitAction: true,
    trigger: '7'
  },
  {
    id: '7',
    message: 'Your ticket is being processed. You will receive an email confirmation shortly.',
    end: true,
  }
];

const ChatbotComponent = () => {
  return <ChatBot steps={steps} />;
};

export default ChatbotComponent;
