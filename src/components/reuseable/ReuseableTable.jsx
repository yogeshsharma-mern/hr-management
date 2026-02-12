
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Box,
  CircularProgress,
} from "@mui/material";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import { useSelector } from "react-redux";
export default function ReusableTable({
  columns,
  data,
  paginationState,
  setPaginationState,
  sortingState,
  setSortingState,
  globalFilter,
  setGlobalFilter,
  columnFilters,
  setColumnFilters,
  totalCount,
  tablePlaceholder,
  error,
  isError,
  fetching,
  loading
}) {

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount),
    manualPagination: true,
    state: {
      pagination: paginationState,
      sorting: sortingState,
      columnFilters,
      globalFilter,
    },
    onPaginationChange: setPaginationState,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  return (
    <div className={`bg-[var(--bg-surface)] text-[14px] w-[99vw] lg:w-[81vw] overflow-auto  shadow-lg border border-[var(--border-color)] p-4 overflow-auto ${collapsed ? 'lg:w-[94vw]' : ':w-[81vw]'}`}>

      {/* Header with search and actions */}
      {/* <div className="flex flex-col md:flex-row  justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            value={globalFilter || ""}
            onChange={(e) => {
              const sanitizedValue = e.target.value.replace(/[^A-Za-z0-9\s]/g, "");
              setGlobalFilter(sanitizedValue);
            }}
            placeholder={tablePlaceholder || "Search..."}
            className="pl-10 pr-4 py-3 w-full border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-[var(--border-color)] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <FaFilter />
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2">
            <FaDownload />
            <span>Export</span>
          </button>
        </div>
      </div> */}

      {/* Error Message */}
      {isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error?.message || "Something went wrong while fetching data."}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Table Container with Loader */}
      <div className="relative rounded-xl text-[12px] border border-[var(--border-color)] overflow-hidden">
        {/* Loader Overlay */}
        {(loading || fetching) && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface)] bg-opacity-90 z-50 rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading data...</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y text-[12px] divide-[var(--border-color)]">
            <thead className="bg-[--bg-surface]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-6 py-4 text-left text-[10px] font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors group"
                    >
                      <div className="flex items-center space-x-2">
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        <span className="text-gray-400">
                          {header.column.getIsSorted() === 'asc' ? (
                            <FaSortUp className="text-blue-600" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <FaSortDown className="text-blue-600" />
                          ) : (
                            <FaSort className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-[var(--bg-surface)] divide-y divide-[var(--border-color)]">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={` transition-all duration-200 ${index % 2 === 0 ? 'bg-[var(--bg-surface)]' : 'bg-[var(--bg-surface)]'
                      }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-3 whitespace-nowrap text-[12px] text-[var(--text-primary)]
"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[var(--text-primary)]
">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium text-[var(--text-primary)]
">No data found</p>
                      <p className="text-gray-600 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
          <span>Showing</span>
          <span className="font-semibold">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span>
          <span>to</span>
          <span className="font-semibold">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              totalCount
            )}
          </span>
          <span>of</span>
          <span className="font-semibold">{totalCount}</span>
          <span>results</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--text-secondary)]">Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[5,10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setPaginationState((old) => ({ ...old, pageIndex: old.pageIndex - 1 }))
              }
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                const pageIndex = Math.max(
                  0,
                  Math.min(
                    table.getPageCount() - 5,
                    table.getState().pagination.pageIndex - 2
                  )
                ) + i;

                if (pageIndex >= table.getPageCount()) return null;

                return (
                  <button
                    key={pageIndex}
                    onClick={() =>
                      setPaginationState((old) => ({ ...old, pageIndex }))
                    }
                    className={`w-10 h-10 rounded-lg text-sm  font-medium transition-all ${table.getState().pagination.pageIndex === pageIndex
                        ? 'bg-blue-600 text-[var(--text-primary)] border-transparent'
                        : 'border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-gray-50'
                      }`}
                  >
                    {pageIndex + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setPaginationState((old) => ({ ...old, pageIndex: old.pageIndex + 1 }))
              }
              disabled={!table.getCanNextPage()}
              className="p-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm text-[var(--text-secondary)]">
            Page <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span>
            <span className="mx-1">of</span>
            <span className="font-semibold">{table.getPageCount()}</span>
          </div>
        </div>
      </div>

      {/* Table Stats */}
      {/* <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaEye className="text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]
">{totalCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FaFilter className="text-emerald-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtered</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]
">
                  {table.getRowModel().rows.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FaSort className="text-amber-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sorted By</p>
                <p className="text-lg font-semibold text-[var(--text-primary)]
">
                  {sortingState?.length > 0
                    ? sortingState?.map(s => s.id).join(', ')
                    : 'None'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}