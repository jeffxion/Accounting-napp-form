import React from 'react';
import { Button} from 'react-bootstrap';

const ModalPagination = ({ postsPerPage, length, handlePagination, currentPage }) => {
    let totalPages = Math.ceil(length / postsPerPage);
    let paginationNumber = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        paginationNumber.push(i);
    }

    return (
        <div className="custom-flex">
            {currentPage > 1 && (
                <Button variant="light" onClick={() => handlePagination(currentPage - 1)}>
                    &laquo; Prev
                </Button>
            )}

            {paginationNumber.map((data) => (
                <Button variant={currentPage === data ? 'dark' : 'light'} key={data} onClick={() => handlePagination(data)}>
                    {data}
                </Button>
            ))}

            {currentPage < totalPages && (
                <Button variant="light" onClick={() => handlePagination(currentPage + 1)}>
                    Next &raquo;
                </Button>
            )}
        </div>
    );
};


export default ModalPagination;