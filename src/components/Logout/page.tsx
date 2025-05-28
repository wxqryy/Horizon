"use client";

import React, { useEffect } from 'react';
import { useAuth } from 'wxqryy/components/AuthProvider';

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Выход...</h1>
    </div>
  );
};

export default LogoutPage;