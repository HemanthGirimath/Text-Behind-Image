import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className='w-full flex justify-end mt-10'>
      <ul className='w-64 flex justify-between '>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/text-image">Manga</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;