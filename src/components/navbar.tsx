'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { useToast } from "@/components/UI/use-toast"
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/UI/drop-down';
import { User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast({
      title: "Success",
      description: "Signed out successfully"
    });
    router.push('/login');
  };

  return (
    <nav className='w-full flex justify-between items-center px-4 md:px-6 py-4 border-b'>
      <div className='flex items-center space-x-4 md:space-x-6'>
        <Link href="/" className="text-xl font-bold">
          TextBehindImage
        </Link>
        <Link href="/editor" className="hover:text-primary">
          Editor
        </Link>
        <Link href="/pricing" className="hover:text-primary">
          Pricing
        </Link>
      </div>
      
      <div className='flex items-center space-x-3 md:space-x-4'>
        <ThemeToggle />
        {!session ? (
          <Link 
            href="/login"
            className="hover:text-primary"
          >
            Login
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar>
                <AvatarImage src={session.user?.image || ''} />
                <AvatarFallback>
                  {session.user?.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;