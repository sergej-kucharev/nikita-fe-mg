import { useState, useEffect, } from 'react';

import { bankService, } from '../../services';

import { Button, } from '../../components/Button';
import { List, } from '../../components/List';
import { Modale, } from '../../components/Modale';
import { PopupBank, } from '../../components/PopupBank';


const renderCell = ({ unit, }) => ({ className, value, row, data, }) => {
    return (<span className={className}>{ `${ value }${ unit ? ` ${ unit }` : '' }` }</span>);
};

const renderTitle = ({ title, part, setPart, }) => () => {
    return title;
};

const listIndex = [
    'id',
    'name',
    'maximumLoan',
    'minimumDownPayment',
    'interestRate',
    'loanTerm',
    'actions',
];

const listConfig = ({ index, setModale, ...cfg }) => [{
    $: 'id',
    className: 'bank-id',
    cell: renderCell({ ...cfg, }),
    title: renderTitle({ ...cfg, title: 'ID', }),
}, {
    $: 'name',
    className: 'bank-name',
    cell: renderCell({ ...cfg, }),
    title: renderTitle({ ...cfg, title: 'Name', }),
}, {
    $: 'interestRate',
    cell: renderCell({ ...cfg, unit: '%', }),
    title: renderTitle({ ...cfg, title: 'Interest rate', }),
}, {
    $: 'loanTerm',
    cell: renderCell({ ...cfg, unit: 'month', }),
    title: renderTitle({ ...cfg, title: 'Loan term', }),
}, {
    $: 'maximumLoan',
    cell: renderCell({ ...cfg, unit: '$', }),
    title: renderTitle({ ...cfg, title: 'Maximum loan', }),
}, {
    $: 'minimumDownPayment',
    cell: renderCell({ ...cfg, unit: '$', }),
    title: renderTitle({ ...cfg, title: 'Minimum down payment', }),
}, {
    $: 'actions',
    cell: ({ row }) => {
        return (
            <>
                <Button onClick={() => setModale({ editId: row.id, })}>/</Button>
                <Button onClick={() => setModale({ removeId: row.id, })}>-</Button>
            </>
        );
    },
    title: () => {
        return (<Button onClick={() => setModale({ add: true, })}>+</Button>);
    },
},].map(config => {
    return { ...config, index: index.indexOf(config.$), };
}).sort((a, b) => a.index - b.index);

export const Bank = () => {
    const [part, setPart] = useState({ filter: {}, order: [] });
    const [page, setPage] = useState({ skip: 0, take: 10 });
    const [index, setIndex] = useState([...listIndex]);
    const [data, setData] = useState({ count: 0, items: [] });
    const [modale, setModale] = useState({ add: false, editId: 0, removeId: 0, });

    useEffect(() => {
        const load = async () => {
            const options = { ...part, ...page, };
            const { count, items, } = await bankService.list(options);
            await setData({ count, items, });
        };
        load();
    }, [part, page]);

    const bankItem = (id) => data.items.find(bank => bank.id === id);
    const options = { cfg: listConfig({ part, index, modale, setModale, setPart, }), data, setIndex, };
    return (
        <>
            <List { ...options } />
            <Modale show={ modale.add } onClose={() => setModale({ add: false })}>
                <PopupBank
                    add={ modale.add }
                    onAccept={ async () => { setPage(page) } }
                    onCancel={ () => setModale({ add: false }) }
                />
            </Modale>
            <Modale show={ modale.editId>0 } onClose={ () => setModale({ editId: 0 }) }>
                <PopupBank
                    bank={ bankItem(modale.editId) }
                    editId={ modale.editId }
                    onAccept={ async () => setPage(page) }
                    onCancel={ () => setModale({ editId: 0 }) }
                />
            </Modale>
            <Modale show={ modale.removeId>0 } onClose={ () => setModale({ removeId: 0 }) }>
                <PopupBank
                    bank={ bankItem(modale.removeId) }
                    removeId={ modale.removeId }
                    onAccept={ async () => setPage(page) }
                    onCancel={ () => setModale({ removeId: 0 }) }
                />
            </Modale>
        </>
    );
};