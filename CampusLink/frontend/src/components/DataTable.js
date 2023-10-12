import React, { useMemo } from "react";
import "./styles/DataTable.css";
import {useTable} from "react-table";

const DataTable = ({userdata}) => {
    //So that it works with whatever we end up using, this literally just takes in json data
    const data = React.useMemo(() => userdata, []);
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

      ],
      []
    );
    const tableInstance = useTable({ 
        columns,
        data
    })
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = 
    tableInstance

    return (
        <div className="container">
            <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>  
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                      prepareRow(row)
                      return (
                          <tr {...row.getRowProps()}>
                              {row.cells.map((cell) => (
                                  <td {...cell.getCellProps()}> {cell.render("Cell")}</td>
                              ))}
                          </tr>
                      );
                  })}
                </tbody>
            </table>
        </div>
    );

}

export default DataTable;