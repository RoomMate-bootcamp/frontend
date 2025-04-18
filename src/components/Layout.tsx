import { ReactNode } from 'react';

export default function Layout({children}: {children: ReactNode} ) {
  return (
    <div className="w-full flex flex-wrap gap-3 items-start content-start min-h-[100vh]">
      <header className='w-full'>Буткемп проект</header>
      <main className='w-full flex flex-wrap gap-3'>
        {children} 
      </main>
    </div>
  )
}