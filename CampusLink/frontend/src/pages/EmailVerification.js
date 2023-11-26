import React from 'react';
import { useParams } from 'react-router-dom';

const EmailVerification = () => {
  const { uid, token } = useParams();

  return (
    <div>
      Email validated.
    </div>
  );
}

export default EmailVerification;
