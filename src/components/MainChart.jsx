import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { OFFSET, TimeScaleSync } from "../common";

const ChartComponent = ({ graphData, chartId, height, timeScale, buySellDates, showTooltip, isCompChart }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const tooltipRef = useRef(null);
    const mouseMoveListenerRef = useRef(null);

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
                timeVisible: true,
                borderColor: '#333',
            },
            localization: {
                timeFormatter:
                    (time) => new Date(time * 1000).toLocaleDateString(),
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
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
        };

        const areaSeries = chart.addAreaSeries(seriesOptions);

        areaSeries.setData(graphData);

        if (buySellDates && buySellDates.length > 0) {
            const markers = buySellDates
                .map((signal, i) => {
                    if (signal.date.split(' ')[0].length === 0) return;
                    return ({
                        time: signal.date.split(' ')[0],
                        position: 'aboveBar',
                        color: signal.action === 'BUY' ? (isCompChart ? '#FFA500' : '#FF4444') : (isCompChart ? '#00FF00' : '#4444FF'),
                        shape: 'arrowDown',
                        text: `${signal.action} ${i}${isCompChart ? '' : ''}`
                    });
                })
                .filter(item => item !== undefined)
                .sort((a, b) => {
                    const timeA = new Date(a.time).getTime();
                    const timeB = new Date(b.time).getTime();
                    return timeA - timeB;
                });

            if (markers && markers.length) areaSeries.setMarkers(markers);
        }


        if (showTooltip) {
            if (tooltipRef.current && chartContainerRef.current.contains(tooltipRef.current)) {
                chartContainerRef.current.removeChild(tooltipRef.current);
            }
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
                    const timeStr = new Date(param.time * 1000).toLocaleDateString();

                    if (data) {
                        const price = data.value !== undefined ? data.value : data.close;
                        toolTip.style.display = 'block';
                        toolTip.innerHTML = `
                            <div style="font-weight: bold; margin-bottom: 4px">${timeStr}${isCompChart ? ' (Comparison)' : ''}</div>
                            <div>Value: ${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}</div>
                        `;
                        const handleMouseMove = (e) => {
                            if (toolTip.style.display === 'block') {
                                toolTip.style.left = `${e.pageX + 10}px`;
                                toolTip.style.top = `${e.pageY - 30}px`;
                            }
                        };

                        mouseMoveListenerRef.current = handleMouseMove;

                        window.addEventListener('mousemove', handleMouseMove);
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
            if (mouseMoveListenerRef.current) {
                window.removeEventListener('mousemove', mouseMoveListenerRef.current);
                mouseMoveListenerRef.current = null;
            }

            // Clean up tooltip
            if (tooltipRef.current && chartContainerRef.current?.contains(tooltipRef.current)) {
                chartContainerRef.current.removeChild(tooltipRef.current);
                tooltipRef.current = null;
            }
            window.removeEventListener('resize', handleResize);
            chart.unsubscribeCrosshairMove();
            timeScale?.unsubscribeAll();
            chart.remove();
        };
    }, [graphData, height, timeScale, buySellDates, showTooltip, chartId, isCompChart]);

    return (
        <div ref={chartContainerRef} style={{ height: `${height}px` }} className="w-full" id={chartId} />
    );
};

const MainChart = ({
    ethPriceData, ethPriceDataComp,
    // selectedId, selectedIdComp,
    graphWithdrawData, graphDepositData, buySellDates,
    fixedSelectedId, fixedSelectedIdComp,
    buySellDatesComp
}) => {
    const syncedTimeScale = useRef(new TimeScaleSync());

    const [iH, setIH] = useState(781);

    useEffect(() => {
        setIH(window.innerHeight - OFFSET);
    }, []);

    return (
        <div className="w-full h-full">
            <p className={'mb-4 text-2xl font-bold'}>Graphs</p>
            <h1 className={'mb-2'}>Ethereum Price (ETH) {fixedSelectedId}</h1>
            <ChartComponent
                graphData={ethPriceData}
                chartId="ethPrice"
                height={iH * 30 / 100}
                timeScale={syncedTimeScale.current}
                buySellDates={buySellDates}
                showTooltip={true}
                isCompChart={false}
            />
            <h1 className={'mb-2'}>Ethereum Price (ETH) {fixedSelectedIdComp}</h1>
            <ChartComponent
                graphData={ethPriceDataComp}
                chartId="ethPriceComp"
                height={iH * 30 / 100}
                timeScale={syncedTimeScale.current}
                buySellDates={buySellDatesComp}
                showTooltip={true}
                isCompChart={true}
            />
            <h1 className={'mb-2 mt-2'}>Withdrawal Frequency (Differentiated by TLCC)</h1>
            <ChartComponent
                graphData={graphWithdrawData}
                chartId="graphWithdraw"
                showTooltip={true}
                height={iH * 20 / 100}
                timeScale={syncedTimeScale.current}
            />
            <h1 className={'mb-2 mt-2'}>Deposit Frequency (Differentiated by TLCC)</h1>
            <ChartComponent
                graphData={graphDepositData}
                chartId="graphDeposit"
                showTooltip={true}
                height={iH * 20 / 100}
                timeScale={syncedTimeScale.current}
            />
        </div>
    );
};

export default MainChart;