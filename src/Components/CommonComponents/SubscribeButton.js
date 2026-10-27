import React, { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';

// There's no sign-in, so subscriptions are remembered in this browser only.
const STORAGE_KEY = 'subscriptions';

const readSubscriptions = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
};

const SubscribeButton = ({ channelId }) => {
  const [subscribed, setSubscribed] = useState(() => readSubscriptions().includes(channelId));

  useEffect(() => {
    setSubscribed(readSubscriptions().includes(channelId));
  }, [channelId]);

  if (!channelId) return null;

  const toggle = () => {
    const list = readSubscriptions().filter((id) => id !== channelId);
    if (!subscribed) list.push(channelId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // Still toggle for this visit if storage is unavailable.
    }
    setSubscribed(!subscribed);
  };

  return (
    <button className={`subscribe-btn ${subscribed ? 'is-subscribed' : ''}`} onClick={toggle}>
      {subscribed ? <><FiBell /> Subscribed</> : 'Subscribe'}
    </button>
  );
};

export default SubscribeButton;
