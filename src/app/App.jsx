import './App.css';
import MainChart from "../components/MainChart";
import Box from "../components/box/Box";
import Header from "../components/header/Header";
import Inquiry from "../components/inquiry/Inquiry";
import Tendency from "../components/tendency/Tendency";
import { useEffect, useState } from "react";
import { dataConverter, fetchGet } from "../common";
import LoadingSpinner from "../components/loadingspinner/LoadingSpinner";


function App() {
    const [ethPriceData, setEth] = useState([]);
    const [graphWithdrawData, setGWD] = useState([]);
    const [tlccWithdrawData, setTWD] = useState([]);
    const [graphDepositData, setGD] = useState([]);
    const [tlccDepositData, setTD] = useState([]);
    const [strat, setStrat] = useState({});

    const [dateRange, setDateRange] = useState(['2020-11-08', '2024-11-08']);
    const [fixedDateRange, setFixedDateRange] = useState(['2020-11-08', '2024-11-08']);

    const [buySellDates, setBuySellDates] = useState([]);

    const [assetValue, setAssetValue] = useState('10,000');

    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        (async () => {
            const res = await fetchGet('/init/', setIsLoading);
            if (res?.top[0]?.graph_data?.eth_prices) dataConverter(res.top[0].graph_data.eth_prices, setEth);
            if (res?.top[0]?.graph_data?.withdrawal_freq) dataConverter(res.top[0].graph_data.withdrawal_freq, setGWD);
            if (res?.top[0]?.tlcc_graph_data?.withdrawal_freq) dataConverter(res.top[0].tlcc_graph_data.withdrawal_freq, setTWD);
            if (res?.top[0]?.graph_data?.deposit_freq) dataConverter(res.top[0].graph_data.deposit_freq, setGD);
            if (res?.top[0]?.tlcc_graph_data?.deposit_freq) dataConverter(res.top[0].tlcc_graph_data.deposit_freq, setTD);

            if (res?.strategies?.length) {
                setStrat({
                    strategies: res?.strategies
                });
                setBuySellDates(res?.strategies?.at(2)?.results?.at(0)?.buy_sell_dates || []);
            }
        })();
    }, []);


    return (
        <div id="App">
            {/*HEADER area*/}
            <LoadingSpinner isLoading={isLoading} />

            <Header />

            <div className={'flex flex-row gap-2'}>
                {/*NAV (left) area*/}
                <nav className={'w-[35%] flex flex-col gap-2'} style={{ height: 'calc(100vh - 150px)' }}>
                    <Box className={'w-full px-6 py-9'}>
                        <Inquiry dateRange={dateRange}
                            setDateRange={setDateRange}
                            setFixedDateRange={setFixedDateRange}
                            setStrat={setStrat}
                            assetValue={assetValue}
                            setAssetValue={setAssetValue}
                            setIsLoading={setIsLoading}
                        />
                    </Box>
                    <Box className={'w-full px-6 py-9'} style={{ height: 'calc(100% - 400px)' }}>
                        <Tendency
                            fixedDateRange={fixedDateRange}
                            strat={strat}
                            setEth={setEth}
                            setGWD={setGWD}
                            setTWD={setTWD}
                            setGD={setGD}
                            setTD={setTD}
                            setBuySellDates={setBuySellDates}
                            assetValue={assetValue}
                            setIsLoading={setIsLoading}
                        />
                    </Box>
                </nav>

                {/*CHART (right) area*/}
                <Box className={'w-[65%] p-8'}>
                    <MainChart
                        ethPriceData={ethPriceData}
                        graphWithdrawData={graphWithdrawData}
                        tlccWithdrawData={tlccWithdrawData}
                        graphDepositData={graphDepositData}
                        tlccDepositData={tlccDepositData}
                        buySellDates={buySellDates}
                    />
                </Box>
            </div>
        </div>
    );
}

export default App;
