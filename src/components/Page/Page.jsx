import PropTypes from 'prop-types';

import { Button, } from '../Button';

export const Page = ({ data, page, setPage, }) => {
    const { count, items, } = data;
    const { skip, take, variance, } = page;
    const pageCount = Math.ceil(count / take);
    const pageId = Math.ceil(skip / take);
    const pageIdFirst = 0;
    const pageIdLast = Math.max(pageIdFirst, pageCount - 1);
    const pageIdPrev = Math.max(pageIdFirst, pageId - 1);
    const pageIdNext = Math.min(pageIdLast, pageId + 1);

    const onClick = (id) => (event) => {
        event.preventDefault();
        setPage({ ...page, skip: id * take, });
    };

    const item = (check, id, text, className) => {
        if (check) {
            return (
                <Button
                    key={ text }
                    className={ `button page__item ${ className }` }
                    onClick={ pageId === id ? null : onClick(id) }
                >
                    { text }
                </Button>
            );
        }
        return null;
    }

    const pages = Object.keys([...Array(variance*2+1)]).map(id => {
        return id - variance + pageId;
    }).filter(id => {
        return pageIdFirst <= id && id <= pageIdLast;
    }).map(id => item(true, id, id + 1, pageId === id ? 'page__item_current' : ''));

    return (
        <div className="page">
            <div className="page__state">
                <span className="page__skip" title="skipped">{ skip }</span>
                <span className="page__show" title="shown">{ items.length }</span>
                <span className="page__total" title="total">{ count }</span>
            </div>
            { item(pageId > pageIdFirst, pageIdFirst, '<<', 'page__item_first') }
            { item(pageIdPrev > pageIdFirst, pageIdPrev, '<', 'page__item_prev') }
            { pages }
            { item(pageIdNext < pageIdLast, pageIdNext, '>', 'page__item_next') }
            { item(pageId < pageIdLast, pageIdLast, '>>', 'page__item_last') }
        </div>
    );
};
Page.propTypes = {
    data: PropTypes.shape({
        count: PropTypes.number.isRequired,
        items: PropTypes.array.isRequired,
    }).isRequired,
    page: PropTypes.shape({
        skip: PropTypes.number.isRequired,
        take: PropTypes.number.isRequired,
        variance: PropTypes.number.isRequired,
    }).isRequired,
    setPage: PropTypes.func.isRequired,
};
Page.defaultProps = {
    data: {
        count: 0,
    },
    page: {
        skip: 0,
        take: 10,
    }
};