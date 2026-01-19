import CheckTable from "../tables/components/CheckTable";
import { apiGet } from "lib/api/apiFetch";
import { useQuery } from "@tanstack/react-query";
import apiPath from "lib/api/apiPath";
import { RiImageEditLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";



// import {
//   columnsDataDevelopment,
//   columnsDataCheck,
//   columnsDataColumns,
//   columnsDataComplex,
// } from "../tables/variables/columnsData.js";
import tableDataDevelopment from "../tables/variables/tableDataDevelopment.json";
// import tableDataCheck from "../tables/variables/tableDataCheck.json";
import tableDataColumns from "../tables/variables/tableDataColumns.json";
import tableDataComplex from "../tables/variables/tableDataComplex.json";
import DevelopmentTable from "../tables/components/DevelopmentTable";
import ColumnsTable from "../tables/components/ColumnsTable";
import ComplexTable from "../tables/components/ComplexTable";

const ProductTable = () => {
    const { data: productData, isLoading, isFetching, error, isError } = useQuery({
        queryKey: ["products"],
        queryFn: () =>
            apiGet(apiPath.productList,
            ),
    });
    console.log("producctdata", productData);
    const productsheader = [
        {
            Header: "Image",
            accessor: "image",
            cell: (_, row) => {
                console.log("row", row);
                return (
                    <img src={row?.images?.[0]} alt="productImage" className="h-10 w-10 rounded object-cover" />
                )
            }


        },
        {
            Header: "Title",
            accessor: "title",
        },

        {
            Header: "Slug",
            accessor: "slug",
        },
        {
            Header: "Price",
            accessor: "price",
        }, {
            Header: "Type",
            accessor: "type",
        }, {
            Header: "Status",
            accessor: "status",
        },
        {
            Header: "Actions",
            accessor: "actions",
            cell: (_, row) => (
                <div className="flex gap-2 ">
                    {/* <button
          className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded"
          onClick={() => console.log("Edit:", row)}
        >
          Edit
        </button> */}
                    <div className="cursor-pointer">
                        <RiImageEditLine className="text-blue-500" />
                    </div>
                    {/* <button
          className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded"
          onClick={() => console.log("Delete:", row)}
        >
          Delete
        </button> */}
                    <div className="cursor-pointer">
                        <MdDelete className="text-red-500" />

                    </div>
                </div>
            ),
        },


    ];
    return (
        <div>
            <div className="mt-5 grid  grid-cols-1 gap-5 ">
                {/* <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        /> */}
                <CheckTable
                    columnsData={productsheader}
                    tableData={productData?.results?.docs ?? []}
                />


            </div>

            {/* <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        />

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
      </div> */}
        </div>
    );
};

export default ProductTable;
