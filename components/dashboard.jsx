import { useState, useEffect } from 'react';
import moment from 'moment';
import useSWR from 'swr'

const col = {
    width: '50%',
    float: 'left',
    boxSizing: 'border-box',
    padding: '5px'
}
const item = {
    width: '100%',
}
const input = {
    padding: '5px',
    fontSize: '1.2em'
}


export const optionsUsersQuantity = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Usuários por dia',
      },
    },
};


const fetcher = (...args) => fetch(...args).then(res => res.json())

const Dashboard = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectDate, setSelectDate] = useState("7");
    const { data: dataUsersQuantity } = useSWR(`http://localhost:3000/dashboard/users/quantity?start_date=${startDate}&end_date=${endDate}&select_date=${selectDate}`, fetcher)
    const { data: ordersByProduct } = useSWR(`http://localhost:3000/dashboard/orders/by-product?start_date=${startDate}&end_date=${endDate}&select_date=${selectDate}`, fetcher)
    const { data: dataCategories } = useSWR(`http://localhost:3000/dashboard/categories/best-sellers?start_date=${startDate}&end_date=${endDate}&select_date=${selectDate}`, fetcher)

    useEffect(() => {
        if(selectDate !== 'custom'){
            setStartDate("");
            setEndDate("");
        }
    }, [selectDate])

    return <div className={'container-fluid'}>
                <div style={{
                    display: 'block',
                    textAlign: 'right',
                    padding: '15px',
                    boxSizing: 'border-box'
                }}>
                    <input
                        disabled={selectDate!=="custom"}
                        value={startDate}
                        type="date" 
                        style={input}
                        max={endDate !== "" ? endDate : moment().format('YYYY-MM-DD')}
                        onChange={(event) => setStartDate(event.target.value)}/>
                    <input
                        disabled={selectDate!=="custom"}
                        value={endDate}
                        type="date" 
                        style={input}
                        min={startDate !== "" ? startDate : null}
                        max={moment().format('YYYY-MM-DD')}
                        onChange={(event) => setEndDate(event.target.value)}/>
                    <select
                        style={input}
                        onChange={(event) => setSelectDate(event.target.value)}
                        >
                        <option value="all">Tudo</option>
                        <option value="7" selected>7 dias</option>
                        <option value="15">15 dias</option>
                        <option value="30">1 mês</option>
                        <option value="180">6 meses</option>
                        <option value="365">1 ano</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div>
                    <div style={col}>
                        <div style={item}>
                        { ordersByProduct ?
                             <Pie 
                                width={300}
                                height={300}
                                data={ordersByProduct}
                                options={{
                                    maintainAspectRatio: false
                                }} />
                            : "Não existem dados para esse dashboard." }
                        </div>
                    </div>
                    <div style={col}>
                        <div style={item}>
                        { dataCategories ?
                             <Radar 
                                width={400}
                                height={400}
                                data={dataCategories}
                                options={{
                                    maintainAspectRatio: false
                                }}
                            />
                            : "Não existem dados para esse dashboard." }
                        </div>
                    </div>
                    <div style={{
                        ...col,
                        width: '100%'
                    }}>
                        <div style={item}>
                            { dataUsersQuantity ?
                            <Bar 
                                options={optionsUsersQuantity} data={dataUsersQuantity} /> 
                            : "Não existem dados para esse dashboard." }
                        </div>
                    </div>
                    {/* <div style={col}>
                        <div style={item}>4</div>
                    </div> */}
                </div>
            </div>
}

export default Dashboard;