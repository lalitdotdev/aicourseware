'use client';

import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import axios from 'axios';

interface SubscriptionActionProps {}

const SubscriptionAction: FC<SubscriptionActionProps> = ({}) => {
  const { data } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/stripe');
      window.location.href = response.data.url;
    } catch (error) {
      console.log('stripe error', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center w-1/2 p-4 mx-auto mt-4 rounded-md bg-secondary">
      {data?.user.credits} / 10 Free Generations
      <Progress className="mt-2 " value={data?.user.credits ? (data.user.credits / 10) * 100 : 0} />
      <div className="mt-2 text-sm text-center text-secondary-foreground/60">
        {data?.user.credits
          ? `You have ${data.user.credits} free generations  left`
          : 'You have no free generations left'}
      </div>
      <Button
        disabled={loading}
        onClick={handleSubscribe}
        className="mt-3 font-bold text-white transition bg-gradient-to-tr from-green-500 to-blue-500 hover:from-green-500 hover:to-blue-600"
      >
        Upgrade
        <Zap className="fill-white ml-2" />
      </Button>
    </div>
  );
};

export default SubscriptionAction;
