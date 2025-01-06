import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    // 在useEffect中调用异步函数，需要先声明
    const loadCall = async () => {
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id
        }
      });
      if (calls.length > 0) {
        setCall(calls[0]);
      }

      setIsCallLoading(false);
    };

    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
};