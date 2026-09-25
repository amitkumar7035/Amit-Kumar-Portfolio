import React, { useState, useEffect, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface ProfileImageProps {
  alt?: string;
  className?: string;
  prioritySrc?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  alt = 'Amit Kumar - Web Developer',
  className = 'w-full h-full object-cover',
  prioritySrc,
  referrerPolicy = 'no-referrer',
}) => {
  const { profilePhoto } = usePortfolio();

  // Resilient candidate list in priority order for production and local environments
  // Ensures compatibility with relative Vercel paths, custom filenames, and fallback placeholder
  const candidateList = useMemo(() => {
    const list: string[] = [];

    // 1. Explicit prop src
    if (prioritySrc && !list.includes(prioritySrc)) {
      list.push(prioritySrc);
    }

    // 2. Active photo from context / localStorage
    if (profilePhoto && !list.includes(profilePhoto)) {
      list.push(profilePhoto);
    }

    // 3. Standard public asset paths (Vercel serves everything in public/ at the root '/')
    const standardCandidates = [
      '/profile.jpg',
      '/profile.png',
      '/profile.webp',
      '/images/profile.jpg',
      '/images/profile.png',
      '/IMG_20231108_191858_290.webp',
      '/IMG_20231108_191858_290.jpg',
      './profile.jpg',
      './profile.png',
      '/images/profile-placeholder.svg',
    ];

    for (const candidate of standardCandidates) {
      if (!list.includes(candidate)) {
        list.push(candidate);
      }
    }

    return list;
  }, [prioritySrc, profilePhoto]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index whenever profilePhoto or prioritySrc changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [prioritySrc, profilePhoto]);

  const handleError = () => {
    setCurrentIndex((prev) => {
      if (prev < candidateList.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  };

  const currentSrc = candidateList[currentIndex] || '/images/profile-placeholder.svg';

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      referrerPolicy={referrerPolicy}
      loading="lazy"
    />
  );
};
