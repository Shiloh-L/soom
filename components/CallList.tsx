'use client';
import {useGetCalls} from '@/hooks/useGetCalls';
import {useRouter} from 'next/navigation';
import {CallRecording} from '@stream-io/video-client';
import {
  useEffect,
  useState,
} from 'react';
import MeetingCard from '@/components/MeetingCard';
import {Call} from '@stream-io/video-react-sdk';
import Loader from '@/components/Loader';
import {useToast} from '@/hooks/use-toast';

const CallList = ({type}: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const {upcomingCalls, endedCalls, callRecordings, isLoading} = useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const {toast} = useToast();

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'upcoming':
        return upcomingCalls;
      case 'recordings':
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
            callRecordings.map((meeting) => meeting.queryRecordings()));
        const recordings = callData.filter(call =>
            call.recordings.length > 0).flatMap(call => call.recordings);
        setRecordings(recordings);
      } catch (error) {
        console.error(error);
        toast({title: 'Try again later'});
      }
    };

    if (type === 'recordings') fetchRecordings();
  }, [type, callRecordings, toast]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {calls && calls.length > 0 ?
            calls.map((meeting: Call | CallRecording) => (
                <MeetingCard key={(meeting as Call).id}
                             icon={
                               type === 'ended'
                                   ? '/icons/previous.svg'
                                   : type === 'upcoming'
                                       ? '/icons/upcoming.svg'
                                       : '/icons/recordings.svg'
                             }
                             title={(meeting as Call)?.state?.custom?.description?.substring(
                                     0, 25) ||
                                 (meeting as CallRecording)?.filename ||
                                 'Personal Meeting'}
                             date={(meeting as Call)?.state?.startsAt?.toLocaleString() ||
                                 (meeting as CallRecording)?.start_time?.toLocaleString()}
                             isPreviousMeeting={type === 'ended'}
                             buttonIcon={type === 'recordings' ?
                                 '/icons/play.svg' : undefined}
                             buttonText={type === 'recordings' ?
                                 'Play' :
                                 'Start'}
                             handleClick={type === 'recordings' ?
                                 () => router.push(
                                     `${(meeting as CallRecording).url}`) :
                                 () => router.push(
                                     `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`)}
                             link={type === 'recordings' ?
                                 (meeting as CallRecording).url :
                                 `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`}
                />
            )) : (<h1>{noCallsMessage}</h1>)}

      </div>
  );
};

export default CallList;