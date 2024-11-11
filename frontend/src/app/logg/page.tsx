// src/app/logg/page.tsx
"use client";
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

const Page = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <a href="/api/auth/logout" className="btn btn-primary btn-margin">
            Log out
          </a>
        </div>
      ) : (
        <a href="/api/auth/login" className="btn btn-primary btn-margin">
          Log in
        </a>
      )}
    </div>
  );
};

export default Page;
