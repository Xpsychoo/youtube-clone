import React, { useEffect, useState } from 'react';
import { toUrl } from '../../Utils/AppConstants';

// Channel image with a coloured initial as fallback when there's no image or it fails to load.
const Avatar = ({ src, name = '', size = 36, className = '' }) => {
  const url = toUrl(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [url]);

  const style = { width: size, height: size, fontSize: Math.round(size * 0.42) };

  if (!url || failed) {
    const cleanName = name.replace(/^@/, '');
    const hue = [...cleanName].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
    return (
      <span
        className={`avatar avatar--fallback ${className}`}
        style={{ ...style, background: `hsl(${hue} 55% 42%)` }}
        aria-label={name}
      >
        {cleanName.charAt(0).toUpperCase() || '?'}
      </span>
    );
  }

  return (
    <img
      className={`avatar ${className}`}
      src={url}
      alt={name}
      style={style}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
};

export default Avatar;
