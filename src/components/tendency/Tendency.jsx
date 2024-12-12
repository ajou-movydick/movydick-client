import { useEffect, useState } from "react";
import { dataConverter, fetchGet, fetchPost } from "../../common";

const Tendency = ({
    fixedDateRange,
    strat,
    setEth, setEthComp, setGWD, setTWD, setGD, setTD, setBuySellDates,
    assetValue,
    setIsLoading,
    selectedId, selectedIdComp, setSelectedIdComp, setSelectedId,
    setFixedSelectedId,
    setFixedSelectedIdComp,
    setBuySellDatesComp
}) => {
    const TENDENCIES = Object.freeze({
        BASIC: {
            text: 'Balanced',
            opt: 'balanced'
        },
        OFFENSIVE: {
            text: 'Aggressive',
            opt: 'aggressive',
        },
        DEFENSIVE: {
            text: 'Defensive',
            opt: 'defensive'
        }
    });

    const [selected, setSelected] = useState(TENDENCIES.BASIC.opt);
    const [res, setRes] = useState({});

    const formatDateRange = (dates) => {
        const firstDate = dates[0].substring(0, 10);
        const lastDate = dates[dates.length - 1].substring(0, 10);
        return `${firstDate} ~ ${lastDate}`;
    };

    const handleClickTop = (comb, buy, sell, elementId) => {
        if (selectedId && selectedIdComp) {
            return;
        }

        if (selectedId) {
            setSelectedIdComp(elementId);
            setFixedSelectedIdComp(elementId);
        } else {
            setSelectedId(elementId);
            setFixedSelectedId(elementId);
        }

        (async () => {
            const res = await fetchPost('/top/', {
                start_date: fixedDateRange[0],
                end_date: fixedDateRange[1],
                combination: comb,
                buy_signal: buy,
                sell_signal: sell,
            }, setIsLoading);
            if (res?.graph_data?.eth_prices) dataConverter(res.graph_data.eth_prices, setEth);
            if (res?.graph_data?.eth_prices) dataConverter(res.graph_data.eth_prices, setEthComp);
            if (res?.graph_data?.withdrawal_freq) dataConverter(res.graph_data.withdrawal_freq, setGWD);
            if (res?.tlcc_graph_data?.withdrawal_freq) dataConverter(res.tlcc_graph_data.withdrawal_freq, setTWD);
            if (res?.graph_data?.deposit_freq) dataConverter(res.graph_data.deposit_freq, setGD);
            if (res?.tlcc_graph_data?.deposit_freq) dataConverter(res.tlcc_graph_data.deposit_freq, setTD);
            if (selectedId && res?.buy_sell_dates) setBuySellDatesComp(res.buy_sell_dates);
            if (!selectedId && res?.buy_sell_dates) setBuySellDates(res.buy_sell_dates);
        })();
    };

    function extractBuySell(fullset) {
        const result = {
            BUY: [],
            SELL: []
        };

        fullset.forEach(item => {
            if (!item) return;
            const date = item.date.substring(0, 10);
            result[item.action].push(date);
        });

        return result;
    }

    function formatPortfV(v) {
        const aV = parseInt(assetValue?.replace('$', '')?.replace(',', ''));
        let int = v / 10000 * aV;
        int = int.toFixed(2);
        return int;
    }

    useEffect(() => {
        setRes(strat);
    }, [strat]);

    const getBackgroundColor = (elementId) => {
        if (elementId === selectedId || elementId === selectedIdComp) {
            return 'bg-[#A91CA8]';
        }
        return 'bg-[#393939]';
    };

    return (
        <div className={'w-full h-full'}>
            <div className={'w-full flex flex-row justify-between items-center mb-5'}>
                <div className={'min-w-[320px] flex flex-row gap-2'}>
                    {
                        Object.keys(TENDENCIES).map((e, i) => (
                            <button key={i}
                                onClick={() => {
                                    setSelected(TENDENCIES[e].opt);
                                }}
                                className={`${
                                    selected === TENDENCIES[e].opt ? 'bg-[#A91CA8]' : 'bg-[#393939]'
                                } hover:bg-[#A91CA8] transition-colors duration-300
                flex items-center justify-center w-full py-2 text-lg rounded-lg text-white h-9 box-border cursor-pointer font-bold`}
                            >
                                {TENDENCIES[e].text}
                            </button>
                        ))
                    }
                </div>
                <img
                    src={'/icons/trash.svg'}
                    alt={'trash'}
                    className={'border-[1px] w-[35px] h-[35px] text-red-900 border-[#b3b3b3] hover:border-[#00A2B8] rounded-lg p-1 cursor-pointer transition-colors duration-300'}
                    onClick={() => {
                        setSelectedId('');
                        setSelectedIdComp('');
                    }}
                />
            </div>
            <div className={'overflow-y-auto'} style={{ height: 'calc(100% - 54px)' }}>
                {
                    res.strategies?.length > 0 &&
                    res.strategies.map((e, i) =>
                        e.strategy === selected &&
                        e.results.map((e2, i2) => {
                            const elementId = `${selected} rank ${e2.rank}`;
                            return (
                                <div key={i2} id={elementId}>
                                    <div
                                        className={`${getBackgroundColor(elementId)} hover:bg-[#A91CA8] transition-colors duration-300 px-4 py-3 rounded-lg cursor-pointer`}
                                        onClick={() => handleClickTop(e2.combination, extractBuySell(e2.buy_sell_dates)['BUY'], extractBuySell(e2.buy_sell_dates)['SELL'], elementId)}
                                    >
                                        <div className={'flex items-center justify-between'}>
                                            <h2 className={'mb-1 font-bold'}>Rank {e2.rank}</h2>
                                            <img src={'/icons/triangle.svg'} alt={'triangle'}/>
                                        </div>
                                        <div className={'flex flex-row justify-between mb-1'}>
                                            <span className={'text-[#ababab]'}>Date</span>
                                            <span>{formatDateRange(fixedDateRange)}</span>
                                        </div>
                                        <div className={'flex flex-row justify-between mb-1'}>
                                            <span className={'text-[#ababab]'}>Strategy</span>
                                            <span>{selected}</span>
                                        </div>
                                        <div className={'flex flex-row justify-between mb-1'}>
                                            <span className={'text-[#ababab]'}>Portfolio Value</span>
                                            <span>{formatPortfV(e2.portfolio_value)}</span>
                                        </div>
                                        <div className={'flex flex-row justify-between mb-1'}>
                                            <span className={'text-[#ababab]'}>Loss Preservation Ratio</span>
                                            <span>{e2.loss_preservation_ratio.toFixed(4)}</span>
                                        </div>
                                        <div className={'flex flex-row justify-between mb-1'}>
                                            <span className={'text-[#ababab]'}>Option</span>
                                            <div className={'flex flex-row gap-1'}>
                                                {
                                                    e2.combination.map((e3, i3) => (
                                                        <div key={i3}
                                                            className={'text-white bg-[#6B6B6B] px-2 rounded-md text-s'}
                                                        >{e3.charAt(0).toUpperCase() + e3.slice(1).replace('_', ' ')}
                                                        </div>
                                                    ))
                                                }</div>
                                        </div>
                                        {e2.thresholds && Object.entries(e2.thresholds).map(([key, value], index) => (
                                            <div key={index} className={'flex flex-row justify-between mb-1'}>
                                                <span className={'text-[#ababab]'}>Optimal {key.replace('_', ' ')} threshold</span>
                                                <span>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <hr className={'my-4 bg-[#939393] border-0 h-[1px]'}/>
                                </div>
                            );
                        })
                    )
                }
            </div>
        </div>
    );
};

export default Tendency;