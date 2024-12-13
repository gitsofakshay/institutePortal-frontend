import React from 'react'
import spinner from '../assets/loading.svg';

export default function Loading() {
  return (
    <div style={styles.loadingContainer}>
      <img src={spinner} alt="loading..." style={styles.spinner} />
    </div>
  );
}

const styles = {
  loadingContainer: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: adds a translucent background
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: '100px', // You can adjust the size as needed
    height: '100px',
  },
};