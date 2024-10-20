'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { FaGithub } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client';
import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js'; 

export default function LoginBtn() {
    const pathname = usePathname();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      };
      getUser();
    }, [supabase]);
  
    const handleLogin = async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: location.origin + '/auth/callback?next=' + pathname
        }
      });
    };
  
    const handleLogout = async () => {
      await supabase.auth.signOut();
      setUser(null); // Update the state immediately
      // Optionally, refresh the page after logging out
      window.location.reload(); // This will force a full page refresh
    };

  return (
    <div>
      {user ? (
        <div className='flex items-center gap-2'>
          <img 
            alt={user.email} 
            src={user.user_metadata.avatar_url} 
            className='w-8 h-8 rounded-full' // Adjust size and styling as needed
          />
          <span>{user.email}</span>
          <Button variant='outline' onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <Button variant='outline' className='flex items-center gap-2' onClick={handleLogin}>
          <FaGithub />
          Login
        </Button>
      )}
    </div>
  );
}
