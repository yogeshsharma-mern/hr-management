import React from 'react'
import ReusableTable from '../../components/reuseable/ReuseableTable.jsx';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { FaEye, FaUserEdit } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { TbEditCircle } from 'react-icons/tb';
import { Link } from 'react-router-dom';

// import { Cell } from 'recharts';

const columns = [{
    header: 'Candidate Name',
    accessorKey: 'candidateName',
},
{
    header: 'Position Applied',
    accessorKey: 'positionApplied',
},
{
    header: 'Experience',
    accessorKey: 'experience',
},
{
    header: 'Email',
    accessorKey: 'email',
},
{
    header: 'Phone',
    accessorKey: 'phone',
},
{
    header: 'Applied Date',
    accessorKey: 'appliedDate',
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
    cell: () => {
        return (
            <div className='flex items-center gap-2'>
                <Link to="/hr/candidates/add">
                    <MdAdd className='cursor-pointer' />
                </Link>
                <FaEye className='cursor-pointer' />
                <TbEditCircle className='cursor-pointer' />

                <MdDelete className='cursor-pointer' />

            </div>
        )
    }
}
];
// Position	Department	Location	Openings	Posted Date	Status	Actions
const data = [
    {
        candidateName: 'Yogesh',
        positionApplied: 'Software Engineer',
        experience: '5 years',
        email: 'yogesh@example.com',
        phone: '+91 9876543210',
        appliedDate: '2023-10-01',
    },
    {
        candidateName: 'Rahul',
        positionApplied: 'Product Manager',
        experience: '7 years',
        email: 'rahul@example.com',
        phone: '+91 9876543211',
        appliedDate: '2023-09-15',
    },
    {
        candidateName: 'kishore',
        positionApplied: 'UX Designer',
        experience: '3 years',
        email: 'kishore@example.com',
        phone: '+91 9876543212',
        appliedDate: '2023-09-20',
    },
];
export default function Candidates() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    return (
        <div>
            <ReusableTable columns={columns} data={data} paginationState={pagination} setPaginationState={setPagination} />
        </div>
    )
}
