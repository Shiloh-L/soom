import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HomeCardProps {
  img: string;
  title: string;
  description: string;
  handleClick: () => void;
  className: string;
}

const HomeCard = ({ img, title, description, handleClick, className }: HomeCardProps) => {
  return (
    <div className={cn('cursor-pointer px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px]' +
      ' rounded-[14px]', className)}
         onClick={handleClick}>
      <div className='glassmorphism flex-center size-12 rounded-[10px]'>
        <Image src={img}
               alt={title}
               width={27}
               height={27} />
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <span className='text-lg font-normal'>{description}</span>
      </div>
    </div>
  );
};

export default HomeCard;