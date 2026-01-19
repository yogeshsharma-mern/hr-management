import CheckTable from "../tables/components/CheckTable";
import { apiGet } from "lib/api/apiFetch";
import { useQuery } from "@tanstack/react-query";
import apiPath from "lib/api/apiPath";


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

const Tables = () => {
    const { data: warehouseData, isLoading, isFetching, error, isError } = useQuery({
        queryKey: ["classes"],
        queryFn: () =>
            apiGet(apiPath.warehouseList,
            ),
    });
    console.log("warehousedata", warehouseData);
    const warehouseheader = [
        {
            Header: "NAME",
            accessor: "name",
        },

        {
            Header: "City",
            accessor: "city",
        },
        {
            Header: "State",
            accessor: "state",
        }, {
            Header: "Country",
            accessor: "country",
        }, {
            Header: "Pincode",
            accessor: "pincode",
        }, {
            Header: "Manager Name",
            accessor: "managerName",
        },
        {
            Header: "Manager Phone",
            accessor: "managerPhone",
        },
        {
            Header: "progress",
            accessor: "progress",
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
                    columnsData={warehouseheader}
                    tableData={warehouseData?.results?.docs ?? []}
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

export default Tables;
