import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import config from '../../config';
import "../../assets/css/dataPagination.css"; // Đảm bảo CSS được import đúng

function DataPagination({ totalPages, currentPage, onPageChange }) {
    const items = [];
    const maxDisplayedPages = 20;

    if (totalPages <= maxDisplayedPages) {
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={`page-${number}`}
                    active={number === currentPage}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </Pagination.Item>,
            );
        }
    } else {
        const leftSide = Math.max(2, currentPage - 5);
        const rightSide = Math.min(totalPages - 1, currentPage + 2);

        items.push(
            <Pagination.Item
                key={`page-1`}
                active={currentPage === 1}
                onClick={() => onPageChange(1)}
            >
                1
            </Pagination.Item>,
        );

        if (leftSide > 2) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
        }

        for (let number = leftSide; number <= rightSide; number++) {
            items.push(
                <Pagination.Item
                    key={`page-${number}`}
                    active={number === currentPage}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </Pagination.Item>,
            );
        }

        if (rightSide < totalPages - 1) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
        }

        items.push(
            <Pagination.Item
                key={`page-${totalPages}`}
                active={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
            >
                {totalPages}
            </Pagination.Item>,
        );
    }

    return (
        <Pagination className="custom-pagination">
            <Pagination.First onClick={() => onPageChange(1)} />
            <Pagination.Prev onClick={() => onPageChange(Math.max(1, currentPage - 1))} />
            {items}
            <Pagination.Next onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} />
            <Pagination.Last onClick={() => onPageChange(totalPages)} />
        </Pagination>
    );
}

export default DataPagination;
