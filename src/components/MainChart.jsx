import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const ChartComponent = ({ graphData, chartId, height, timeScale, buySellDates, showTooltip }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const isTLCCChart = chartId === 'tlccWithdraw' || chartId === 'tlccDeposit';

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
            timeScale: isTLCCChart ? {
                timeVisible: false,
                borderColor: '#333',
                tickMarkFormatter: (time) => (time + 1).toString(),
                fixLeftEdge: true,
                fixRightEdge: true,
                rightOffset: 0,
            } : {
                timeVisible: true,
                borderColor: '#333',
            },
            localization: {
                timeFormatter: isTLCCChart ?
                    (time) => `Lag: ${(time + 1)}` :
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
            lineColor: '#2962FF',
            topColor: '#2962FF',
            bottomColor: 'rgba(41, 98, 255, 0.28)',
            priceFormat: isTLCCChart ? {
                type: 'custom',
                minMove: 0.0001,
                formatter: (price) => price.toFixed(4),
            } : {
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
        };

        const areaSeries = chart.addAreaSeries(seriesOptions);

        if (isTLCCChart) {
            const indexedData = graphData.map((item, index) => ({
                time: index,
                value: item.value
            }));
            areaSeries.setData(indexedData);
        } else {
            areaSeries.setData(graphData);
        }

        if (buySellDates && buySellDates.length > 0 && !isTLCCChart) {
            const markers = buySellDates
                .map(signal => ({
                    time: signal.date.split(' ')[0],
                    position: 'aboveBar',
                    color: signal.action === 'BUY' ? '#FF4444' : '#4444FF',
                    shape: 'arrowDown',
                    text: signal.action
                }))
                .sort((a, b) => {
                    const timeA = new Date(a.time).getTime();
                    const timeB = new Date(b.time).getTime();
                    return timeA - timeB;
                });
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
                    const timeStr = isTLCCChart ?
                        `Index: ${param.time + 1}` :
                        new Date(param.time * 1000).toLocaleDateString();

                    if (data) {
                        const price = data.value !== undefined ? data.value : data.close;
                        toolTip.style.display = 'block';
                        toolTip.innerHTML = `
                            <div style="font-weight: bold; margin-bottom: 4px">${timeStr}</div>
                            <div>Value: ${price.toLocaleString(undefined, {
        minimumFractionDigits: isTLCCChart ? 4 : 2,
        maximumFractionDigits: isTLCCChart ? 4 : 2
    })}</div>
                        `;

                        toolTip.style.left = param.point.x + 530 + 'px';
                        toolTip.style.top = param.point.y + 50 + 'px';
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
            // if (chartContainerRef.current && toolTip) {
            //     chartContainerRef.current.removeChild(toolTip);
            // }
            chart.unsubscribeCrosshairMove();
            timeScale?.unsubscribeAll();
            chart.remove();
        };
    }, [graphData, height, timeScale, buySellDates, showTooltip, chartId]);

    return (
        <div ref={chartContainerRef} style={{ height: `${height}px` }} className="w-full" id={chartId} />
    );
};

class TimeScaleSync {
    constructor() {
        this.subscribers = new Set();
        this.currentTimeScale = {};
    }

    subscribe(event, callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    unsubscribeAll() {
        this.subscribers.clear();
    }

    setTimeScale(timeScale) {
        this.currentTimeScale = timeScale;
        this.notify(timeScale);
    }

    notify(params) {
        this.subscribers.forEach(callback => callback(params));
    }

    crosshairMoved = {
        emit: (param) => {
            this.subscribers.forEach(callback => callback(param));
        }
    };
}

const MainChart = ({ ethPriceData, graphWithdrawData, tlccWithdrawData, graphDepositData, tlccDepositData, buySellDates }) => {
    const syncedTimeScale = useRef(new TimeScaleSync());

    useEffect(() => {console.log(buySellDates);}, [buySellDates]);

    return (
        <div className="w-full h-full">
            <h1 className={'mb-2'}>Ethereum Price (ETH)</h1>
            <ChartComponent
                graphData={ethPriceData}
                chartId="ethPrice"
                height={231}
                timeScale={syncedTimeScale.current}
                buySellDates={buySellDates}
                showTooltip={true}
            />
            <h1 className={'mb-2 mt-2'}>Withdrawal Frequency</h1>
            <ChartComponent
                graphData={graphWithdrawData}
                chartId="graphWithdraw"
                height={77}
                timeScale={syncedTimeScale.current}
            />
            <h1 className={'mb-2 mt-2'}>Withdrawal Frequency TLCC</h1>
            <ChartComponent
                graphData={tlccWithdrawData}
                chartId="tlccWithdraw"
                height={77}
                timeScale={null}
            />
            <h1 className={'mb-2 mt-2'}>Deposit Frequency</h1>
            <ChartComponent
                graphData={graphDepositData}
                chartId="graphDeposit"
                height={77}
                timeScale={syncedTimeScale.current}
            />
            <h1 className={'mb-2 mt-2'}>Deposit Frequency TLCC</h1>
            <ChartComponent
                graphData={tlccDepositData}
                chartId="tlccDeposit"
                height={77}
                timeScale={null}
            />
        </div>
    );
};

export default MainChart;