import './App.css';
import MainChart from "../components/MainChart";
import Box from "../components/box/Box";
import Header from "../components/header/Header";
import Inquiry from "../components/inquiry/Inquiry";
import Tendency from "../components/tendency/Tendency";
import { useEffect, useState } from "react";
import { dataConverter, fetchGet } from "../common";
import LoadingSpinner from "../components/loadingspinner/LoadingSpinner";
import TlccChart from "../components/TlccChart";


function App() {
    const [ethPriceData, setEth] = useState([]);
    const [ethPriceDataComp, setEthComp] = useState([]);
    const [graphWithdrawData, setGWD] = useState([]);
    const [tlccWithdrawData, setTWD] = useState([]);
    const [graphDepositData, setGD] = useState([]);
    const [tlccDepositData, setTD] = useState([]);
    const [strat, setStrat] = useState({});

    const [dateRange, setDateRange] = useState(['2020-11-08', '2024-11-08']);
    const [fixedDateRange, setFixedDateRange] = useState(['2020-11-08', '2024-11-08']);

    const [buySellDates, setBuySellDates] = useState([]);
    const [buySellDatesComp, setBuySellDatesComp] = useState([]);

    const [assetValue, setAssetValue] = useState('10,000');

    const [isLoading, setIsLoading] = useState(false);

    const [selectedId, setSelectedId] = useState('balanced rank 1');
    const [selectedIdComp, setSelectedIdComp] = useState('balanced rank 2');
    const [fixedSelectedId, setFixedSelectedId] = useState(selectedId);
    const [fixedSelectedIdComp, setFixedSelectedIdComp] = useState(selectedIdComp);


    useEffect(() => {
        (async () => {
            const res = await fetchGet('/init/', setIsLoading);
            if (res?.top[0]?.graph_data?.eth_prices) dataConverter(res.top[0].graph_data.eth_prices, setEth);
            if (res?.top.at(0)?.graph_data?.eth_prices) dataConverter(res.top[0].graph_data.eth_prices, setEthComp);
            if (res?.top[0]?.graph_data?.withdrawal_freq) dataConverter(res.top[0].graph_data.withdrawal_freq, setGWD);
            if (res?.top[0]?.tlcc_graph_data?.withdrawal_freq) dataConverter(res.top[0].tlcc_graph_data.withdrawal_freq, setTWD);
            if (res?.top[0]?.graph_data?.deposit_freq) dataConverter(res.top[0].graph_data.deposit_freq, setGD);
            if (res?.top[0]?.tlcc_graph_data?.deposit_freq) dataConverter(res.top[0].tlcc_graph_data.deposit_freq, setTD);

            if (res?.strategies?.length) {
                setStrat({
                    strategies: res?.strategies
                });
                setBuySellDates(res?.strategies?.at(0)?.results?.at(0)?.buy_sell_dates || []);
                setBuySellDatesComp(res?.strategies?.at(0)?.results?.at(1)?.buy_sell_dates || []);
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
                <nav className={'w-[30%] flex flex-col gap-2'} style={{ height: 'calc(100vh - 150px)' }}>
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
                            setEthComp={setEthComp}
                            setGWD={setGWD}
                            setTWD={setTWD}
                            setGD={setGD}
                            setTD={setTD}
                            setBuySellDates={setBuySellDates}
                            setBuySellDatesComp={setBuySellDatesComp}
                            assetValue={assetValue}
                            setIsLoading={setIsLoading}
                            selectedId={selectedId}
                            selectedIdComp={selectedIdComp}
                            setSelectedId={setSelectedId}
                            setSelectedIdComp={setSelectedIdComp}
                            setFixedSelectedId={setFixedSelectedId}
                            setFixedSelectedIdComp={setFixedSelectedIdComp}
                        />
                    </Box>
                </nav>

                {/*CHART (middle) area*/}
                <Box className={'w-[40%] p-8'}>
                    <MainChart
                        ethPriceData={ethPriceData}
                        ethPriceDataComp={ethPriceDataComp}
                        selectedId={selectedId}
                        selectedIdComp={selectedIdComp}
                        graphWithdrawData={graphWithdrawData}
                        graphDepositData={graphDepositData}
                        buySellDates={buySellDates}
                        buySellDatesComp={buySellDatesComp}
                        fixedSelectedId={fixedSelectedId}
                        fixedSelectedIdComp={fixedSelectedIdComp}
                    />
                </Box>

                {/*CHART (right) area*/}
                <Box className={'w-[30%] p-8'}>
                    <TlccChart
                        tlccWithdrawData={tlccWithdrawData}
                        tlccDepositData={tlccDepositData}
                    />
                </Box>
            </div>
        </div>
    );
}

export default App;
