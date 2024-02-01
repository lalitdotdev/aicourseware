import Link from 'next/link';
import React from 'react';

import { getAuthSession } from '@/lib/auth';
import { ThemeToggle } from './ThemeToggle';
import SignInButton from './SignInButton';
import { Blocks, FilePlus2, SlidersHorizontal } from 'lucide-react';
import UserAccountNav from './UserAccountNav';

type Props = {};

const Navbar = async (props: Props) => {
  const session = await getAuthSession();
  //   console.log(session);
  return (
    <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-center h-full gap-2 px-8 mx-auto sm:justify-between max-w-7xl">
        <Link href="/gallery" className="items-center hidden gap-2 sm:flex">
          <p className="rounded-lg border-2 border-b-8 border-r-8 border-green-600 px-2 py-1 text-lg font-bold transition-all hover:-translate-y-[2px] md:block dark:border-green-600">
            <span className="text-green-600 mr-[1px]">ai</span>courseware
          </p>
        </Link>
        <div className="flex items-center">
          <Link href="/gallery" className="mr-3 ">
            {/* <Blocks /> */}
            Course Catalog
          </Link>
          {session?.user && (
            <>
              <Link href="/create" className="mr-3 ">
                {/* <FilePlus2 size={22} /> */}
                Create Course
              </Link>
              <Link href="/settings" className="mr-3">
                {/* <SlidersHorizontal /> */}
                Settings
              </Link>
            </>
          )}
          <ThemeToggle className="mr-3" />
          <div className="flex items-center ml-8">
            {session?.user ? <UserAccountNav user={session.user} /> : <SignInButton />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
