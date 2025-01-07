'use client';

import HomeCard from '@/components/HomeCard';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import MeetingModal from '@/components/MeetingModal';
import {useUser} from '@clerk/nextjs';
import {Call, useStreamVideoClient} from '@stream-io/video-react-sdk';
import {useToast} from '@/hooks/use-toast';
import {Textarea} from '@/components/ui/textarea';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | 'undefined'>();
  const router = useRouter();
  const {user} = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const {toast} = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: 'Please select a date and time',
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Failed to create a call');

      const startsAt = values.dateTime.toISOString() ||
          new Date(Date.now()).toISOString();
      const description = values.description || 'Instant meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      // Enable
      call.update({
        settings_override: {
          recording: {
            mode: 'available',
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({title: 'Meeting Created'});
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to create a meeting',
      });
    }
  };
  return (
      <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard img='/icons/add-meeting.svg'
                  title='New Meeting'
                  description='Start an instant meeting'
                  handleClick={() => setMeetingState('isInstantMeeting')}
                  className='bg-orange-1'
        />
        <HomeCard img='/icons/join-meeting.svg'
                  title='Join Meeting'
                  description='Via invitation link'
                  handleClick={() => setMeetingState('isJoiningMeeting')}
                  className='bg-yellow-1'
        />
        <HomeCard img='/icons/schedule.svg'
                  title='Schedule Meeting'
                  description='Plan your meeting'
                  handleClick={() => setMeetingState('isScheduleMeeting')}
                  className='bg-blue-1'
        />
        <HomeCard img='/icons/recordings.svg'
                  title='View Recordings'
                  description='Check out your recordings'
                  handleClick={() => router.push('/recordings')}
                  className='bg-purple-1'
        />

        {!callDetails ? (
            <MeetingModal isOpen={meetingState === 'isScheduleMeeting'}
                          onClose={() => setMeetingState(undefined)}
                          title='Create meeting'
                          handleClick={createMeeting}
            >
              <div className='flex flex-col gap-2.5'>
                <label className='leading-[22px] text-sky-2'>
                  Add a description
                </label>
                <Textarea className='bg-dark-3 border-none focus-visible:ring-0 focus-visible:ring-offset-0'
                          onChange={e => {
                            setValues({...values, description: e.target.value});
                          }} />
              </div>

              <div className='flex flex-col gap-2.5'>
                <label className='leading-[22px] text-sky-2'>
                  Select Date and Time
                </label>
                <ReactDatePicker selected={values.dateTime}
                                 onChange={(date) => setValues(
                                     {...values, dateTime: date!})}
                                 showTimeSelect
                                 timeFormat='HH:mm'
                                 timeIntervals={15}
                                 timeCaption='time'
                                 dateFormat='MMMM d, yyyy h:mm aa'
                                 className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                />
              </div>
            </MeetingModal>) : (
            <MeetingModal isOpen={meetingState === 'isScheduleMeeting'}
                          onClose={() => setMeetingState(undefined)}
                          title='Meeting Created'
                          handleClick={() => {
                            // navigator.clipboard.writeText(meetingLink);
                            // toast({title: 'Link copied'});
                          }}
                          image='/icons/checked.svg'
                          buttonIcon='/icons/copy.svg'
                          buttonText='Copy Meeting Link'
            />
        )}
        <MeetingModal isOpen={meetingState === 'isInstantMeeting'}
                      onClose={() => setMeetingState(undefined)}
                      title='Start an Instant Meeting'
                      className='text-center'
                      buttonText={'Start Meeting'}
                      handleClick={createMeeting} />

      </section>
  );
};

export default MeetingTypeList;