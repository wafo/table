import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import locales from './locales.json';
import Table from './table';
import TableControls from './tableControls.js';
import './styles.css';

const LocalTable = ({
  // Table props
  columns, rows: propsRows, tableClass, configTable, noRowsMessage,
  // LocalTable props
  tableWrapperClass, updateTable, locale
}) => {
  const [baseRows, setBaseRows] = useState([]);
  const [size, setSize] = useState('10');
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [search, setSearch] = useState('');

  // Base rows for filters or ordering
  // TODO: do the ordering here
  // TODO: optional filtering function
  useEffect(() => {
    let filteredRows = propsRows;
    if (search) {
      filteredRows = propsRows.filter((row) => {
        let passes = false;
        Object.keys(row).forEach((key) => {
          if (passes) { return; }
          // TODO: add cases as needed || custom search function as param.
          switch (typeof row[key]) {
            case 'string':
              if (row[key].toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                passes = true;
              }
              break;
            case 'number':
              if (row[key].toString().indexOf(search) !== -1) {
                passes = true;
              }
              break;
            default:
              break;
          }
        });
        return passes;
      });
    }
    setBaseRows(filteredRows);
    setPage(1);
  }, [propsRows, search]);

  // Rows to display
  useEffect(() => {
    const newRows = baseRows.slice((size * (page - 1)), (size * page));
    setRows(newRows);
  }, [baseRows, size, page]);

  // Generate pagination
  useEffect(() => {
    let pagesNumber = Math.ceil(baseRows.length / size);
    const pages = [];
    for (let i = (page - 3); i <= (page + 3); i++) {
      if (i > 0 && i <= pagesNumber) {
        pages.push(i);
      }
    }
    setPages(pages);
  }, [page, baseRows.length, size]);

  function onSizeChange(event) {
    const { target: { value } } = event;
    setSize(value);
  }

  function onSearchChange(event) {
    const { target: { value } } = event;
    setSearch(value);
  }

  function pageChange(value) {
    let newPage = value;
    if (value === 'prev') {
      newPage = (page - 1);
    } else if (value === 'next') {
      newPage = (page + 1);
    }
    setPage(newPage);
  }

  function orderByColumn(columnIndex) {
    console.log(columnIndex);
  }

  return (
    <div className={tableWrapperClass}>
      <TableControls
        size={size}
        onSizeChange={onSizeChange}
        search={search}
        onSearchChange={onSearchChange}
        locale={locale}
        updateTable={updateTable}
      />
      <Table
        columns={columns}
        rows={rows}
        tableClass={tableClass}
        configTable={configTable}
        noRowsMessage={noRowsMessage ? noRowsMessage : locales[locale]['table-noentries']}
        headerClick={orderByColumn}
      />
      {/** Pagination */}
      {(baseRows.length > 0) && (
        <div className="pagination-wrapper">
          <p className="description">
            {`
              ${locales[locale]['table-pagination-desc-1']} 
              ${(page - 1) * size + 1} 
              ${locales[locale]['table-pagination-desc-2']} 
              ${page * size} ${locales[locale]['table-pagination-desc-3']} 
              ${baseRows.length} 
              ${locales[locale]['table-pagination-desc-4']}
            `}
          </p>
          <nav>
            <ul className="pagination pagination-sm">
              <li className="page-item">
                <button type="button" className="page-link" disabled={page === 1}
                  onClick={() => { pageChange('prev'); }}>
                  {locales[locale]['table-pagination-prev']}
                </button>
              </li>
              {pages.map((btn, index) => (
                <li key={index} className={(btn === page) ? 'page-item active' : 'page-item'}>
                  <button type="button" className="page-link" onClick={() => { pageChange(btn); }}>{btn}</button>
                </li>
              ))}
              <li className="page-item">
                <button type="button" className="page-link" disabled={page === Math.ceil(baseRows.length / size)}
                  onClick={() => { pageChange('next'); }}>
                  {locales[locale]['table-pagination-next']}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

LocalTable.propTypes = {
  // Table props
  columns: PropTypes.array,
  rows: PropTypes.array,
  tableClass: PropTypes.string,
  configTable: PropTypes.any,
  noRowsMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  // LocalTable props
  tableWrapperClass: PropTypes.string,
  updateTable: PropTypes.func,
  locale: PropTypes.string,
};

LocalTable.defaultProps = {
  // Table props
  columns: [],
  rows: [],
  tableClass: 'table',
  configTable: {},
  // LocalTable props
  tableWrapperClass: 'table-wrapper',
  updateTable: f => f,
  locale: 'en',
};

export default LocalTable;