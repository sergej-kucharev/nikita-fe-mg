import { useState, useEffect, } from 'react';
import { withRouter, } from 'react-router-dom';

import { bankService, } from '../../services';

import { Button, } from '../../components/Button';

const init = {
    bank: {},
    form: {
        initialLoan: 0,
	    downPayment: 0,
    },
};

export const Calc = withRouter((props) => {
    const bankId = props?.match?.params?.bankId;

    const [bank, setBank] = useState({ ...init.bank });
    const [form, setForm] = useState({ ...init.form });

    useEffect(() => {
        const load = async () => {
            const options = { id: bankId, };
            const bank = await bankService.read(options);
            await setBank(bank);
        };
        load();
    }, [bankId]);

    console.log({ bank });

    return 'Calc';
});