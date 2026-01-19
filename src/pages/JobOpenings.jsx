import React from 'react'
import ReusableTable from '../components/reuseable/ReuseableTable.jsx';
import { useState } from 'react';
// import { Cell } from 'recharts';

const columns = [{
    header: 'Position',
    accessorKey: 'position',
},
{
    header: 'Department',
    accessorKey: 'department',
},
{
    header: 'Location',
    accessorKey: 'location',
},
{
    header: 'Openings',
    accessorKey: 'openings',
},
{
    header: 'Posted Date',
    accessorKey: 'postedDate',
},
{
    header: 'Status',
    accessorKey: 'status',
    cell: () => {
        return (


            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-[12px]">
                Open
            </span>
        )
    }

},

{
    header: 'Actions',
    accessorKey: 'actions',
}
];
// Position	Department	Location	Openings	Posted Date	Status	Actions
const data = [
    {
        position: 'Software Engineer',
        department: 'Engineering',
        location: 'Mumabi',
        openings: "5",
        employmentType: 'Full-time',
        postedDate: '2023-10-01',
    },
    {
        position: 'Product Manager',
        department: 'Product',
        location: 'Jaipur',
        openings: "2",
        employmentType: 'Full-time',
        postedDate: '2023-09-15',
    },
    {
        position: 'UX Designer',
        department: 'Design',
        location: 'Remote',
        openings: "3",
        employmentType: 'Contract',
        postedDate: '2023-09-20',
    },
];
export default function JobOpenings() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    return (
        <div>
            <ReusableTable columns={columns} data={data} paginationState={pagination} setPaginationState={setPagination} />
        </div>
    )
}
