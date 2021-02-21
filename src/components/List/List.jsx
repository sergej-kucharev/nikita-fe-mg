import PropTypes from 'prop-types';

export const List = ({
    cfg,
    data,
}) => {
    const th = ({ title, ...options }, key) => (
        <th className="list__table_cell" key={ key }>
            { title instanceof Function ? title({ title, ...options }) : title }
        </th>
    );
    const td = (options, key) => (
        <td className="list__table_cell" key={ key }>
            { options.cell(options) }
        </td>
    );
    const tr = (data, className, td) => data.map((row, rowId, data) => (
        <tr className={ className } key={ rowId }>
            {
                cfg.map((cfg, key) => {
                    return td({
                        ...cfg,
                        columnId: key,
                        row,
                        rowId,
                        data,
                        value: row[cfg.$],
                    }, key);
                })
            }
        </tr>
    ));
    return (
        <div className="list">
            <table className="list__table">
                <thead>{ tr([{}], "list__table_head", th) }</thead>
                <tbody>{ tr(data.items, "list__table_body", td) }</tbody>
            </table>
        </div>
    );
};
List.propTypes = {
    cfg: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.exact({
        count: PropTypes.number.isRequired,
        items: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
};