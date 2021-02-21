import { DataService, } from '../DataService';

export class BankService extends DataService {
    constructor() {
        super('list', 'create', 'read', 'update', 'delete');
    }

    url(...path) {
        return super.url('/api/v1/bank', ...path);
    }

    async list({ filter, order, skip, take }) {
        const url = this.url();
        Object.keys(filter).length && url.searchParams.set('filter', this.encode(filter));
        order.length && url.searchParams.set('order', this.encode(order));
        skip>0 && url.searchParams.set('skip', skip);
        take>0 && url.searchParams.set('take', take);
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
        // https://stackoverflow.com/questions/29775797/fetch-post-json-data
        const resource = await fetch(url, {
            method: 'GET',
            headers: this.headers(),
        });
        const json = await resource.json();
        await this.emit('list', json);
        return json;
    }

    async create({ ...params }) {
        const url = this.url();
        const resource = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ ...params }),
            headers: this.headers(),
        });
        const json = await resource.json();
        await this.emit('create', json);
        return json;
    }

    async read({ id }) {
        const url = this.url(id);
        const resource = await fetch(url, {
            method: 'GET',
            headers: this.headers(),
        });
        const json = await resource.json();
        await this.emit('read', json);
        return json;
    }

    async update({ id, ...params }) {
        const url = this.url(id);
        const resource = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({ ...params }),
            headers: this.headers(),
        });
        const json = await resource.json();
        await this.emit('update', json);
        return json;
    }

    async delete({ id, ...params }) {
        const url = this.url(id);
        const resource = await fetch(url, {
            method: 'DELETE',
            body: JSON.stringify({ ...params }),
            headers: this.headers(),
        });
        const json = await resource.json();
        await this.emit('delete', json);
        return json;
    }
};