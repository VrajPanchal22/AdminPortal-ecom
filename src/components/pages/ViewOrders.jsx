import React, { useEffect, useState } from 'react'
import OrderTable from '../atoms/OrderTable'
import InputSelector from '../molecules/InputSelector'
import Pagination from "../molecules/Pagination";
import { Formik } from 'formik'
import Card from "../atoms/Card"
import { FetchOrders } from "../../services/Order"
import { LIMIT, ORDER_URL } from '../../constants/Constant';
import {Input} from "reactstrap";
const ViewOrders = () => {

    const [data, setData] = useState([])
    const [orderscount, setOrdersCount] = useState(0);
    const [initialValues, setInitialValues] = useState({
        status: "all"
    });
    const [search,setSearch]= useState("")
    const [filter, setFilter] = useState()
    const options = [
        { value: "all", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "hold", label: "Hold" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
        { value: "deleted", label: "Deleted" }
    ];
    useEffect(() => {
        fetchData(ORDER_URL)
    }, [filter,search]);


    async function fetchData(url, limit = 10, offset = 0) {
        if (filter === "deleted") {
            let response = await FetchOrders(url, { params: { limit: limit, offset: offset, status: filter ,search:search} })
            setData(response.data.details);
            setOrdersCount(response.data.count);
            return response;
        }
        if (filter === "all") {
            setFilter(null);
        }
        let response = await FetchOrders(url, { params: { status: filter, limit: limit, offset: offset,search:search } })
        let orders = response.data.details;
        setData(orders)
        setOrdersCount(response.data.count);
        return response
    }
    async function handlePage(event) {
        const newOffSet = event.selected * LIMIT;
        setFilter(filter)
        let newdata = await fetchData(ORDER_URL, LIMIT, newOffSet);
        setData(newdata.data.details);
        setOrdersCount(newdata.data.count);

    }
    let handleChange = (e)=>{
        setSearch(e.target.value);
    }

    return (
        <div className='mt-2 rounded border'>
            <Card heading="Update Order" />
            <div className='row ml-1'>
                <div className='col-2'>
                    <Formik initialValues={initialValues}>
                        {
                            ({ values, setFieldValue }) => {
                                return <InputSelector
                                    options={options}
                                    value={values.status}
                                    name="status"
                                    onChange={(option) => {
                                        setFieldValue('status', option.value)
                                        setFilter(option.value);
                                    }}
                                    defaultValue={{ value: values.status, label: `${values.status.charAt(0).toUpperCase() + values.status.slice(1)}` }}

                                />

                            }
                        }

                    </Formik>

                </div>
                <div className="col-6"></div>
                <div className="col-3 mt-3 p-2">
                <Input className='order-search' type='text'  placeholder="search orders by orderId" value={search} onChange={handleChange} />
                </div>
            </div>
            <div className='mt-3 mb-3 ml-3 pl-1' >Total Orders  = {orderscount}</div>
            <div className='d-flex justify-content-around align-items-center'>
                <OrderTable data={data} filter={filter} changeData={(value) => setData(value)} changeCount = {((count)=>{setOrdersCount(count)})}  search={search} />
            </div>
            <Pagination totalCount={orderscount} currentPage={0} handlePageClick={(e) => handlePage(e)} />
        </div>
    )




}



export default ViewOrders;