import PropTypes from 'prop-types';

export const Button = (props) => {
    return (<button className="button" { ...props } />);
};
Button.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
};