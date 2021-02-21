import { useState, useEffect, } from 'react';

import { bankService, } from '../../services';

import { Button, } from '../../components/Button';
import { List, } from '../../components/List';
import { Modale, } from '../../components/Modale';
import { PopupBank, } from '../../components/PopupBank';
import { Page, } from '../../components/Page';

const renderActions = ({ setModale, }) => ({ className, row, }) => {
    const onEdit = () => setModale({ editId: row.id, });
    const onRemove = () => setModale({ removeId: row.id, });
    return (
        <div className={ className }>
            <Button onClick={ onEdit }>/</Button>
            <Button onClick={ onRemove }>-</Button>
        </div>
    );
};

const renderAdd = ({ setModale, }) => ({ className, }) => {
    const onAdd = () => setModale({ add: true, });
    return (
        <div className={ className }>
            <Button onClick={ onAdd }>+</Button>
        </div>
    );
};

const renderCell = ({ unit, }) => ({ className, value, row, data, }) => {
    return (
        <div className={className}>
            { `${ value }${ unit ? ` ${ unit }` : '' }` }
        </div>
    );
};

const renderTitle = ({ title, part, setPart, }) => ({ className, }) => {
    return (
        <div className={ className }>
            { title }
        </div>
    );
};

const listConfig = ({ page, index, setModale, ...cfg }) => [{
    $: 'index',
    cell: ({ className, rowId, }) => {
        return (
            <div className={ className }>
                { page.skip + rowId + 1 }
            </div>
        );
    },
    className: 'bank-index',
    title: 'Index',
}, {
    $: 'id',
    cell: renderCell({ ...cfg, }),
    className: 'bank-id',
    title: renderTitle({ ...cfg, title: 'ID', }),
}, {
    $: 'name',
    cell: renderCell({ ...cfg, }),
    className: 'bank-name',
    title: renderTitle({ ...cfg, title: 'Name', }),
}, {
    $: 'interestRate',
    cell: renderCell({ ...cfg, unit: '%', }),
    className: 'bank-interest-rate',
    title: renderTitle({ ...cfg, title: 'Interest rate', }),
}, {
    $: 'loanTerm',
    cell: renderCell({ ...cfg, unit: 'month', }),
    className: 'bank-loan-term',
    title: renderTitle({ ...cfg, title: 'Loan term', }),
}, {
    $: 'maximumLoan',
    cell: renderCell({ ...cfg, unit: '$', }),
    className: 'bank-maximum-loan',
    title: renderTitle({ ...cfg, title: 'Maximum loan', }),
}, {
    $: 'minimumDownPayment',
    cell: renderCell({ ...cfg, unit: '$', }),
    className: 'bank-minimum-down-payment',
    title: renderTitle({ ...cfg, title: 'Minimum down payment', }),
}, {
    $: 'actions',
    cell: renderActions({ setModale, }),
    className: 'bank-actions',
    title: renderAdd({ setModale, }),
},].map(config => {
    return { ...config, index: index.indexOf(config.$), };
}).sort((a, b) => a.index - b.index);

const init = {
    part: { filter: {}, order: [], },
    page: { skip: 0, take: 3, variance: 2, },
    index: [
        'index',
        'id',
        'name',
        'maximumLoan',
        'minimumDownPayment',
        'interestRate',
        'loanTerm',
        'actions',
    ],
    data: { count: 0, items: [], },
    modale: { add: false, editId: 0, removeId: 0, },
};

export const Bank = () => {
    const [part, setPart] = useState({ ...init.part });
    const [page, setPage] = useState({ ...init.page });
    const [index, setIndex] = useState([ ...init.index ]);
    const [data, setData] = useState({ ...init.data });
    const [modale, setModale] = useState({ ...init.modale });

    useEffect(() => {
        const load = async () => {
            const options = { ...part, ...page, };
            const { count, items, } = await bankService.list(options);
            await setData({ count, items, });
        };
        load();
    }, [part, page]);

    const listOptions = {
        cfg: listConfig({ part, page, index, modale, setModale, setPart, }),
        data,
        setIndex,
    };

    const pageOptions = {
        data,
        page,
        setPage,
    };

    const bankItem = (id) => data.items.find(bank => bank.id === id);
    const onAccept = async () => {
        setModale({ ...init.modale });
        setPage({ ...page });
    };
    const onCancel = () => setModale({ ...init.modale });

    return (
        <>
            <Page { ...pageOptions } />
            <List { ...listOptions } />
            <Page { ...pageOptions } />
            <Modale show={ modale.add } onClose={ onCancel }>
                <PopupBank
                    add={ modale.add }
                    onAccept={ onAccept }
                    onCancel={ onCancel }
                />
            </Modale>
            <Modale show={ modale.editId>0 } onClose={ onCancel }>
                <PopupBank
                    bank={ bankItem(modale.editId) }
                    editId={ modale.editId }
                    onAccept={ onAccept }
                    onCancel={ onCancel }
                />
            </Modale>
            <Modale show={ modale.removeId>0 } onClose={ onCancel }>
                <PopupBank
                    bank={ bankItem(modale.removeId) }
                    removeId={ modale.removeId }
                    onAccept={ onAccept }
                    onCancel={ onCancel }
                />
            </Modale>
        </>
    );
};