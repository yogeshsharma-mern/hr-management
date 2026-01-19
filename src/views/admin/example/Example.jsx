import CheckTable from "../tables/components/CheckTable";

import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "../tables/variables/columnsData.js";
import tableDataDevelopment from "../tables/variables/tableDataDevelopment.json";
import tableDataCheck from "../tables/variables/tableDataCheck.json";
import tableDataColumns from "../tables/variables/tableDataColumns.json";
import tableDataComplex from "../tables/variables/tableDataComplex.json";
import DevelopmentTable from "../tables/components/DevelopmentTable";
import ColumnsTable from "../tables/components/ColumnsTable";
import ComplexTable from "../tables/components/ComplexTable";

const Tables = () => {
  return (
    <div>
      <div className="mt-5 grid  grid-cols-1 gap-5 ">
        {/* <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        /> */}
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
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
