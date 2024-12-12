import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { OFFSET, TimeScaleSync } from "../common";


const ChartComponent = ({ graphData, chartId, height, timeScale, buySellDates, showTooltip }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chartOptions = {
            layout: {
                textColor: '#FFFFFF',
                background: { type: 'solid', color: '#141414' }
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            crosshair: {
                mode: 1,
                vertLine: {
                    width: 1,
                    color: 'rgba(224, 227, 235, 0.1)',
                    style: 0,
                },
                horzLine: {
                    visible: true,
                    labelVisible: true,
                },
            },
            timeScale: {
                timeVisible: false,
                borderColor: '#333',
                tickMarkFormatter: (time) => (time + 1).toString(),
                fixLeftEdge: true,
                fixRightEdge: true,
                rightOffset: 0,
            },
            localization: {
                timeFormatter: (time) => `Lag: ${(time + 1)}`
            },
            grid: {
                vertLines: {
                    color: 'rgba(42, 46, 57, 0.6)',
                },
                horzLines: {
                    color: 'rgba(42, 46, 57, 0.6)',
                },
            },
        };

        const chart = createChart(chartContainerRef.current, chartOptions);

        const seriesOptions = {
            lineColor: '#00A2B8',
            topColor: '#00A2B8',
            bottomColor: 'rgba(0, 162, 184, 0.3)',
            priceFormat: {
                type: 'custom',
                minMove: 0.0001,
                formatter: (price) => price.toFixed(4),
            }
        };

        const areaSeries = chart.addAreaSeries(seriesOptions);

        const indexedData = graphData.map((item, index) => ({
            time: index,
            value: item.value
        }));
        areaSeries.setData(indexedData);

        if (indexedData.length > 0) {
            const maxPoint = indexedData.reduce((max, current) =>
                current.value > max.value ? current : max
            );

            const markers = [{
                time: maxPoint.time,
                position: 'aboveBar',
                color: '#FF4444',
                shape: 'arrowDown',
                text: `Differential: ${maxPoint.value.toFixed(4)}`
            }];

            if (buySellDates && buySellDates.length > 0) {
                const buySellMarkers = buySellDates
                    .map(signal => ({
                        time: signal.date.split(' ')[0],
                        position: 'aboveBar',
                        color: signal.action === 'BUY' ? '#FF4444' : '#4444FF',
                        shape: 'arrowDown',
                        text: signal.action
                    }))
                    .filter(marker => marker !== undefined)
                    .sort((a, b) => {
                        const timeA = new Date(a.time).getTime();
                        const timeB = new Date(b.time).getTime();
                        return timeA - timeB;
                    });

                markers.push(...buySellMarkers);
            }

            areaSeries.setMarkers(markers);
        }

        if (showTooltip) {
            const toolTip = document.createElement('div');
            toolTip.style.position = 'absolute';
            toolTip.style.display = 'none';
            toolTip.style.padding = '8px';
            toolTip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            toolTip.style.color = 'white';
            toolTip.style.borderRadius = '4px';
            toolTip.style.fontSize = '12px';
            toolTip.style.zIndex = '1000';
            toolTip.style.pointerEvents = 'none';
            chartContainerRef.current.appendChild(toolTip);

            chart.subscribeCrosshairMove(param => {
                if (
                    param.point === undefined ||
                    !param.time ||
                    param.point.x < 0 ||
                    param.point.y < 0
                ) {
                    toolTip.style.display = 'none';
                } else {
                    const data = param.seriesData.get(areaSeries);
                    const timeStr = `Lag: ${param.time + 1}`;

                    if (data) {
                        const price = data.value !== undefined ? data.value : data.close;
                        toolTip.style.display = 'block';
                        toolTip.innerHTML = `
                            <div style="font-weight: bold; margin-bottom: 4px">${timeStr}</div>
                            <div>Value: ${price.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
    })}</div>
                        `;

                        window.addEventListener('mousemove', (e) => {
                            toolTip.style.left = e.x + 'px';
                            toolTip.style.top = e.y + 'px';
                        });
                    }
                }

                if (timeScale) {
                    timeScale.crosshairMoved.emit(param);
                }
            });
        }

        if (timeScale) {
            chart.timeScale().subscribeVisibleTimeRangeChange(range => {
                timeScale.setTimeScale({
                    visibleRange: range,
                    logicalRange: chart.timeScale().getVisibleLogicalRange()
                });
            });

            timeScale.subscribe('timeScaleChanged', (params) => {
                if (params.visibleRange) {
                    chart.timeScale().setVisibleRange(params.visibleRange);
                }
                if (params.logicalRange) {
                    chart.timeScale().setVisibleLogicalRange(params.logicalRange);
                }
            });
        }

        chart.timeScale().fitContent();

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: height,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        chartRef.current = chart;

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.unsubscribeCrosshairMove();
            timeScale?.unsubscribeAll();
            chart.remove();
        };
    }, [graphData, height, timeScale, buySellDates, showTooltip, chartId]);

    return (
        <div ref={chartContainerRef} style={{ height: `${height}px` }} className="w-full" id={chartId} />
    );
};



const TlccChart = ({ ethPriceData, graphWithdrawData, tlccWithdrawData, graphDepositData, tlccDepositData, buySellDates }) => {
    const syncedTimeScale = useRef(new TimeScaleSync());

    const [iH, setIH] = useState(781);

    useEffect(() => {
        setIH(window.innerHeight - OFFSET);
    }, []);

    return (
        <div className="w-full h-full">
            <h1 className={'mb-2 mt-2'}>Withdrawal Frequency TLCC</h1>
            <ChartComponent
                graphData={tlccWithdrawData}
                chartId="tlccWithdraw"
                height={(iH) * 50 / 100 + 30}
                timeScale={null}
                showTooltip={true}
            />
            <h1 className={'mb-2 mt-2'}>Deposit Frequency TLCC</h1>
            <ChartComponent
                graphData={tlccDepositData}
                chartId="tlccDeposit"
                height={(iH) * 50 / 100 + 30}
                timeScale={null}
                showTooltip={true}
            />
        </div>
    );
};

export default TlccChart;