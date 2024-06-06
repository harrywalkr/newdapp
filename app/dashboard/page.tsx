import ProfileDashboard from '@/components/features/dashboard/dashboard';
import React from 'react';
import Head from 'next/head';

export const metadata = {
  title: 'Profile Dashboard',
  description: 'User profile dashboard displaying user information and activities',
};

export default function Profile() {
  return (
    <ProfileDashboard />
  );
}
