'use strict';

import PropTypes from 'prop-types';

export const List = ({
    cfg,
    data,
}) => {
    const th = ({ title, }, key) => (
        <th className="list__cell" key={ key }>{ title() }</th>
    );
    const td = (options, key) => (
        <th className="list__cell" key={ key }>{ options.cell(options) }</th>
    );
    const tr = (data, className, td) => data.map((row, rowId, data) => (
        <tr className={ className } key={ rowId }>
            { cfg.map((cfg, key) => td({ ...cfg, value: row[cfg.$], row, data, }, key)) }
        </tr>
    ));
    return (
        <table className="list">
            <thead>{ tr([{}], "list__head", th) }</thead>
            <tbody>{ tr(data.items, "list__data", td) }</tbody>
        </table>
    );
};
List.propTypes = {
    cfg: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.exact({
        count: PropTypes.number.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            interestRate: PropTypes.number.isRequired,
            loanTerm: PropTypes.number.isRequired,
            maximumLoan: PropTypes.number.isRequired,
            minimumDownPayment: PropTypes.number.isRequired,
        })).isRequired,
    }).isRequired,
};