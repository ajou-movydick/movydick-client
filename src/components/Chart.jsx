import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const Chart = () => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: 400,
            height: 400,
            autoSize: true,
            layout: {
                background: { color: '#ffffff' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
            timeScale: {
                borderColor: '#d1d4dc',
            },
            rightPriceScale: {
                borderColor: '#d1d4dc',
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        const candleData = [
            { time: '2024-01-01', open: 100, high: 105, low: 98, close: 102 },
            { time: '2024-01-02', open: 102, high: 108, low: 100, close: 107 },
            { time: '2024-01-03', open: 107, high: 110, low: 103, close: 105 },
            { time: '2024-01-04', open: 105, high: 112, low: 104, close: 111 },
            { time: '2024-01-05', open: 111, high: 115, low: 109, close: 114 },
        ];

        candlestickSeries.setData(candleData);

        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        const volumeData = [
            { time: '2024-01-01', value: 200000 },
            { time: '2024-01-02', value: 250000 },
            { time: '2024-01-03', value: 180000 },
            { time: '2024-01-04', value: 300000 },
            { time: '2024-01-05', value: 280000 },
        ];

        volumeSeries.setData(volumeData);

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        chartRef.current = chart;

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div className="w-1/2 h-[400px] border border-gray-200 rounded-lg">
            <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    );
};

export default Chart;