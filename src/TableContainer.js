import React from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import { Table } from "reactstrap";
import {Filter, DefaultColumnFilter } from "./Filter";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const TableContainer = ({ columns, data }) => {
  //   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //     useTable({
  //       columns,
  //       data,
  //     });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn: { Filter: DefaultColumnFilter }
      },
      useFilters,
      useSortBy
    );

  return (
    // If you're curious what props we get as a result of calling our getter functions (getTableProps(), getRowProps())
    // Feel free to use console.log()  This will help you better understand how react table works underhood.
    <Table {...getTableProps()}>
      <thead className="position-sticky bg-white" style={{ top: 0, zIndex: 10}}>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                <div {...column.getSortByToggleProps()}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <ArrowDropDownIcon fontSize="small" />
                        : <ArrowDropUpIcon fontSize='small' />
                      : ''}
                  </span>
                </div>
                <Filter column={column} />
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TableContainer;
