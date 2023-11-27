import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');

  useEffect(() => {
    fetch(`/api/verify-email/${uid}/${token}/`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      setVerificationStatus(data.message);
      if (data.message === 'Email verified successfully') {
        // Set a timeout to redirect after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 10000);
      }
    })
    .catch(error => {
      console.error('Error during email verification:', error);
      setVerificationStatus('An error occurred during verification. Please contact support.');
    });

    return () => clearTimeout();
  }, [uid, token, navigate]);

  return (
    <div>
      <p>{verificationStatus}</p>
    </div>
  );
}

export default EmailVerification;



