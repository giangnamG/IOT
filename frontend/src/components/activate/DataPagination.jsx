import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import config from '../../config';

function DataPagination({ totalPages, currentPage, onPageChange }) {
    const items = [];
    const maxDisplayedPages = 20; // Giới hạn số lượng ô hiển thị

    if (totalPages <= maxDisplayedPages) {
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={`page-${number}`} // Sử dụng key duy nhất
                    active={number === currentPage}
                    onClick={() => onPageChange(number)}
                    style={{
                        backgroundColor: number === currentPage ? '#007bff' : '#f8f9fa', // Màu nền cho trang hiện tại và các trang khác
                        color: number === currentPage ? '#fff' : '#007bff' // Màu chữ cho trang hiện tại và các trang khác
                    }}
                >
                    {number}
                </Pagination.Item>,
            );
        }
    } else {
        const leftSide = Math.max(2, currentPage - 5);
        const rightSide = Math.min(totalPages - 1, currentPage + 2);

        // Trang đầu tiên
        items.push(
            <Pagination.Item
                key={`page-1`} // Sử dụng key duy nhất
                active={currentPage === 1}
                onClick={() => onPageChange(1)}
                style={{
                    backgroundColor: currentPage === 1 ? '#007bff' : '#f8f9fa',
                    color: currentPage === 1 ? '#fff' : '#007bff'
                }}
            >
                1
            </Pagination.Item>,
        );

        if (leftSide > 2) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />); // Thêm key duy nhất cho Ellipsis
        }

        for (let number = leftSide; number <= rightSide; number++) {
            items.push(
                <Pagination.Item
                    key={`page-${number}`} // Sử dụng key duy nhất
                    active={number === currentPage}
                    onClick={() => onPageChange(number)}
                    style={{
                        backgroundColor: number === currentPage ? '#007bff' : '#f8f9fa',
                        color: number === currentPage ? '#fff' : '#007bff'
                    }}
                >
                    {number}
                </Pagination.Item>,
            );
        }

        if (rightSide < totalPages - 1) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />); // Thêm key duy nhất cho Ellipsis
        }

        // Trang cuối cùng
        items.push(
            <Pagination.Item
                key={`page-${totalPages}`} // Sử dụng key duy nhất
                active={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                style={{
                    backgroundColor: currentPage === totalPages ? '#007bff' : config.app.styles.backgroundColor,
                    color: currentPage === totalPages ? '#fff' : '#007bff'
                }}
            >
                {totalPages}
            </Pagination.Item>,
        );
    }

    return (
        <>
            <Pagination style={{ backgroundColor: config.app.styles.backgroundColor }}>
                <Pagination.First onClick={() => onPageChange(1)} />
                <Pagination.Prev onClick={() => onPageChange(Math.max(1, currentPage - 1))} />
                {items}
                <Pagination.Next onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} />
                <Pagination.Last onClick={() => onPageChange(totalPages)} />
            </Pagination>
        </>
    );
}

export default DataPagination;
