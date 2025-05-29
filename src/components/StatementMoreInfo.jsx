import React, { useState, useEffect } from 'react';

import { Table, Card } from 'react-bootstrap';

import { dateFormatLocal } from "../../util/dateFormat.js";

import { IoIosOptions } from "react-icons/io";
import ModalPagination from './modal/ModalPagination.jsx';


const StatementMoreInfo = ({aEToGLRelData, title, selectedTd, currentVal, prevVal}) => {
    const [drillDownData, setdrillDownData] = useState([]);
    const [open4thDrillDown, setOpen4thDrillDown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPge, SetPostsPerPage] = useState(10);

    const indexOfLastPost = currentPage * postsPerPge;
    const indexOfFirstPost = indexOfLastPost - postsPerPge;
    const sortedData = aEToGLRelData === null 
        ? [] 
        : [...aEToGLRelData].sort(
            (a, b) => new Date(b.LocalGrouperEffectiveDate) - new Date(a.LocalGrouperEffectiveDate)
        );

const currentPosts = sortedData.slice(indexOfFirstPost, indexOfLastPost);

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
        setOpen4thDrillDown(null);
    }

    useEffect(() => {
        if(prevVal !== currentVal){
            setOpen4thDrillDown(null);
        }
    }, [prevVal, currentVal]);

    const convertNumber = (a) => {
        const finaloutput = a * -1;

        if(title === "Income"){
            const finalConvert = selectedTd.AccountType === 386910 ? finaloutput.toFixed(2) : a.toFixed(2);
            return finalConvert;
                
        }else if(title === "Liabilities"){
            const finalConvert = selectedTd.AccountType === 386909 ? finaloutput.toFixed(2) : a.toFixed(2);
            return finalConvert;

        }else if(title === "Equity"){
            const finalConvert = selectedTd.AccountType === 740610 ? finaloutput.toFixed(2) : a.toFixed(2);
            return finalConvert;

        }else {
            return a.toFixed(2);
        }
    }

    const handle4thDrillDown = (obj, indx) => {
        setOpen4thDrillDown(prevIndex => (prevIndex === indx ? null : indx));
        setdrillDownData(obj);
    }


    return (
        <>
            {title !== "Retained Earnings" ? (
                <Card className="m-0 p-0">
                    <Card.Body>
                        <div className="table-responsive">
                            <Table className='fs-14'>
                                <thead>
                                    <tr>
                                        <th style={{ width: '5%' }}></th>
                                        <th className="text-start text-nowrap">Fee Title</th>
                                        <th className="text-start text-nowrap">Amount</th>
                                        <th className="text-start text-nowrap">Date</th>
                                        <th className="text-start text-nowrap">Transaction ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPosts && currentPosts.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <tr className={open4thDrillDown === index ? "isActive" : ""}>
                                                <td className="isActive">
                                                <IoIosOptions
                                                    className="showMore-btn"
                                                    onClick={() => handle4thDrillDown(item.FeeInfo, index)}
                                                />
                                                </td>
                                                <td className="text-start text-nowrap">{item.FeeInfo[0].FeeTitle}</td>
                                                <td className="text-start text-nowrap">{convertNumber(item.Amount)}</td>
                                                <td className="text-start text-nowrap">{dateFormatLocal(item.LocalGrouperEffectiveDate)}</td>
                                                <td className="text-start text-nowrap">{item.LocalGrouperID}</td>
                                            </tr>

                                            {open4thDrillDown === index && (
                                                <>
                                                    <tr className={`selectedTr ${open4thDrillDown === index ? "slide-bottom" : "slide-up"}`}>
                                                        <th colSpan="4">Other Participants</th>
                                                        <th colSpan="4">Local Transaction</th>
                                                    </tr>

                                                    {drillDownData?.map((account, accIndex) => (
                                                        <React.Fragment key={`account-${index}-${accIndex}`}>
                                                        {account.OtherAEs.map((ae, aeIndex) => (
                                                            <tr key={`ae-${index}-${accIndex}-${aeIndex}`}
                                                            className={`selectedTr fs14 ${open4thDrillDown === index ? "slide-bottom" : "slide-up"}`}>
                                                            <td colSpan="4">{ae.AEName}</td>
                                                            <td colSpan="4" >{ae.OtherAELocalGrouperID}</td>
                                                            </tr>
                                                        ))}
                                                        </React.Fragment>
                                                    ))}
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </Table>
                            {aEToGLRelData !== null ? (
                                <ModalPagination
                                    length={aEToGLRelData.length} 
                                    postsPerPage={postsPerPge} 
                                    handlePagination={handlePagination} 
                                    currentPage={currentPage}
                                />
                            ) : null}
                        </div>
                    </Card.Body>
                </Card>
            ) : null}
        </>
    )
};

export default StatementMoreInfo;