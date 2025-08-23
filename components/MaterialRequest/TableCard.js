'use client';
import React from 'react';
import Image from 'next/image';
import { Avatar } from '@mui/material';
import { stringAvatar } from '../../helpers/StringAvatar';
import { MdEdit } from 'react-icons/md';
import { FaListCheck } from 'react-icons/fa6';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

const Badge = ({ text, type }) => {
  const colors = {
    priority: {
      High: 'bg-red-100 text-red-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      Low: 'bg-green-100 text-green-700',
    },
    status: {
      Pending: 'bg-yellow-100 text-yellow-700',
      Partial: 'bg-violet-100 text-violet-700',
      'Partially received': 'bg-violet-100 text-violet-700',
      Approved: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
      Completed: 'bg-blue-100 text-blue-700',
    },
  };

  return (
    <span
      className={clsx(
        'px-2 py-1 text-xs font-semibold rounded-md',
        colors[type]?.[text] || 'bg-gray-100 text-gray-700'
      )}
    >
      {text}
    </span>
  );
};

const capitalizeFirst = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = date =>
  date
    ? new Date(date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

const TableCard = ({ item, mappedMaterials }) => {
  const router = useRouter();
  return (
    <div
      key={item._id}
      className="border rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow"
    >
      {/* Request Header */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4 -md:mb-0">
          <div>
            <p className="font-semibold text-lg">
              Order ID: {item._id.slice(0, 8)}
            </p>
            <p className="text-sm text-gray-600">
              Status:{' '}
              <Badge
                type="status"
                text={item?.status ? capitalizeFirst(item.status) : 'N/A'}
              />
            </p>
          </div>
          <div className="flex justify-between items-center gap-2 -md:flex-col -md:[&_span]:hidden">
            <button
              className="ml-auto bg-secondary text-primary px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity"
              onClick={e => {
                e.stopPropagation();
                router.push(
                  `/admin/materialrequest/receivematerials/${item._id}`
                );
              }}
            >
              <FaListCheck />
              <span>Receive Materials</span>
            </button>
            <button
              className="ml-auto bg-secondary text-primary px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity"
              onClick={e => {
                e.stopPropagation();
                router.push(`/admin/materialrequest/${item._id}`);
              }}
            >
              <MdEdit />

              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Request Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-semibold">Site:</span>{' '}
              {item.site?.siteID || 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Purpose:</span>{' '}
              {item.purpose || 'N/A'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="flex flex-row gap-2 items-center">
              <span className="font-semibold">Requested By:</span>{' '}
              <span className="flex items-center gap-2">
                {item?.requestedBy?.profileImage ? (
                  <Image
                    src={item.requestedBy.profileImage}
                    height={32}
                    width={32}
                    className="object-cover rounded-full"
                    alt="Requester profile"
                  />
                ) : (
                  <Avatar
                    {...stringAvatar(
                      `${item?.requestedBy?.firstname || ''} ${
                        item?.requestedBy?.lastname || ''
                      }`
                    )}
                  />
                )}
                <span className="text-sm">
                  {item?.requestedBy?.firstname} {item?.requestedBy?.lastname}
                </span>
              </span>
            </p>
            <p>
              <span className="font-semibold">Priority:</span>{' '}
              <Badge
                type="priority"
                text={item?.priority ? capitalizeFirst(item.priority) : 'N/A'}
              />
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-semibold">Requested On:</span>{' '}
              {formatDate(item.createdAt)}
            </p>
            <p>
              <span className="font-semibold">Required Before:</span>{' '}
              {formatDate(item.requiredBefore)}
            </p>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <div className="border-t bg-white p-4 rounded-b-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-sm font-medium">
                <th className="py-2 px-3">Material Name</th>
                <th className="py-2 px-3">Quantity</th>
                <th className="py-2 px-3">Received Qty</th>
                <th className="py-2 px-3">Received By</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Remarks</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            {mappedMaterials.length > 0 ? (
              <tbody className="text-sm w-full">
                {mappedMaterials.map((row, index) => (
                  <React.Fragment key={row.order._id || index}>
                    {/* Main Ordered Material Row */}
                    <tr className="border-b bg-gray-50">
                      <td className="py-2 px-3 font-medium">
                        {row.order.material?.name || 'N/A'}
                      </td>
                      <td className="py-2 px-3">
                        {row.order.quantity} {row.order.unit}
                      </td>
                      <td className="py-2 px-3">
                        {row.totalReceivedQty} {row.order.unit}
                      </td>
                      <td className="py-2 px-3">—</td>
                      <td className="py-2 px-3">—</td>
                      <td className="py-2 px-3">—</td>
                      <td className="py-2 px-3">
                        <Badge type="status" text={row.status} />
                      </td>
                    </tr>

                    {/* Sub-rows for receipts */}
                    {row.received.length > 0 ? (
                      row.received.map((rec, rIndex) => (
                        <tr
                          key={rec._id || rIndex}
                          className="border-b text-gray-600 bg-gray-50/40"
                        >
                          <td className="py-2 px-3 pl-8">↳ Received</td>
                          <td className="py-2 px-3">—</td>
                          <td className="py-2 px-3">
                            {rec.quantity} {rec.unit}
                          </td>
                          <td className="py-2 px-3">
                            {rec.receivedBy?.firstname}{' '}
                            {rec.receivedBy?.lastname}
                          </td>
                          <td className="py-2 px-3">
                            {formatDate(rec.receivedAt)}
                          </td>
                          <td className="py-2 px-3">{rec.remarks || 'N/A'}</td>
                          <td className="py-2 px-3">—</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b text-gray-500">
                        <td className="py-2 px-3 pl-8" colSpan={7}>
                          No materials received yet
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={7} className="text-center py-3 text-gray-500">
                    No materials found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableCard;
