import axios from 'axios'
import { Order } from "../objects/objects"



axios.defaults.baseURL = "http://api.tomasrak.com";

const getOrders = (async () => {
    return await axios.get('/orders').then((resp: any) => {
        for (var order of resp.data) {
            order.date = new Date(order.date)
            // if (order.city.length > 18) order.city = `${order.city.substring(0,18)}...`
            // if (order.name.length > 18) order.name = `${order.name.substring(0,18)}...`
        }
        return resp.data
    });
})

const postOrder = (async (order: Order): Promise<boolean> => {
    order.date.setHours(12)
    order.date.setMinutes(0)
    order.description = order.description + "\n\nPočty dětí: \n" + order.classCounts.map((x) => `${x.class} = ${x.count} dětí`).join('\n')

    // return new Promise((resolve: any, reject: any) => {return setTimeout(resolve, 1000)})

    try {
        await axios.post('/orders', order);
        return true;
    }
    catch {
        return false;
    }
})

export { getOrders, postOrder }