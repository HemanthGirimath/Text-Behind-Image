'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { useUser } from '@/lib/user-context';
import { useToast } from "@/components/UI/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/UI/drop-down';
import { User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { state, dispatch } = useUser();
  const { toast } = useToast();

  const handleSignOut = () => {
    dispatch({ type: 'LOGOUT' });
    toast({
      title: "Success",
      description: "Signed out successfully"
    });
    router.push('/login');
  };

  return (
    <nav className='w-full flex justify-end mt-10'>
      <div className='w-80 flex justify-between items-center'>
        <ul className='flex space-x-6 items-center'>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/editor">Editor</Link>
          </li>
          <li>
            <Link href="/pricing">Pricing</Link>
          </li>
          {!state.isAuthenticated ? (
            <li>
              <Link href="/login">Login</Link>
            </li>
          ) : (
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          )}
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;