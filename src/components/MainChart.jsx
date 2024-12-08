import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

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
            timeScale: chartId === 'tlccWithdraw' || chartId === 'tlccDeposit' ? {
                timeVisible: false,
                borderColor: '#333',
                tickMarkFormatter: (time) => {
                    return (time + 1).toString();
                },
            } : undefined,
        };

        const chart = createChart(chartContainerRef.current, chartOptions);
        const areaSeries = chart.addAreaSeries({
            lineColor: '#2962FF',
            topColor: '#2962FF',
            bottomColor: 'rgba(41, 98, 255, 0.28)'
        });

        if (chartId === 'tlccWithdraw' || chartId === 'tlccDeposit') {
            const indexedData = graphData.map((item, index) => ({
                ...item,
                time: index,
            }));
            areaSeries.setData(indexedData);
        } else {
            areaSeries.setData(graphData);
        }

        if (buySellDates && buySellDates.length > 0) {
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
                    const dateStr = new Date(param.time * 1000).toLocaleDateString();

                    if (data) {
                        const price = data.value !== undefined ? data.value : data.close;
                        toolTip.style.display = 'block';
                        toolTip.innerHTML = `
                            <div style="font-weight: bold; margin-bottom: 4px">${dateStr}</div>
                            <div>Value: $${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}</div>
                        `;

                        toolTip.style.left = param.point.x + 390 + 'px';
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
            <ChartComponent
                graphData={ethPriceData}
                chartId="ethPrice"
                height={428}
                timeScale={syncedTimeScale.current}
                buySellDates={buySellDates}
                showTooltip={true}
            />
            <ChartComponent
                graphData={graphWithdrawData}
                chartId="graphWithdraw"
                height={107}
                timeScale={syncedTimeScale.current}
            />
            <ChartComponent
                graphData={tlccWithdrawData}
                chartId="tlccWithdraw"
                height={107}
                timeScale={null}
            />
            <ChartComponent
                graphData={graphDepositData}
                chartId="graphDeposit"
                height={107}
                timeScale={syncedTimeScale.current}
            />
            <ChartComponent
                graphData={tlccDepositData}
                chartId="tlccDeposit"
                height={107}
                timeScale={null}
            />
        </div>
    );
};

export default MainChart;