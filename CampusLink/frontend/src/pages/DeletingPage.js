import React, { useState } from 'react';
import Footer from '../components/Footer'
import '../styles/DeletingPage.css'

export default function DeletingPage() {
  const [inputValue, setInputValue] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  function handleChange(e) {
    setInputValue(e.target.value);
    setIsConfirmed(e.target.value === 'DELETE MY ACCOUNT');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isConfirmed) {
      // Call the function to delete the account here
      fetch('/api/user/delete/chen3284@purdue.edu/', {
        method: 'DELETE',
      })
      .then(response => {
        if (response.status === 204) {
          console.log('Account Deleted');
          //Redirect
        }
        else {
          console.error('Error deleting account');
        }

      })
      
    }
  }

  return (
    <div className='Deletingbackground'>
      <h1>Delete Account</h1>
      <form onSubmit={handleSubmit} className='form'>
        <label className='label'>
          Type "DELETE MY ACCOUNT" to confirm:
          <input type="text" value={inputValue} onChange={handleChange} className='input'/>
        </label>
        <br />
        <button type="submit" disabled={!isConfirmed}>Delete Account</button>
      </form>
      <Footer> </Footer>
    </div>
    
  );
}
