import React from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

interface IProps {
  table: string;
}

const TableToExcel: React.FC<IProps> = ({ table }) => {
  return (
    <ReactHTMLTableToExcel
      id='test-table-xls-button'
      className='ui positive button'
      table={table}
      filename='exportXls'
      sheet='exportXls'
      buttonText='Export to File'
    />
  );
};
export function getCurrentDate(separator=''){

  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  
  return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
  }
export default TableToExcel;
