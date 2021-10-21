import axios from 'axios'
import { Order } from "../objects/objects"



axios.defaults.baseURL = "http://api.tomasrak.com";

const getOrders = (async () => {
    return await axios.get('/orders').then(resp => {
        return resp.data
    });
})

const postOrder = ((order: Order): boolean => {
    try {
        axios.post('/orders', order);
        return true;
    }
    catch {
        return false;
    }
})

export { getOrders, postOrder }