import { useRef, } from 'react';
import PropTypes from 'prop-types';

export const Modale = ({
    show,
    children,
    onClose,
}) => {
    const modale = useRef(null);
    
    if (!show) {
        return null;
    }

    const onClick = (event) => {
        if (!['click'].includes(event.type)) return;
        if (!modale) return;
        if (![modale.current].includes(event.target)) return;
        event.preventDefault();
        onClose();
    };

    return (
        <div
            className="modale"
            ref={ modale }
            onClick={ onClick }
        >
            { children }
        </div>
    );
};
Modale.propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
};
Modale.defaultProps = {
    show: false,
};