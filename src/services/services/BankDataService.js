import { DataService, } from '../DataService';

export class BankService extends DataService {
    constructor() {
        super('list', 'create', 'read', 'update', 'delete');
    }

    async list({ filter, order, skip, take }) {
        const encode = (value) => btoa(JSON.stringify(value));
        const url = this.url('/api/v1/bank');
        Object.keys(filter).length && url.searchParams.set('filter', encode(filter));
        order.length && url.searchParams.set('order', encode(order));
        skip>0 && url.searchParams.set('skip', skip);
        take>0 && url.searchParams.set('take', take);
        const resource = await fetch(url);
        const data = await resource.json();
        await this.emit('list', data);
        return data;
    }
};