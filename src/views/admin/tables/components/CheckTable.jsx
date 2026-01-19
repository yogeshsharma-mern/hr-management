// import React from "react";
// import CardMenu from "components/card/CardMenu";
// import Checkbox from "components/checkbox";
// import Card from "components/card";

// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// function CheckTable(props) {
//   const { tableData } = props;
//   const [sorting, setSorting] = React.useState([]);
//   let defaultData = tableData ?? [];
//   const columns = [
//     columnHelper.accessor("name", {
//       id: "name",
//       header: () => (
//         <p className="text-sm font-bold text-gray-600 dark:text-white">NAME</p>
//       ),
//       cell: (info) => (
//         <div className="flex items-center">
//           <Checkbox
//             defaultChecked={info.getValue()[1]}
//             colorScheme="brandScheme"
//             me="10px"
//           />
//           <p className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
//             {info.getValue()[0]}
//           </p>
//         </div>
//       ),
//     }),
//     columnHelper.accessor("progress", {
//       id: "progress",
//       header: () => (
//         <p className="text-sm font-bold text-gray-600 dark:text-white">
//           PROGRESS
//         </p>
//       ),
//       cell: (info) => (
//         <p className="text-sm font-bold text-navy-700 dark:text-white">
//           {info.getValue()}
//         </p>
//       ),
//     }),
//     columnHelper.accessor("quantity", {
//       id: "quantity",
//       header: () => (
//         <p className="text-sm font-bold text-gray-600 dark:text-white">
//           QUANTITY
//         </p>
//       ),
//       cell: (info) => (
//         <p className="text-sm font-bold text-navy-700 dark:text-white">
//           {info.getValue()}
//         </p>
//       ),
//     }),
//     columnHelper.accessor("date", {
//       id: "date",
//       header: () => (
//         <p className="text-sm font-bold text-gray-600 dark:text-white">DATE</p>
//       ),
//       cell: (info) => (
//         <p className="text-sm font-bold text-navy-700 dark:text-white">
//           {info.getValue()}
//         </p>
//       ),
//     }),
//   ]; // eslint-disable-next-line
// const [data, setData] = React.useState(() => [...defaultData]);
//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//     },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     debugTable: true,
//   });
//   return (
//     <Card extra={"w-full h-full sm:overflow-auto px-6"}>
//       <header className="relative flex items-center justify-between pt-4">
//         <div className="text-xl font-bold text-navy-700 dark:text-white">
//           Check Table
//         </div>

//         <CardMenu />
//       </header>

//       <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
//         <table className="w-full">
//           <thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id} className="!border-px !border-gray-400">
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <th
//                       key={header.id}
//                       colSpan={header.colSpan}
//                       onClick={header.column.getToggleSortingHandler()}
//                       className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
//                     >
//                       <div className="items-center justify-between text-xs text-gray-200">
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                         {{
//                           asc: "",
//                           desc: "",
//                         }[header.column.getIsSorted()] ?? null}
//                       </div>
//                     </th>
//                   );
//                 })}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table
//               .getRowModel()
//               .rows.slice(0, 10)
//               .map((row) => {
//                 return (
//                   <tr key={row.id}>
//                     {row.getVisibleCells().map((cell) => {
//                       return (
//                         <td
//                           key={cell.id}
//                           className="min-w-[150px] border-white/0 py-3  pr-4"
//                         >
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// }

// export default CheckTable;
// const columnHelper = createColumnHelper();
import React from "react";
import CardMenu from "components/card/CardMenu";
import Checkbox from "components/checkbox";
import Card from "components/card";
import Progress from "components/progress";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function CheckTable(props) {
  const { tableData = [], columnsData } = props;

  const [sorting, setSorting] = React.useState([]);
  const [data, setData] = React.useState(tableData);

  // ✅ IMPORTANT: update table when API data changes
  React.useEffect(() => {
    setData(tableData);
  }, [tableData]);

  // ✅ If columns are NOT passed, use your DEFAULT UI columns
  // const columns = React.useMemo(() => {
  //   if (columnsData?.length) {
  //     return columnsData.map((col) =>
  //       columnHelper.accessor(col.accessor, {
  //         header: () => (
  //           <p className="text-sm font-bold text-gray-600 dark:text-white">
  //             {col.Header}
  //           </p>
  //         ),
  //         cell: col.cell
  //           ? (info) => col.cell(info.getValue(), info.row.original)
  //           : (info) => (
  //               <p className="text-sm font-bold text-navy-700 dark:text-white">
  //                 {info.getValue()}
  //               </p>
  //             ),
  //       }),  columnHelper.accessor("progress", {
  //             id: "progress",
  //             header: () => (
  //               <p className="text-sm font-bold text-gray-600 dark:text-white">
  //                 PROGRESS
  //               </p>
  //             ),
  //             cell: (info) => (
  //               <div className="flex items-center">
  //                 <Progress width="w-[108px]" value={info.getValue()} />
  //               </div>
  //             ),
  //           }),
  //     );
  //   }

  //   // ✅ YOUR ORIGINAL UI COLUMNS (UNCHANGED)
  //   return [
  //     columnHelper.accessor("name", {
  //       id: "name",
  //       header: () => (
  //         <p className="text-sm font-bold text-gray-600 dark:text-white">
  //           NAME
  //         </p>
  //       ),
  //       cell: (info) => (
  //         <div className="flex items-center">
  //           <Checkbox
  //             defaultChecked={info.getValue()?.[1]}
  //             colorScheme="brandScheme"
  //             me="10px"
  //           />
  //           <p className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
  //             {info.getValue()?.[0] ?? info.getValue()}
  //           </p>
  //         </div>
  //       ),
  //     }),

  //     columnHelper.accessor("progress", {
  //       id: "progress",
  //       header: () => (
  //         <p className="text-sm font-bold text-gray-600 dark:text-white">
  //           PROGRESS
  //         </p>
  //       ),
  //       cell: (info) => (
  //         <p className="text-sm font-bold text-navy-700 dark:text-white">
  //           {info.getValue()}
  //         </p>
  //       ),
  //     }),

  //     columnHelper.accessor("quantity", {
  //       id: "quantity",
  //       header: () => (
  //         <p className="text-sm font-bold text-gray-600 dark:text-white">
  //           QUANTITY
  //         </p>
  //       ),
  //       cell: (info) => (
  //         <p className="text-sm font-bold text-navy-700 dark:text-white">
  //           {info.getValue()}
  //         </p>
  //       ),
  //     }),

  //     columnHelper.accessor("date", {
  //       id: "date",
  //       header: () => (
  //         <p className="text-sm font-bold text-gray-600 dark:text-white">
  //           DATE
  //         </p>
  //       ),
  //       cell: (info) => (
  //         <p className="text-sm font-bold text-navy-700 dark:text-white">
  //           {info.getValue()}
  //         </p>
  //       ),
  //     }),
  //   ];
  // }, [columnsData]);
const columns = React.useMemo(() => {
  if (columnsData?.length) {
    return columnsData.map((col) =>
      columnHelper.accessor(col.accessor, {
        header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            {col.Header}
          </p>
        ),
        cell: col.cell
          ? (info) => col.cell(info.getValue(), info.row.original)
          : (info) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
      })
    ).concat([
      // ✅ ADD progress column separately
      columnHelper.accessor("progress", {
        id: "progress",
        header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            PROGRESS
          </p>
        ),
        cell: (info) => (
          <div className="flex items-center">
            <Progress width="w-[108px]" value={info.getValue()} />
          </div>
        ),
      }),
    ]);
  }

  // fallback (unchanged)
  return [ /* your original default columns */ ];
}, [columnsData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Check Table
        </div>
        <CardMenu />
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                  >
                    <div className="items-center justify-between text-xs text-gray-200">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.slice(0, 10).map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="min-w-[150px] border-white/0 py-3 pr-4"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default CheckTable;
