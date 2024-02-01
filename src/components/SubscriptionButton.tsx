'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import axios from 'axios';

interface SubscriptionButtonProps {
  isPro: boolean;
}

const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false);
  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/stripe');
      window.location.href = response.data.url;
    } catch (error) {
      console.log('billing error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button className="mt-4" disabled={loading} onClick={handleSubscribe}>
      {isPro ? 'Manage Subscriptions' : 'Upgrade'}
    </Button>
  );
};

export default SubscriptionButton;
