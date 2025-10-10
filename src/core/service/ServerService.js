import axios from "axios";
import APIUtil from "../system/APIUtil";

/**
 * Clase encargada de gestionar las peticiones al servidor.
 * 
 * @author wil
 */
class ServerService {
    constructor() { }

    authSend(url, method = 'GET', data = null) {
        const token = APIUtil.getAuthToken();
        return this.send(url, method, token, data);
    }


    send(url, method = 'GET', token = null, data = null, customHeaders = {}) {
        if (!process.env.VITE_WMS_NAME || !process.env.VITE_WMS_PORT) {
            throw new Error('WMS_NAME and WMS_PORT must be defined in the environment variables');
        }

        const uri = `${process.env.VITE_WMS_PROTOCOL}://${process.env.VITE_WMS_NAME}:${process.env.VITE_WMS_PORT}${url}`;
        const headers = ServerService.#createHeaders(token, customHeaders);

        return axios({
            method: method,
            url: uri,
            data: data,
            headers: headers
        });
    }

    static #createHeaders(token, customHeaders) {
        const headers = { ...customHeaders };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }
}

export default ServerService;