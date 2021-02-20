import { useState, } from 'react';
import PropTypes from 'prop-types';

import { Button, } from '../Button';


export const PopupBank = ({
    add,
    bank,
    editId,
    removeId,
    onAccept,
    onCancel,
}) => {
    const [item, setItem] = useState(bank);
    let title, disabled = true, onSubmit, acceptText;
    if (removeId) {
        title = 'Remove';
        onSubmit = async () => {
            await onAccept();
        };
        acceptText = 'Remove';
    } else if (editId) {
        title = 'Edit';
        disabled = false;
        onSubmit = async () => {
            await onAccept();
        };
        acceptText = 'Edit';        
    } else if (add) {
        title = 'Add';
        disabled = false;
        onSubmit = async () => {
            await onAccept();
        };
        acceptText = 'Add';
    } else {
        return null;
    }
    const onChange = (key) => ({ target: { value }}) => setItem({
        [key]: ['name'].includes(key) ? value : +value
    });
    return (
        <form className="popup-bank" onSubmit={ onSubmit } >
            <h3>{ title }</h3>
            <dl>
                <dt>ID</dt>
                <dd>
                    <input
                        type="number"
                        disabled={ true }
                        value={ item.id }
                        onChange={ onChange('id') }
                    />
                    </dd>
                <dt>Name</dt>
                <dd>
                    <input
                        type="text"
                        disabled={ disabled }
                        value={ item.name }
                        onChange={ onChange('name') }
                    />
                </dd>
                <dt>Maximum Loan</dt>
                <dd>
                    <input
                        type="number"
                        disabled={ disabled }
                        min={ 1 }
                        value={ item.maximumLoan }
                        onChange={ onChange('maximumLoan') }
                    />
                </dd>
                <dt>Minimum Down Payment</dt>
                <dd>
                    <input
                        type="number"
                        disabled={ disabled }
                        min={ 1 }
                        value={ item.minimumDownPayment }
                        onChange={ onChange('minimumDownPayment') }
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
                        value={ item.interestRate }
                        onChange={ onChange('interestRate') }
                    />
                </dd>
                <dt>Loan Term</dt>
                <dd>
                    <input
                        type="number"
                        disabled={ disabled }
                        min={ 1 }
                        value={ item.loanTerm }
                        onChange={ onChange('loanTerm') }
                    />
                </dd>
            </dl>
            <div>
                <Button type="submit" >{ acceptText }</Button>
                <Button onClick={ onCancel } >Cancel</Button>
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