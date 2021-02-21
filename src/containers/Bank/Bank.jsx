import { useState, useEffect, } from 'react';
import { withRouter, } from 'react-router-dom';

import { bankService, } from '../../services';

import { Button, } from '../../components/Button';
import { List, } from '../../components/List';
import { Modale, } from '../../components/Modale';
import { PopupBank, } from '../../components/PopupBank';
import { Page, } from '../../components/Page';

const renderActions = ({
    props,
    setModale,
}) => ({
    className,
    row,
}) => {
    const onCalc = () => props.history.push(`/calc/${ row.id }`, );
    const onEdit = () => setModale({ editId: row.id, });
    const onRemove = () => setModale({ removeId: row.id, });
    return (
        <div className={ className }>
            <Button onClick={ onCalc }>calc</Button>
            <Button onClick={ onEdit }>/</Button>
            <Button onClick={ onRemove }>-</Button>
        </div>
    );
};

const renderAdd = ({
    setModale,
}) => ({
    className,
}) => {
    const onAdd = () => setModale({ add: true, });
    return (
        <div className={ className }>
            <Button onClick={ onAdd }>+</Button>
        </div>
    );
};

const renderCell = ({
    unit,
}) => ({
    className,
    value,
    $,
    row,
    data,
}) => {
    return (
        <div
            className={className}
            data-key={ $ }
        >
            { `${ value }${ unit ? ` ${ unit }` : '' }` }
        </div>
    );
};

const renderTitle = ({
    title,
    part,
    setPart,
}) => ({
    $,
    className,
    orderable=false,
}) => {
    const { order } = part;

    const orderIndex = (key) => {
        const index = order.findIndex(([k]) => k === key) + 1;
        return index ? index : null;
    };
    const orderBy = (key) => order.find(([k]) => k === key)?.[1] ?? null;

    const onClick = (key, orderBy, orderIndex) => (event) => {
        event.preventDefault();
        let orderNew = order.filter(([k]) => k !== key);
        if (orderIndex!==1) {
            orderNew.unshift([key, 'asc']);
        } else if (orderBy === 'asc') {
            orderNew.unshift([key, 'desc']);
        } else if (orderBy === 'desc') {
            // reset order by key
        }
        setPart({ ...part, order: orderNew, });
    };

    return (
        <div
            className={ [className, orderable ? 'list__orderable' : ''].join(' ') }
            data-oby={ orderBy($) }
            data-oid={ orderIndex($) }
            onClick={ orderable && onClick($, orderBy($), orderIndex($)) }
        >
            { title }
        </div>
    );
};

const listConfig = ({
    props,
    page,
    index,
    setModale,
    ...cfg
}) => [{
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
    orderable: true,
    title: renderTitle({ ...cfg, title: 'ID', }),
}, {
    $: 'name',
    cell: renderCell({ ...cfg, }),
    className: 'bank-name',
    orderable: true,
    title: renderTitle({ ...cfg, title: 'Name', }),
}, {
    $: 'interestRate',
    cell: renderCell({ ...cfg, unit: '%', }),
    className: 'bank-interest-rate',
    orderable: true,
    title: renderTitle({ ...cfg, title: 'Interest rate', }),
}, {
    $: 'loanTerm',
    cell: renderCell({ ...cfg, unit: 'month', }),
    className: 'bank-loan-term',
    orderable: true,
    title: renderTitle({ ...cfg, title: 'Loan term', }),
}, {
    $: 'maximumLoan',
    cell: renderCell({ ...cfg, unit: '$', }),
    className: 'bank-maximum-loan',
    orderable: true,
    title: renderTitle({ ...cfg, title: 'Maximum loan', }),
}, {
    $: 'minimumDownPayment',
    cell: renderCell({ ...cfg, unit: '$', }),
    className: 'bank-minimum-down-payment',
    orderable: true,
    title: renderTitle({ ...cfg, title: 'Minimum down payment', }),
}, {
    $: 'actions',
    cell: renderActions({ props, setModale, }),
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

export const Bank = withRouter((props) => {
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
        cfg: listConfig({
            props,
            part,
            page,
            index,
            modale,
            setModale,
            setPart,
        }),
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
});