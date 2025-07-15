import { SlCalender } from 'react-icons/sl';
import { IoIosPricetag } from 'react-icons/io';
import { IoIosFlag } from 'react-icons/io';
import { FiRepeat } from 'react-icons/fi';
import { FaRegCircle } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { FaCircle } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaExclamationCircle } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import Avatar from '@mui/material/Avatar';

const stringToColor = string => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const stringAvatar = name => {
  const splitName = name.split(' ');
  const initials = splitName
    .map(n => n[0])
    .join('')
    .toUpperCase();
  const firstLetter = splitName[0][0].toUpperCase();
  const secondLetter = splitName[1] ? splitName[1][0].toUpperCase() : '';
  const initialsColor = stringToColor(initials);
  return {
    sx: {
      height: '24px',
      width: '24px',
      fontSize: '12px',
      fontWeight: '400',
      bgcolor: initialsColor,
    },
    children: `${firstLetter}${secondLetter}`,
  };
};

const TaskCard = ({ item, onClick }) => (
  <div
    className="bg-white w-full rounded-2xl p-8 flex flex-row justify-between shadow-md cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-row gap-4">
      <span className="h-20 rounded-full w-1 bg-primary" />
      <div className="flex flex-col [&_span]:leading-7 font-ubuntu text-base text-[#565656]">
        <div>
          <span className="font-semibold text-sm flex flex-row gap-2 items-center">
            <Avatar
              {...stringAvatar(
                `${item.issueMember?.firstname} ${item.issueMember?.lastname}`
              )}
            />
            {item.issueMember?.firstname} {item.issueMember?.lastname}
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
                {item.assignedBy?.firstname} {item.assignedBy?.lastname}
              </p>
            </span>
            <span className="font-semibold text-sm flex flex-row gap-2 items-center">
              <SlCalender className="text-primary" />
              <p>
                {new Date(item.dueDate).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </span>
            <span className="font-semibold text-sm flex flex-row gap-1 items-center">
              {item.status === 'Complete' && (
                <FaCircleCheck className="text-primary" />
              )}
              {item.status === 'Pending' && (
                <FaCircle className="text-primary" />
              )}
              {item.status === 'In Progress' && (
                <>
                  <AiOutlineLoading3Quarters className="text-primary" />
                  <FaRegCircle className="text-primary" />
                </>
              )}
              {item.status === 'Overdue' && (
                <FaExclamationCircle className="text-primary" />
              )}
              <p>{item.status}</p>
            </span>
            <span className="font-semibold text-sm flex flex-row gap-1 items-center">
              <IoIosPricetag className="text-primary" />
              <p>{item.category}</p>
            </span>
            <span className="font-semibold text-sm flex flex-row gap-1 items-center">
              <IoIosFlag className="text-primary" />
              <p>{item.priority}</p>
            </span>
            <span className="font-semibold text-sm flex flex-row gap-1 items-center">
              <FiRepeat className="text-primary" />
              <p>
                {item?.repeat?.repeatType === 'norepeat'
                  ? 'Once'
                  : item.repeat?.repeatType}
              </p>
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default TaskCard;
