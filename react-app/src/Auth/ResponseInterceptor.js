import axios from "axios";

let installedResponseInterceptor = null;
let isRefreshing = false;
let pendingRequestsQueue = [];

export function addResponseInterceptor(refresh) {
    if (installedResponseInterceptor !== null)
        removeResponseInterceptor();

    installedResponseInterceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => errorResponseInterceptor(error, refresh)
    );
}

export function removeResponseInterceptor() {
    axios.interceptors.response.eject(installedResponseInterceptor);
    installedResponseInterceptor = null;
}

async function errorResponseInterceptor(error, refresh) {
    const origRequest = error.config;
    const origResponse = error.response;

    if (origResponse.status === 401 && origResponse.data.error === "Token has expired" && !origRequest._retry) {
        if (isRefreshing) {
            // already refreshing, queue request
            pendingRequestsQueue.push(origRequest);
            return null;
        }

        isRefreshing = true;

        const access_token = await refresh();

        origRequest._retry = true;
        origRequest.headers["Authorization"] = `Bearer ${access_token}`;

        // resend original request
        const response = await axios(origRequest);

        // resend all pending requests
        isRefreshing = false;
        await resendPendingRequests(access_token);

        return response;
    }

    throw error;
}

async function resendPendingRequests(access_token) {
    if (pendingRequestsQueue.length > 0) {
        // prepare requests
        const requests = pendingRequestsQueue.map((config) => {
            config._retry = true;
            config.headers["Authorization"] = `Bearer ${access_token}`;
            return axios(config);
        });

        try {
            // clear queue and resend all pending requests with new access token
            pendingRequestsQueue = [];
            return await axios.all(requests);
        } catch (e) {
            return e;
        }
    }
}
