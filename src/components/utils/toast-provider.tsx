"use client";

import React from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-center"
      hideProgressBar
	  	autoClose={3000}
      newestOnTop={false}
      transition={Slide}
      pauseOnHover
      theme="colored"
      icon={({ type }) => {
        switch (type) {
          case 'info':
            return <i className="fa-solid fa-info text-white" />;
          case 'error':
            return <i className="fa-solid fa-exclamation-triangle text-white" />;
          case 'success':
            return <i className="fa-solid fa-check-circle text-white" />;
          case 'warning':
            return <i className="fa-solid fa-exclamation-triangle text-white" />;
          default:
            return null;
				}
      }}
    />
  );
}
