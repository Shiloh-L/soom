import Image from 'next/image';
import {useToast} from '@/hooks/use-toast';
import {avatarImages} from '@/constants';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';

type MeetingCardType = {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon,
  handleClick,
  link,
  buttonText,
}: MeetingCardType) => {
  const {toast} = useToast();

  return (
      <section className='flex min-h-[258px] flex-col justify-between px-5 py-8 rounded-[14px] gap-6 bg-dark-1 xl:max-w-[568px]'>
        <div className='flex flex-col gap-5'>
          <Image src={icon}
                 alt='upcoming meeting'
                 width={28}
                 height={28} />
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            <span>{date}</span>
          </div>
        </div>

        <div className='flex justify-center relative'>
          <div className='relative flex w-full max-sm:hidden'>
            {avatarImages.map((img, index) => (
                <Image key={index}
                       src={img}
                       alt='attendees'
                       width={40}
                       height={40}
                       className={cn('rounded-full', {absolute: index > 0})}
                       style={{top: 0, left: index * 28}}
                />
            ))}
            <div
                className='flex items-center justify-center absolute size-10 rounded-full border-[5px] border-dark-3 bg-dark-4'
                style={{left: `${avatarImages.length * 28}px`}}
            >
              +5
            </div>
          </div>

          {!isPreviousMeeting && (
              <div className='flex gap-2'>
                <Button onClick={handleClick}
                        className='px-6 bg-blue-1'>
                  {buttonIcon && (
                      <Image src={buttonIcon}
                             alt='buttonIcon'
                             width={20}
                             height={20} />
                  )}
                  &nbsp;{buttonText}</Button>
                <Button className='px-6 bg-dark-4'
                        onClick={() => {
                          navigator.clipboard.writeText(link);
                          toast({title: 'Link Copied'});
                        }}>
                  <Image
                      src='/icons/copy.svg'
                      alt='Copy Link'
                      width={20}
                      height={20}
                  />
                  &nbsp; Copy Link</Button>
              </div>
          )}
        </div>
      </section>
  );
};

export default MeetingCard;