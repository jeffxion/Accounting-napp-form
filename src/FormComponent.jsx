import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button} from 'react-bootstrap';

import { universalAPIfunction } from "../http/apiService.js";
import { dataFormatForPayload } from "../util/dateFormat.js";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineDocumentReport } from "react-icons/hi";

import Statement from "./components/Statement.jsx";

import "../style/statement.css";

const cur = new Date();
const day = cur.getDate();
const month = cur.getMonth() === 0 ? 11 : cur.getMonth() - 1;
const year = cur.getFullYear();
const prev = new Date(year, month, day);

export default function FormComponent ({parameters})  {
  const [loading, setLoading] = useState(false);
  const [getAccounting, setAccounting] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [startDate, setStartDate] = useState(prev);
  const [endDate, setEndDate] = useState(new Date());
  const [getCurrency, setCurrency] = useState([]);
  const [formVal, setFormVal] = useState({
    currency: "",
    suppress: 1,
    includeEncats: 0
  });

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + parameters.token,
  };

  useEffect(() => {
    handleCurrency();
  }, []);

  const handleCurrency = async () => {
    try {
      const payLoad = {
        apiKey: parameters.apiKey,
        additionalPayload: {
            "@ChooseCurrency": 1
        }
      };

      const data = await universalAPIfunction(payLoad, parameters, headers);
      // console.log(data);
      setCurrency(data.dataPayload);
    } catch (error) {
      console.error("handleCurrency error:", error);
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if(dataFormatForPayload(endDate) > dataFormatForPayload(startDate)){
          const defaultGUID = "00000000-0000-0000-0000-000000000000";
          const guid = formVal.currency !== "" ? formVal.currency : defaultGUID;

          const payLoad = {
              apiKey: parameters.apiKey,
              additionalPayload: {
                  "@GetBooks": 1,
                  "@StartDate": dataFormatForPayload(startDate),
                  "@EndDate": dataFormatForPayload(endDate),
                  "@CurrencyGUID": guid,
                  "@SuppressAccountsWithNoTrans": Number(formVal.suppress),
                  "@IncludeEnCatsForEvent": Number(formVal.includeEncats),
                  "@Targetwalletguid": parameters.walletguid,
                  // "@TargetChitAuthority": parameters.chitAuth,
              }
          };

          // console.log("payLoad", payLoad);

          const data = await universalAPIfunction(payLoad, parameters, headers);
          // console.log("Result", data);
          if(data.statusResponse.status === "Success"){
              setShowResult(true);
              setAccounting(data.dataPayload);
          }

          if(data.dataPayload === null){
              setShowResult(false);
              setAccounting([]);
          }
      }else{
          setShowResult(false);
      }
    } catch (error) {
        console.log("error", error);
    }
    setLoading(false);
  }

  const handleGetDateRange = (e) => {
    const daterange = e.target.value;
    const date = new Date;
    const curr = new Date();
    if(daterange === 'This week'){
        const first = date.getDate() - date.getDay();
        const last = first + 6;

        // Create new instances to prevent modifying the original date
        const firstday = new Date(date);
        firstday.setDate(first);
        firstday.setHours(0, 0, 1, 0); // 00:00:01

        const lastday = new Date(date);
        lastday.setDate(last);
        lastday.setHours(23, 59, 59, 999); // Set to 23:59:59

        setStartDate(firstday);
        setEndDate(lastday);
        
    }else if(daterange === 'Last week'){
        const currentDay = date.getDay();

        // Calculate last Sunday's date
        const lastSunday = new Date(date);
        lastSunday.setDate(date.getDate() - currentDay - 7);

        // Calculate next Saturday after last Sunday
        const lastSaturday = new Date(lastSunday);
        lastSaturday.setDate(lastSunday.getDate() + 6);

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(lastSunday);
            d.setDate(lastSunday.getDate() + i);
            dates.push(d.toISOString().split('T')[0]); // Format: YYYY-MM-DD
        }

        const firstday = `${dates[0]} 00:00:01`;
        const lastday = `${dates[dates.length - 1]} 23:59:59`;

        setStartDate(firstday);
        setEndDate(lastday);

    }else if(daterange === 'This month'){
        const curr = new Date();
        const month = curr.getMonth();
        const year = curr.getFullYear();

        // Start at the first day of the month
        const current = new Date(year, month, 1);
        let dates = [];

        // Collect all dates in the current month
        while (current.getMonth() === month) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        // Assign formatted first and last days
        const firstday = formatDate(dates[0], "00:00:01");
        const lastday = formatDate(dates[dates.length - 1], "23:59:59");

        setStartDate(firstday);
        setEndDate(lastday);


    }else if(daterange === 'Last month'){
        const month = curr.getMonth() === 0 ? 11 : curr.getMonth() - 1;
        const year = curr.getFullYear();

        const current = new Date(year, month, 1);
        var dates = [];
        while (current.getMonth() === month) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        // Assign formatted first and last days
        const firstday = formatDate(dates[0], "00:00:01");
        const lastday = formatDate(dates[dates.length - 1], "23:59:59");

        setStartDate(firstday);
        setEndDate(lastday);

    }else if(daterange === 'This year'){
        const year = curr.getFullYear();

        const firstMonth = new Date(year, 0, 1);
        const lastMonth = new Date(year, 11, 31);

        const firstday = formatDate(firstMonth, "00:00:01");
        const lastday = formatDate(lastMonth, "23:59:59");

        setStartDate(firstday);
        setEndDate(lastday);

    }else if(daterange === 'Last year'){
        const year = curr.getFullYear() - 1;

        const firstMonth = new Date(year, 0, 1);
        const lastMonth = new Date(year, 11, 31);


        const firstday = formatDate(firstMonth, "00:00:01");
        const lastday = formatDate(lastMonth, "23:59:59");

        setStartDate(firstday);
        setEndDate(lastday);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col">
          <form>
            <div className="mb-3">
              <label className="form-label" htmlFor="formCurrency">Currency:</label><br />
              <select 
                aria-label="Default select example"
                className="inputFee form-select" 
                id="formCurrency"
                onChange={(e) => 
                  setFormVal({
                      ...formVal,
                      currency: e.target.value
                  })
                }
              >
                <option value="00000000-0000-0000-0000-000000000000">All</option>
                {getCurrency.map((data, index) => (
                  <option key={index} value={data.CurrencyGUID}>{data.CurrencyName}</option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-12">
          <form>
            <div className="mb-3">
              <label className="form-label" htmlFor="formStartDate">Start Date:</label><br />
              <DatePicker 
                className="form-control"
                showIcon
                toggleCalendarOnIconClick
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                icon={
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 48 48"
                  >
                      <mask id="ipSApplication0">
                      <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
                          <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                          <path
                          fill="#fff"
                          d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                          ></path>
                      </g>
                      </mask>
                      <path
                      fill="currentColor"
                      d="M0 0h48v48H0z"
                      mask="url(#ipSApplication0)"
                      ></path>
                  </svg>
              }
              />
            </div>
          </form>
        </div>
        <div className="col-lg-6 col-md-6 col-12">
          <form>
            <div className="mb-3">
              <label className="form-label" htmlFor="formStartDate">End Date:</label><br />
              <DatePicker
                className="form-control"
                showIcon
                toggleCalendarOnIconClick
                selected={endDate} 
                onChange={(date) => setEndDate(date)}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                icon={
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 48 48"
                  >
                      <mask id="ipSApplication0">
                      <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
                          <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                          <path
                          fill="#fff"
                          d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                          ></path>
                      </g>
                      </mask>
                      <path
                      fill="currentColor"
                      d="M0 0h48v48H0z"
                      mask="url(#ipSApplication0)"
                      ></path>
                  </svg>
              }
              />
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col">
          <form>
            <div className="mb-3">
              <label className="form-label" htmlFor="formCurrency">Date range:</label><br />
              <select className="inputFee form-select" onChange={(e) => handleGetDateRange(e)}>
                <option value="">Select Range</option>
                <option>This week</option>
                <option>Last week</option>
                <option>This month</option>
                <option>Last month</option>
                <option>This year</option>
                <option>Last year</option>
              </select>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-12">
          <form>
            <label className="form-label">Suppress Accounts with no transactions:</label>
            <div className="mb-3">
              <div className="form-check form-check-inline">
                <input 
                  type="radio" 
                  className="form-check-input" 
                  name="suppress1" 
                  value="1"
                  defaultChecked={true}
                  onChange={(e) => 
                    setFormVal({
                        ...formVal,
                        suppress: e.target.value
                    })
                  }
                /> Yes
              </div>
              <div className="form-check form-check-inline">
                <input 
                  type="radio" 
                  className="form-check-input" 
                  name="suppress1" 
                  value="0" 
                  onChange={(e) => 
                    setFormVal({
                        ...formVal,
                        suppress: e.target.value
                    })
                  }
                /> No
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-6 col-md-6 col-12">
          <form>
          <label className="form-label">Include Encats:</label>
          <div className="mb-3">
          <div className="form-check form-check-inline">
                <input 
                  type="radio" 
                  className="form-check-input" 
                  name="includeEncats1" 
                  value="1"
                  onChange={(e) => 
                    setFormVal({
                        ...formVal,
                        includeEncats: e.target.value
                    })
                  }
                /> Yes
              </div>
              <div className="form-check form-check-inline">
                <input 
                  type="radio" 
                  className="form-check-input" 
                  name="includeEncats1" 
                  value="0"
                  defaultChecked={true}
                  onChange={(e) => 
                    setFormVal({
                        ...formVal,
                        includeEncats: e.target.value
                    })
                  }
                /> No
              </div>
          </div>
          </form>
        </div>
      </div>
      
      {!loading ? (
        <Button variant="dark" onClick={handleSubmit}><HiOutlineDocumentReport /> Genarate</Button>
      ) : (
        <Button variant="dark">
          <AiOutlineLoading3Quarters className="loaders m-1" />
          Loading...
        </Button>
      )}
            <hr />
            {!loading ? (
                showResult ? (
                    <Statement 
                        getAccounting={getAccounting} 
                        currency={getCurrency}
                        startDate={startDate}
                        endDate={endDate}
                        parameters={parameters}
                    />
                ) : null
                ) : null
            }  
    </div>
  );
};