import React, { useState, useEffect } from 'react';

const LoadingSpinner = ({ isLoading }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === '') return '.';
                if (prev === '.') return '..';
                if (prev === '..') return '...';
                return '';
            });
        }, 500); // 500ms 간격으로 변경. 원하는 속도로 조절 가능합니다.

        return () => clearInterval(interval);
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
            <div className="relative w-100 h-100 animate-spin">
                <svg width="200" height="200" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.31063 31.5623C11.696 41.83 23.347 37.5518 28.1244 34.1292C28.8089 32.9311 27.8392 33.0597 27.2687 33.2738C20.9369 36.183 16.3592 32.0616 14.8618 29.6372C14.3485 28.4393 13.7923 28.9954 13.5784 29.4233C11.6959 32.8458 6.5193 31.7049 4.16627 30.7066C3.1395 30.5355 3.16802 31.2057 3.31063 31.5623Z"
                        fill="#014852"/>
                    <path
                        d="M0.529731 15.3061C-1.01043 15.135 1.17147 11.8122 2.45494 10.1722C4.85074 8.6322 6.59056 9.53056 7.161 10.1722C7.161 8.80333 5.59231 8.03307 4.80797 7.81906C9.94185 1.8294 18.7835 2.61392 22.5626 3.75489C27.3543 -2.23463 32.973 0.261001 35.1834 2.25751C29.7073 3.45542 28.6235 6.03662 28.7661 7.17748C38.1782 16.2473 33.686 27.2139 30.2635 31.5634C28.381 18.7287 18.9261 14.6644 14.434 14.2366C12.2093 14.4077 11.6531 17.7305 11.6531 19.3704C9.25733 18.8571 8.9436 15.1635 9.0862 13.3809C4.46571 13.2098 1.45668 14.5931 0.529731 15.3061Z"
                        fill="#00A2B8"/>
                </svg>
            </div>
            <h1 className="mt-10 text-4xl text-white">Loading {dots}</h1>
        </div>
    );
};

export default LoadingSpinner;