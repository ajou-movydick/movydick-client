import { useEffect, useState } from "react";
import { dataConverter, fetchGet, fetchPost } from "../../common";

const TOP_DUMMY = {
    "start_date": "2023-01-01",
    "end_date": "2023-03-02",
    "combination": [
        "withdrawal_freq",
        "deposit_freq"
    ],
    "optimal_lags": {
        "withdrawal_freq": 13,
        "deposit_freq": 6
    },
    "graph_data": {
        "withdrawal_freq": {
            "timestamps": [
                1672531200,
                1672617600,
                1672704000,
                1672790400,
                1672876800,
                1672963200,
                1673049600,
                1673136000,
                1673222400,
                1673308800,
                1673395200,
                1673481600,
                1673568000,
                1673654400,
                1673740800,
                1673827200,
                1673913600,
                1674000000,
                1674086400,
                1674172800,
                1674259200,
                1674345600,
                1674432000,
                1674518400,
                1674604800,
                1674691200,
                1674777600,
                1674864000,
                1674950400,
                1675036800,
                1675123200,
                1675209600,
                1675296000,
                1675382400,
                1675468800,
                1675555200,
                1675641600,
                1675728000,
                1675814400,
                1675900800,
                1675987200,
                1676073600,
                1676160000,
                1676246400,
                1676332800,
                1676419200,
                1676505600,
                1676592000,
                1676678400,
                1676764800,
                1676851200,
                1676937600,
                1677024000,
                1677110400,
                1677196800,
                1677283200,
                1677369600,
                1677456000,
                1677542400,
                1677628800,
                1677715200
            ],
            "values": [
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                4.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.0
            ]
        },
        "deposit_freq": {
            "timestamps": [
                1672531200,
                1672617600,
                1672704000,


                1677542400,
                1677628800,
                1677715200
            ],
            "values": [
                0.0,
                0.0,
                0.0,

                0.0,
                0.0,
                0.0,
                0.0
            ]
        },
        "eth_prices": {
            "timestamps": [
                1672531200,
                1672617600,
                1672704000,
                1672790400,
                1672876800,
                1672963200,
                1673049600,
                1673136000,
                1673222400,
                1673308800,
                1673395200,
                1673481600,
                1673568000,
                1673654400,
                1673740800,
                1673827200,
                1673913600,
                1674000000,
                1674086400,
                1674172800,
                1674259200,
                1674345600,
                1674432000,
                1674518400,
                1674604800,
                1674691200,
                1674777600,
                1674864000,
                1674950400,
                1675036800,
                1675123200,
                1675209600,
                1675296000,
                1675382400,
                1675468800,
                1675555200,
                1675641600,

                1677628800,
                1677715200
            ],
            "values": [
                1200.96484375,
                1214.6566162109375,
                1214.77880859375,
                1256.526611328125,
                1250.4385986328125,

                1640.817138671875,
                1634.326416015625,
                1605.8951416015625,
                1663.4337158203125,
                1647.3193359375
            ]
        }
    },
    "tlcc_graph_data": {
        "withdrawal_freq": {
            "lags": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30
            ],
            "values": [
                0.027062905744517512,
                0.026246140503733504,

                0.014948469417054067,
                0.013538935079435425,
                0.015664898679530404,
                0.010798163109586353,
                0.008490844194866145,
                0.004088188123558899,
                0.00226501207170869
            ]
        },
        "deposit_freq": {
            "lags": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30
            ],
            "values": [
                0.1395170994069747,
                0.13837723380517167,
                0.14017503755124452,
                0.14181226380049416,
                0.14537145674925417,
                0.1486572570510085,
                0.1464479272469595,
                0.14152657356985554,
                0.13972079571189602,
                0.1347339668951118,
                0.13483805674430385,
                0.13453737151103332,
                0.12971201613085476,
                0.12628211063633388,
                0.12551184380112954,
                0.12647307093110077,
                0.12912455590573588,
                0.12738119490322572,
                0.12610787305629742,
                0.12962841923438626,
                0.12900418071681719,
                0.1283907623862842,
                0.1254000619395406,
                0.12608605756410723,
                0.12606559455518238,
                0.12568212363186657,
                0.12839491527812033,
                0.12631320646587801,
                0.13054135868129935,
                0.1301235808579683
            ]
        }
    },
    "buy_sell_dates": [
        {
            "date": "",
            "action": "BUY"
        },
        {
            "date": "",
            "action": "SELL"
        }
    ]
};

const Tendency = ({ fixedDateRange, strat, setEth, setGWD, setTWD, setGD, setTD, setBuySellDates, assetValue, setIsLoading }) => {
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

    const handleClickTop = (comb, buy, sell) => {
        (async () => {
            const res = await fetchPost('/top/', {
                start_date: fixedDateRange[0],
                end_date: fixedDateRange[1],
                combination: comb,
                buy_signal: buy,
                sell_signal: sell,
            }, setIsLoading);
            if (res?.graph_data?.eth_prices) dataConverter(res.graph_data.eth_prices, setEth);
            if (res?.graph_data?.withdrawal_freq) dataConverter(res.graph_data.withdrawal_freq, setGWD);
            if (res?.tlcc_graph_data?.withdrawal_freq) dataConverter(res.tlcc_graph_data.withdrawal_freq, setTWD);
            if (res?.graph_data?.deposit_freq) dataConverter(res.graph_data.deposit_freq, setGD);
            if (res?.tlcc_graph_data?.deposit_freq) dataConverter(res.tlcc_graph_data.deposit_freq, setTD);
            if (res?.buy_sell_dates) setBuySellDates(res.buy_sell_dates);
        })();
    };

    function extractBuySell(fullset) {
        const result = {
            BUY: [],
            SELL: []
        };

        fullset.forEach(item => {
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

    return (
        <div className={'w-full h-full'}>
            <div className={'w-full flex flex-row gap-2 mb-5'}>
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
            <div className={'overflow-y-auto'} style={{ height: 'calc(100% - 54px)' }}>
                {
                    res.strategies?.length > 0 &&
                    res.strategies.map((e, i) =>
                        e.strategy === selected &&
                        e.results.map((e2, i2) => (
                            <div key={i2}>
                                <div
                                    className={'bg-[#393939] hover:bg-[#575757] transition-colors duration-300 px-4 py-3 rounded-lg cursor-pointer'}
                                    onClick={() => handleClickTop(e2.combination, extractBuySell(e2.buy_sell_dates)['BUY'], extractBuySell(e2.buy_sell_dates)['SELL'])}
                                >
                                    <div className={'flex items-center justify-between'}>
                                        <h2 className={'mb-1 font-bold'}>Rank{e2.rank}</h2>
                                        <img src={'/icons/triangle.svg'} alt={'triangle'} />
                                    </div>
                                    <div className={'flex flex-row justify-between mb-1'}>
                                        <span className={'text-[#6B6B6B]'}>Date</span>
                                        <span>{formatDateRange(fixedDateRange)}</span>
                                    </div>
                                    <div className={'flex flex-row justify-between mb-1'}>
                                        <span className={'text-[#6B6B6B]'}>Strategy</span>
                                        <span>{selected}</span>
                                    </div>
                                    <div className={'flex flex-row justify-between mb-1'}>
                                        <span className={'text-[#6B6B6B]'}>Portfolio Value</span>
                                        <span>{formatPortfV(e2.portfolio_value)}</span>
                                    </div>
                                    <div className={'flex flex-row justify-between mb-1'}>
                                        <span className={'text-[#6B6B6B]'}>Loss Preservation Ratio</span>
                                        <span>{e2.loss_preservation_ratio.toFixed(4)}</span>
                                    </div>
                                    <div className={'flex flex-row justify-between mb-1'}>
                                        <span className={'text-[#6B6B6B]'}>Option</span>
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
                                </div>
                                <hr className={'my-4 bg-[#939393] border-0 h-[1px]'}/>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
};

export default Tendency;