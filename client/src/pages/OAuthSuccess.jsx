// client/src/pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { handleOAuthSuccess } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const completeOAuthLogin = async () => {
      if (token) {
        await handleOAuthSuccess(token);
        navigate('/dashboard', { replace: true });
        return;
      }

      navigate('/login', { replace: true });
    };

    void completeOAuthLogin();
  }, [handleOAuthSuccess, navigate]);

  return <div>Logging you in...</div>;
};

export default OAuthSuccess;
