const API_URL = "http://15.165.89.61/api";

async function fetchPost(url, body, loadingCb) {
    try {
        if (loadingCb) loadingCb(true);

        const response = await fetch(API_URL + url, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        if (loadingCb) loadingCb(false);
    }
}

async function fetchGet(url, loadingCb) {
    try {
        if (loadingCb) loadingCb(true);

        const response = await fetch(API_URL + url, {
            method: 'GET',
            // credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        if (loadingCb) loadingCb(false);
    }
}

function dataConverter(obj, setter) {
    const { timestamps, values, lags } = obj;

    if (timestamps && values) {
        const transformedData = timestamps.map((timestamp, index) => ({
            time: timestamp,
            value: values[index]
        }));
        setter(transformedData);
    }

    if (lags && values) {
        const transformedData = lags.map((lag, index) => ({
            time: lag,
            value: values[index]
        }));
        setter(transformedData);
    }
}

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

export {
    fetchPost,
    fetchGet,
    dataConverter,
    TimeScaleSync
};