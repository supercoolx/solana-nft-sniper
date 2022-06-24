import React from 'react';
import Page from 'rc-pagination';
import 'assets/css/pagination.css';

const Pagination = ({ current, total, onChange }) => {
    const renderer = (page, type, element) => {
        if (type === 'prev') return 'Prev';
        if (type === 'next') return 'Next';
        if (type === 'jump-prev') return '...';
        if (type === 'jump-next') return '...';
        return element;
    }

    return (
        <Page
            showTitle={false}
            showLessItems={true}
            pageSize={12}
            total={total}
            current={current}
            itemRender={renderer}
            onChange={onChange}
        />
    )
}

export default Pagination;