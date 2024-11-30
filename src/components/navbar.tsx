import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

const Navbar: React.FC = () => {
  return (
    <nav className='w-full flex justify-end mt-10'>
      <div className='w-80 flex justify-between items-center'>
        <ul className='flex space-x-6'>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/editor">Editor</Link>
          </li>
          <li>
            <Link href="/pricing">Pricing</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;