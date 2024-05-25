import ProfileDashboard from '@/components/features/dashboard/dashboard';
import React from 'react';
import Head from 'next/head';

export const metadata = {
  title: 'Profile Dashboard',
  description: 'User profile dashboard displaying user information and activities',
};

export default function Profile() {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content="Profile, Dashboard, User Information" />
        {/* FIXME: your name must be the users name */}
        <meta name="author" content="Your Name" />
      </Head>
      <ProfileDashboard />
    </>
  );
}
