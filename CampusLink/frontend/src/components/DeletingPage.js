import React, { useState } from 'react';
import Footer from './Footer'
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
      console.log('Account Deleted');
    } else {
      console.log('Incorrect Confirmation Phrase');
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
