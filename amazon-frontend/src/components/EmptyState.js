import React from 'react';
import { Link } from 'react-router-dom';
import InboxIcon from '@material-ui/icons/Inbox';
import '../styles/EmptyState.css';

const EmptyState = ({
    title = 'No products are currently available under this category/filter.',
    message = 'Please try changing the filter or explore other categories.',
    actionLabel,
    onAction,
    linkTo,
}) => {
    const action = actionLabel && (
        linkTo ? (
            <Link className="empty-state-action" to={linkTo}>
                {actionLabel}
            </Link>
        ) : (
            <button className="empty-state-action" type="button" onClick={onAction}>
                {actionLabel}
            </button>
        )
    );

    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                <InboxIcon />
            </div>
            <h3>{title}</h3>
            <p>{message}</p>
            {action}
        </div>
    );
};

export default EmptyState;
