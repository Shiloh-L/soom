'use client';

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import {
  useEffect,
  useState,
} from 'react';
import {Button} from '@/components/ui/button';
import {toast} from '@/hooks/use-toast';

const MeetingSetup = ({setIsSetupComplete}: {
  setIsSetupComplete: (value: boolean) => void
}) => {
  const [isMicCamToggleOn, setIsMicCamToggleOn] = useState(false);
  const call = useCall();

  if (!call) {
    throw new Error('useCall must be used within StreamCall component');
  }

  useEffect(() => {
    const enableCameraAndMic = async () => {
      await call?.camera.enable();
      await call?.microphone.enable();
    };

    const disableCameraAndMic = async () => {
      await call?.camera.disable();
      await call?.microphone.disable();
    };
    if (isMicCamToggleOn) {
      disableCameraAndMic().then(() => {
        toast({title: 'Mic and Camera turned off'});
      });
    } else {
      enableCameraAndMic().then(() => {
            toast({title: 'Mic and Camera turned on'});
          },
      );
    }
  }, [isMicCamToggleOn, call?.camera, call?.microphone]);

  return (
      <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
        <h1 className='text-2xl font-bold'>Setup</h1>
        <VideoPreview />
        <div className='flex h-16 items-center justify-center gap-3'>
          <label className='flex items-center justify-center gap-2 font-medium'>
            <input type='checkbox'
                   checked={isMicCamToggleOn}
                   onChange={e => setIsMicCamToggleOn(e.target.checked)} />
            Join with mic and camera off
          </label>

          <DeviceSettings />
        </div>

        <Button className='rounded-md bg-green-500 px-4  py-2.5'
                onClick={() => {
                  call?.join();
                  setIsSetupComplete(true);
                }}>
          Join Meeting
        </Button>
      </div>
  );
};

export default MeetingSetup;