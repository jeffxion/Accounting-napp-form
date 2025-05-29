import React, { useState, useEffect, useRef } from 'react';

import { universalAPIfunction } from '../../http/apiService.js';

import { dataFormatForPayload, dateFormatUTC } from "../../util/dateFormat.js";

import { Card, Modal, Button, Form } from 'react-bootstrap';
import StatementMoreInfo from "./StatementMoreInfo.jsx";

const Statement = ({getAccounting, currency, startDate, endDate, parameters }) => {
    const [show, setShow] = useState(false);
    const [showEquity, setShowEquity] = useState(false);
    const [selectedTd, setSelectedTd] = useState({});
    const [title, setTitle] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [currencyGuid, setCurrencyGuid] = useState("");
    const [aEToGLRelData, setAEToGLRelData] = useState([]);
    const [open3rdDrillDown, setOpen3rdDrillDown] = useState(null);
    const [currentVal, setCurrentVal] = useState(null);
    const [prevVal, setPrevVal] = useState(null);
    const [data, setData] = useState({
        currency: "",
        startdate: "",
        enddate: "",
        currencydecimal: "",
        assets: "",
        incomes: "",
        expenses: "",
        liabilities: "",
        equities: "",
        owners: "",
        earnings: "",
        show: false,
    });

    const prevStateRef = useRef(null);

    useEffect(() => {
        if (getAccounting.length > 0) {
            const defaultCurrency = getAccounting[0].CurrencyName;
            populateStatement(defaultCurrency);
        }
    }, [getAccounting]);


    const handleShowStatement = (e) => {
        const currencyName = e.target.value;
        populateStatement(currencyName);
    };

    const populateStatement = (currencyName) => {
        // console.log("currencyName", currencyName);
        const data = getAccounting.find(item => item.CurrencyName === currencyName);
        setSelectedCurrency(data.AccountType);

        const selected = currency.find(item => item.CurrencyName === currencyName);
        setCurrencyGuid(selected.CurrencyGUID);
    
        if (getAccounting.length !== 0 && data) {
            const filtered = data.AccountType;
    
            const asset = filtered.find(item => item.AccountTypeName === "Assets");
            const income = filtered.find(item => item.AccountTypeName === "Income");
            const expense = filtered.find(item => item.AccountTypeName === "Expense");
            const liability = filtered.find(item => item.AccountTypeName === "Liabilities");
            const equity = filtered.find(item => item.AccountTypeName === "Equity");
            const owner = filtered.find(item => item.AccountTypeName === "Owners Equity");
            const earning = filtered.find(item => item.AccountTypeName === "Retained Earnings");
    
            setData({ 
                currency: data.CurrencyName,
                startdate: data.StartDate,
                enddate: data.EndDate,
                currencydecimal: data.CurrencyPracticalDecimal,
                assets: asset,
                incomes: income,
                expenses: expense,
                liabilities: liability,
                equities: equity,
                owners: owner,
                earnings: earning,
                show: true
            });
        }
    };

    const handleNumberFormat = (intgr, decimalPlaces = 2) => {
        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
        });
        return formatter.format(intgr);
    };

    const handleShow = (params) => {
        setTitle(params);
        const filtered = selectedCurrency;
    
        const data = filtered.find(item => item.AccountTypeName === params);
        setSelectedTd(data);
        setShow(true);
    }

    const handleClose = () => {
        setAEToGLRelData([]);
        setShow(false);
    }

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + parameters.token,
    };


    const handleGrillDownData = async (guid, indx) => {
        setOpen3rdDrillDown(prevIndex => (prevIndex === indx ? null : indx));
        try {
            const payLoad = {
                apiKey: parameters.apiKey,
                additionalPayload: {
                    "@GetGLDetailsForAccountingBooks": 1,
                    "@AEToGLRelrsmGUID": guid,
                    "@CurrencyGUID": currencyGuid,
                    "@StartDate": dataFormatForPayload(startDate),
                    "@EndDate": dataFormatForPayload(endDate)
                }
            };

            const dataResult = await universalAPIfunction(payLoad, parameters, headers);
            setAEToGLRelData(dataResult.dataPayload);
            
        } catch (error) {
            console.log("handleGrillDownData", error);
        }

        const prevValue = prevStateRef.current;
        const currentValue = guid;

        // console.log('Previous value:', prevValue);
        // console.log('Next value:', currentValue);

        // Update state and ref
        setCurrentVal(currentValue);
        prevStateRef.current = currentValue;

        setPrevVal(prevValue);
    }

    const handleToogleEquity = () => {
        setShowEquity(value => !value);
    }
    
    return (
        <>
            
            <form>
                <div className="mb-3">
                <label className="form-label" htmlFor="formCurrency">Select Currency:</label>
                    <select className="inputFee form-select" onChange={handleShowStatement}>
                        {getAccounting && getAccounting.map((item, index) => (
                            <React.Fragment key={index}>
                                <option value={item.CurrencyName}>{item.CurrencyName}</option>
                            </React.Fragment>
                        ))}
                    </select>
                </div>
            </form>
        
            
            {data?.show ? (
                <div className="container mt-5" id="statement">
                    <div className="statement-title">
                        <h5>Accounting Statements</h5>
                        <div className="statement-content">
                            <ul className="no-dots">
                                <li>Currency: {data?.currency}</li>
                                <li>Start Date: {dateFormatUTC(data?.startdate)}</li>
                                <li>End Date: {dateFormatUTC(data?.enddate)}</li>
                            </ul>
                        </div>
                    </div>

                    <Card className="p-0">
                        <Card.Body>
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td colSpan="4" className="text-start fw-bold title-font">PROFIT AND LOSS</td>
                                    </tr>
                                    <tr onClick={() => handleShow("Income")}>
                                        <td>Income</td>
                                        <td>{handleNumberFormat(data.incomes?.AccountTypeBalance ?? 0, data?.currencydecimal)}</td>
                                    </tr>
                                    <tr onClick={() => handleShow("Expense")}>
                                        <td>Expense</td>
                                        <td>{handleNumberFormat(data.expenses?.AccountTypeBalance ?? 0, data?.currencydecimal)}</td>
                                    </tr>
                                    <tr className="fw-bold">
                                        <td className="pl-35 total">Profit/Loss</td>
                                        <td className="underline-number">{handleNumberFormat((data.incomes?.AccountTypeBalance - data.expenses?.AccountTypeBalance), data?.currencydecimal)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="height-space"></td>
                                    </tr>

                                    <tr>
                                        <td colSpan="4" className="text-start fw-bold title-font">BALANCE SHEET</td>
                                    </tr>
                                    <tr onClick={() => handleShow("Assets")}>
                                        <td>Assets</td>
                                        <td>{handleNumberFormat(data.assets?.AccountTypeBalance ?? 0, data?.currencydecimal)}</td>
                                    </tr>
                                    <tr onClick={() => handleShow("Liabilities")}>
                                        <td>Liabilities</td>
                                        <td>{handleNumberFormat(data.liabilities?.AccountTypeBalance ?? 0, data?.currencydecimal)}</td>
                                    </tr>
                                    <tr onClick={handleToogleEquity}>
                                        <td>Equity</td>
                                        <td> {
                                                handleNumberFormat(
                                                (data.earnings?.AccountTypeBalance ?? 0) +
                                                (data.equities?.AccountTypeBalance ?? 0)
                                                , data?.currencydecimal)
                                            }</td>
                                    </tr>
                                    <tr className={showEquity ? 'd-contents' : 'd-none'} onClick={() => handleShow("Equity")}>
                                        <td className="pl-35">Owners Equity</td>
                                        <td>{handleNumberFormat(data.equities?.AccountTypeBalance ?? 0, data?.currencydecimal)}</td>
                                    </tr>
                                    <tr className={showEquity ? 'd-contents' : 'd-none'} onClick={() => handleShow("Retained Earnings")}>
                                        <td className="pl-35">Retained Earnings</td>
                                        <td>{handleNumberFormat(data.earnings?.AccountTypeBalance ?? 0, data?.currencydecimal)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </div>
            ) : null}

            <Modal size="lg" id="firstdrillDown" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <section id="modaldrillDown" className="w-100">
                        <table className="table table-striped">
                            <tbody>
                                {selectedTd.Accounts?.map((account, accIndex) => (
                                    <React.Fragment key={accIndex}>
                                        <tr key={accIndex} className="fs14">
                                            <td className="text-start fw-bold title-font">{account.AccountName}</td>
                                            <td className="fw-bold title-font">{handleNumberFormat(account.AccountBalance ?? 0, data?.currencydecimal)}</td>
                                        </tr>

                                        {account.AccountLines.map((item, index) => (
                                            <tr key={`${accIndex}-${index}`} 
                                                className={`fs14 ${open3rdDrillDown === `${accIndex}-${index}` ? "selectedTr" : ""}`} 
                                                onClick={() => handleGrillDownData(item.AEToGLRelrsmGUID, `${accIndex}-${index}`)}
                                            >
                                                <td className="pl-35">{item.AEName}</td>
                                                <td>{handleNumberFormat(item.Balance ?? 0, data?.currencydecimal)}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        <div id="example-fade-text" className={open3rdDrillDown !== null ? "d-block" : "d-none"}>
                            <StatementMoreInfo
                                aEToGLRelData={aEToGLRelData} 
                                title={title} 
                                selectedTd={selectedTd}
                                open3rdDrillDown={open3rdDrillDown}
                                currentVal={currentVal}
                                prevVal={prevVal}
                            />
                        </div>
                    </section>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Statement;