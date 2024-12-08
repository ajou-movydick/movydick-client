import Calendar from "react-calendar";
import './Calendar_custom.css';
// import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { fetchPost } from "../../common";


const STRAT_DUMMY = {
    "strategies": [
        {
            "strategy": "defensive",
            "results": [
                {
                    "rank": 1,
                    "portfolio_value": 15820.501274211096,
                    "combination": [
                        "deposit_freq",
                        "withdrawal_freq"
                    ],
                    "lags": {
                        "deposit_freq": 24,
                        "withdrawal_freq": 29
                    },
                    "thresholds": {
                        "deposit_freq": 0.5,
                        "withdrawal_freq": 0.5
                    },
                    "loss_preservation_ratio": 4.273243808493867,
                    "buy_sell_dates": [
                        {
                            "date": "2024-01-31 00:00:00",
                            "action": "BUY"
                        },
                        {
                            "date": "2024-10-30 00:00:00",
                            "action": "BUY"
                        }
                    ]
                },
                {
                    "rank": 2,
                    "portfolio_value": 11384.446523702842,
                    "combination": [
                        "deposit_freq",
                        "withdrawal_freq"
                    ],
                    "lags": {
                        "deposit_freq": 24,
                        "withdrawal_freq": 29
                    },
                    "thresholds": {
                        "deposit_freq": 2.0,
                        "withdrawal_freq": 0.5
                    },
                    "loss_preservation_ratio": 1.0164206237384399,
                    "buy_sell_dates": [
                        {
                            "date": "2024-01-31 00:00:00",
                            "action": "BUY"
                        },
                        {
                            "date": "2024-08-05 00:00:00",
                            "action": "SELL"
                        },
                        {
                            "date": "2024-08-07 00:00:00",
                            "action": "BUY"
                        }
                    ]
                },
                {
                    "rank": 3,
                    "portfolio_value": 11004.760569291697,
                    "combination": [
                        "deposit_freq",
                        "withdrawal_freq"
                    ],
                    "lags": {
                        "deposit_freq": 24,
                        "withdrawal_freq": 29
                    },
                    "thresholds": {
                        "deposit_freq": 3.0,
                        "withdrawal_freq": 0.5
                    },
                    "loss_preservation_ratio": 0.737666169882673,
                    "buy_sell_dates": [
                        {
                            "date": "2024-01-31 00:00:00",
                            "action": "BUY"
                        }
                    ]
                }
            ]
        },
        {
            "strategy": "aggressive",
            "results": [
                {
                    "rank": 1,
                    "portfolio_value": 15820.501274211096,
                    "combination": [
                        "deposit_freq",
                        "withdrawal_freq"
                    ],
                    "lags": {
                        "deposit_freq": 24,
                        "withdrawal_freq": 29
                    },
                    "thresholds": {
                        "deposit_freq": 0.5,
                        "withdrawal_freq": 0.5
                    },
                    "loss_preservation_ratio": 4.273243808493867,
                    "buy_sell_dates": [
                        {
                            "date": "2024-01-31 00:00:00",
                            "action": "BUY"
                        },
                        {
                            "date": "2024-10-30 00:00:00",
                            "action": "BUY"
                        }
                    ]
                },
                {
                    "rank": 2,
                    "portfolio_value": 11384.446523702842,
                    "combination": [
                        "deposit_freq",
                        "withdrawal_freq"
                    ],
                    "lags": {
                        "deposit_freq": 24,
                        "withdrawal_freq": 29
                    },
                    "thresholds": {
                        "deposit_freq": 2.0,
                        "withdrawal_freq": 0.5
                    },
                    "loss_preservation_ratio": 1.0164206237384399,
                    "buy_sell_dates": [
                        {
                            "date": "2024-01-31 00:00:00",
                            "action": "BUY"
                        },
                        {
                            "date": "2024-08-05 00:00:00",
                            "action": "SELL"
                        },
                        {
                            "date": "2024-08-07 00:00:00",
                            "action": "BUY"
                        }
                    ]
                },
                {
                    "rank": 3,
                    "portfolio_value": 11004.760569291697,
                    "combination": [
                        "deposit_freq",
                        "withdrawal_freq"
                    ],
                    "lags": {
                        "deposit_freq": 24,
                        "withdrawal_freq": 29
                    },
                    "thresholds": {
                        "deposit_freq": 3.0,
                        "withdrawal_freq": 0.5
                    },
                    "loss_preservation_ratio": 0.737666169882673,
                    "buy_sell_dates": [
                        {
                            "date": "2024-01-31 00:00:00",
                            "action": "BUY"
                        }
                    ]
                }
            ]
        },
        {
            "strategy": "balanced",
            "results": [
                {
                    "rank": 1,
                    "portfolio_value": 11004.760569291697,
                    "combination": [
                        "deposit_freq",
                        "withdrawal_freq"
                    ],
                    "lags": {
                        "deposit_freq": 24,
                        "withdrawal_freq": 29
                    },
                    "thresholds": {
                        "deposit_freq": 3.0,
                        "withdrawal_freq": 0.5
                    },
                    "loss_preservation_ratio": 0.737666169882673,
                    "buy_sell_dates": [
                        {
                            "date": "2024-01-31 00:00:00",
                            "action": "BUY"
                        }
                    ]
                },
                {
                    "rank": 2,
                    "portfolio_value": 11004.760569291697,
                    "combination": [
                        "deposit_freq",
                        "withdrawal_freq"
                    ],
                    "lags": {
                        "deposit_freq": 24,
                        "withdrawal_freq": 29
                    },
                    "thresholds": {
                        "deposit_freq": 4.0,
                        "withdrawal_freq": 0.5
                    },
                    "loss_preservation_ratio": 0.737666169882673,
                    "buy_sell_dates": [
                        {
                            "date": "2024-01-31 00:00:00",
                            "action": "BUY"
                        }
                    ]
                },
                {
                    "rank": 3,
                    "portfolio_value": 10814.866154353565,
                    "combination": [
                        "deposit_freq",
                        "withdrawal_freq"
                    ],
                    "lags": {
                        "deposit_freq": 24,
                        "withdrawal_freq": 29
                    },
                    "thresholds": {
                        "deposit_freq": 1.0,
                        "withdrawal_freq": 0.5
                    },
                    "loss_preservation_ratio": 0.5982511788582238,
                    "buy_sell_dates": [
                        {
                            "date": "2024-01-31 00:00:00",
                            "action": "BUY"
                        },
                        {
                            "date": "2024-08-07 00:00:00",
                            "action": "BUY"
                        }
                    ]
                }
            ]
        }
    ]
};

const Inquiry = ({ dateRange, setDateRange, setFixedDateRange, setStrat, assetValue, setAssetValue }) => {
    const [calVis, setCalVis] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(['deposit_freq', 'withdrawal_freq']);

    const handleAssetChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        const numericValue = parseInt(value) || 0;
        const formattedValue = `${numericValue.toLocaleString()}`;
        setAssetValue(formattedValue);
    };

    const mandatoryMappings = {
        'Deposit frequency': 'deposit_freq',
        'Withdrawal frequency': 'withdrawal_freq',
    };

    const optionMappings = {
        'Search volume': 'search_freq',
        'Developer activity': 'daily_commits',
        'Netflow': 'netflow_eth'
    };

    const handleCheckboxChange = (option) => {
        setSelectedOptions(prev => {
            const value = optionMappings[option];
            return prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value];
        });
    };

    const handleCalendarClick = () => setCalVis(!calVis);

    const handleDateChange = (value, setter) => {
        const formattedDates = value.map(date =>
            date ? date.toISOString().split('T')[0] : null
        );
        setDateRange(formattedDates);
        if (formattedDates[1]) setCalVis(false);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return date;
    };

    const isButtonEnabled = () => {
        const isDateValid = dateRange[0] && dateRange[1];
        const isOptionsSelected = selectedOptions.length > 0;
        const isAssetValid = parseInt(assetValue.replace(/,/g, '')) > 0;
        return isDateValid && isOptionsSelected && isAssetValid;
    };

    const handleClickAdapt = () => {
        (async () => {
            const res = await fetchPost('/strategies/', {
                start_date: dateRange[0],
                end_date: dateRange[1],
                combination: selectedOptions,
                asset: parseInt(assetValue.replace('$', '').replace(',', ''))
            });
            // const res = STRAT_DUMMY;
            setStrat(res);
            setFixedDateRange(dateRange);
        })();
    };

    return (
        <div>
            <div className={'mb-4'}>
                <p className={'mb-1 font-bold'}>Date</p>
                <div className={'flex items-center w-full'}>
                    <input
                        className={'w-full mr-6'}
                        type={'text'}
                        disabled={true}
                        value={dateRange[0] ? `${formatDate(dateRange[0])} ~ ${formatDate(dateRange[1] || dateRange[0])}` : ''}
                    />
                    <img
                        src={'/icons/calendar.svg'}
                        alt={'calendar'}
                        onClick={handleCalendarClick}
                        className={'border-[1px] border-[#b3b3b3] hover:border-[#00A2B8] rounded-lg p-1 cursor-pointer transition-colors duration-300'}
                    />
                    {
                        <CSSTransition
                            in={calVis}
                            timeout={200}
                            classNames="calendar"
                            unmountOnExit
                        >
                            <Calendar
                                className={'absolute top-[235px] left-[286px] w-72 bg-[#242424] z-10'}
                                selectRange={true}
                                value={dateRange}
                                onChange={(v) => handleDateChange(v, setDateRange)}
                            />
                        </CSSTransition>
                    }
                </div>
            </div>
            <div className={'flex gap-6 mb-5'}>
                <div className={'w-1/2 flex flex-col'}>
                    <div>
                        <p className={'mb-1 font-bold'}>Asset</p>
                        <input
                            className={'w-full mb-1'}
                            type={'text'}
                            value={`$ ${assetValue}`}
                            onChange={handleAssetChange}
                        />
                    </div>
                    <div className={'flex-grow'}>
                        <p className={'mb-1 font-bold'}>Fixed Value</p>
                        <div
                            className={'flex w-full flex-col border-[#B3B3B3] border-[1px] rounded-lg px-3 py-4 gap-2 justify-around'}>
                            {Object.keys(mandatoryMappings).map((e) => (
                                <label key={e}>
                                    <input
                                        type={'checkbox'}
                                        className={'mr-2'}
                                        checked={selectedOptions.includes(mandatoryMappings[e])}
                                        readOnly={true}
                                    />
                                    <span>{e}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={'w-1/2'}>
                    <p className={'mb-1 font-bold'}>Option</p>
                    <div
                        className={'flex w-full h-[calc(100%-28px)] flex-col border-[#B3B3B3] border-[1px] rounded-lg px-3 py-4 justify-around'}>
                        {Object.keys(optionMappings).map((option) => (
                            <label key={option}>
                                <input
                                    type={'checkbox'}
                                    className={'mr-2'}
                                    checked={selectedOptions.includes(optionMappings[option])}
                                    onChange={() => handleCheckboxChange(option)}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <button
                className={`w-full h-11 text-white flex items-center justify-center rounded-lg text-xl transition-colors duration-300 ${
                    isButtonEnabled()
                        ? 'bg-[#014852] hover:bg-[#00A2B8] cursor-pointer'
                        : 'bg-gray-500 cursor-not-allowed'
                }`}
                disabled={!isButtonEnabled()}
                onClick={handleClickAdapt}
            >
                ADAPT
            </button>
        </div>
    );
};

export default Inquiry;