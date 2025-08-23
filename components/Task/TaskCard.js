'use client';
import Avatar from '@mui/material/Avatar';
import { SlCalender } from 'react-icons/sl';
import { IoIosPricetag, IoIosFlag } from 'react-icons/io';
import { FiRepeat } from 'react-icons/fi';
import { BsHouse } from 'react-icons/bs';
import { FaRegCircle } from 'react-icons/fa';
import { FaCircleCheck, FaCircle } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaExclamationCircle, FaUserCircle } from 'react-icons/fa';
import { stringAvatar } from '../../helpers/StringAvatar';

const statusIcon = status => {
  switch (status) {
    case 'Complete':
      return <FaCircleCheck className="text-primary" />;
    case 'Pending':
      return <FaCircle className="text-primary" />;
    case 'In Progress':
      return <AiOutlineLoading3Quarters className="text-primary" />;
    case 'Overdue':
      return <FaExclamationCircle className="text-primary" />;
    default:
      return <FaRegCircle className="text-primary" />;
  }
};

const TaskCard = ({ item, onClick }) => {
  return (
    <div
      className="bg-white w-full rounded-2xl p-8 flex flex-row justify-between shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-row gap-4">
        <span className="h-20 rounded-full w-1 bg-primary" />
        <div className="flex flex-col [&_span]:leading-7 font-ubuntu text-base text-[#565656]">
          <div>
            <span className="font-semibold text-sm flex flex-row gap-2 items-center">
              <Avatar {...stringAvatar('ThikedaarDotCom')} />
              {item.issueMember?.firstname}
            </span>
            <span className="text-lg font-bold">{item.title}</span>
          </div>

          {item.issueMember?.firstname === 'ThikedaarDotCom' ? (
            <span className="font-semibold text-sm">Admin</span>
          ) : (
            <div className="flex flex-row gap-4 items-center flex-wrap">
              <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                <FaUserCircle className="text-primary" />
                <p>
                  {item.assignedBy?.firstname === 'ThikedaarDotCom'
                    ? 'Admin'
                    : item.assignedBy?.firstname}
                </p>
              </span>
              <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                <SlCalender className="text-primary" />
                <p>
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : '-'}
                </p>
              </span>
              <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                {statusIcon(item.status)}
                <p>{item.status}</p>
              </span>
              <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                <IoIosPricetag className="text-primary" />
                <p>{item.category}</p>
              </span>
              {item.category === 'Project' && (
                <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                  <BsHouse className="text-primary" />
                  <p>{item.siteID}</p>
                </span>
              )}
              <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                <IoIosFlag className="text-primary" />
                <p>{item.priority}</p>
              </span>
              <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                <FiRepeat className="text-primary" />
                <p>{item?.repeat?.repeatType}</p>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
