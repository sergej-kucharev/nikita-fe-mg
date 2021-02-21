import { useState, } from 'react';
import PropTypes from 'prop-types';

import { bankService, } from '../../services';

import { Button, } from '../Button';


export const PopupBank = ({
    add,
    bank,
    editId,
    removeId,
    onAccept,
    onCancel,
}) => {
    const [item, setItem] = useState({});
    const onChange = (key, cast) => ({ target: { value }}) => setItem({
        ...item,
        [key]: cast ? cast(value) : value,
    });

    let title, acceptText, cancelText = 'Cancel';
    let disabled = false, onSubmit;
    if (removeId) {
        title = 'Remove';
        acceptText = 'Remove';
        disabled = true;
        onSubmit = async (event) => {
            event.preventDefault();
            console.log('submit remove');
            await bankService.delete({ id: removeId });
            await onAccept();
        };
    } else if (editId) {
        title = 'Edit';
        acceptText = 'Edit';        
        onSubmit = async (event) => {
            event.preventDefault();
            console.log('submit edit');
            await bankService.update({ id: editId, ...item });
            await onAccept();
        };
    } else if (add) {
        title = 'Add';
        acceptText = 'Add';
        onSubmit = async (event) => {
            event.preventDefault();
            console.log('submit add');
            await bankService.create({ ...item });
            await onAccept();
        };
    } else {
        return null;
    }

    return (
        <form
            className="popup-bank"
            method="POST"
            encType="multypart/form-data"
            onSubmit={ onSubmit }
            onReset={ onCancel }
        >
            <h3>{ title }</h3>
            <dl>
                <dt>ID</dt>
                <dd>
                    <input
                        type="number"
                        disabled={ true }
                        value={ item.id ?? bank.id ?? '' }
                        onChange={ onChange('id', Number) }
                    />
                    </dd>
                <dt>Name</dt>
                <dd>
                    <input
                        type="text"
                        autoFocus={ true }
                        disabled={ disabled }
                        value={ item.name ?? bank.name ?? '' }
                        onChange={ onChange('name') }
                    />
                </dd>
                <dt>Maximum Loan</dt>
                <dd>
                    <input
                        type="number"
                        disabled={ disabled }
                        min={ 1 }
                        value={ item.maximumLoan ?? bank.maximumLoan ?? '' }
                        onChange={ onChange('maximumLoan', Number) }
                    />
                </dd>
                <dt>Minimum Down Payment</dt>
                <dd>
                    <input
                        type="number"
                        disabled={ disabled }
                        min={ 1 }
                        value={ item.minimumDownPayment ?? bank.minimumDownPayment ?? '' }
                        onChange={ onChange('minimumDownPayment', Number) }
                    />
                </dd>
                <dt>Interest Rate</dt>
                <dd>
                    <input
                        type="number"
                        disabled={ disabled }
                        max={ 100 }
                        min={ 1 }
                        step={ 0.1 }
                        value={ item.interestRate ?? bank.interestRate ?? '' }
                        onChange={ onChange('interestRate', Number) }
                    />
                </dd>
                <dt>Loan Term</dt>
                <dd>
                    <input
                        type="number"
                        disabled={ disabled }
                        min={ 1 }
                        value={ item.loanTerm ?? bank.loanTerm ?? '' }
                        onChange={ onChange('loanTerm', Number) }
                    />
                </dd>
            </dl>
            <div>
                <Button type="submit" >{ acceptText }</Button>
                <Button type="reset" >{ cancelText }</Button>
            </div>
        </form>
    );
};
PopupBank.propTypes = {
    add: PropTypes.bool,
    bank: PropTypes.object,
    editId: PropTypes.number,
    removeId: PropTypes.number,
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
PopupBank.defaultProps = {
    add: false,
    bank: {},
    editId: 0,
    removeId: 0,
};