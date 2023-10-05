import React from "react";
import "./styles/DataTable.css";
import {useTable} from "react-table";

function Table({ columns, data }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = 
    useTable({columns, data});
}

const DataTable = ({userdata}) => {
    //when API is implemented, this is where you fetch
    const data = React.useMemo(() => {userdata}, []);
    const columns = React.useMemo(() => [  
        {
            Header: "Profile Picture",
            accessor: "profpic",
        }, 
        {
            Header: "First Name",
            accessor: "first_name"
        },
        {
            Header: "Last Name",
            accessor: "last_name"
        }

    ]);

    return (
        <div>
            < Table columns={columns} data={data} />
            <h1>hi</h1>
        </div>
    );

}

export default DataTable;