const API_URL = "https://15.165.89.61/api";

async function fetchPost(url, body, setter) {
    try {
        const response = await fetch(API_URL + url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (setter) setter(data);

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function fetchGet(url, setter) {
    try {
        const response = await fetch(API_URL + url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (setter) setter(data);

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
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

export {
    fetchPost,
    fetchGet,
    dataConverter,
};