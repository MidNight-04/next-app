'use client';

// Icons
import { Check } from '@mui/icons-material';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { BsClockHistory } from 'react-icons/bs';
import { TbProgress } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { LuTimerReset } from 'react-icons/lu';

// Custom Components
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

// Store and Utils
import { cn } from '../../lib/utils';
import { allowRoles } from '../../helpers/constants';

const ProjectSteps = ({
  projectDetails,
  taskStatus,
  activeTab,
  handleTabChange,
  userType,
}) => {
  if (!projectDetails?.project_status) return null;

  let runningDate = new Date(projectDetails.date);

  return projectDetails.project_status
    .sort((a, b) => a.priority - b.priority)
    .map(item => {
      const totalPoints = item.step?.length || 0;
      const completedPoints =
        item.step?.filter(step => step.taskId?.status === taskStatus.COMPLETE)
          .length || 0;
      const percentage =
        totalPoints > 0 ? Math.round((completedPoints * 100) / totalPoints) : 0;

      return (
        <Accordion
          type="single"
          collapsible
          key={item._id || item.name} // Use ID if available for better key stability
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <AccordionItem
            value={item.name}
            className={`bg-white rounded-[14px] mb-2 ${
              activeTab !== item.name
                ? 'shadow-lg scale-100 hover:scale-[1.02] transition-all duration-300'
                : ''
            }`}
          >
            <AccordionTrigger className="px-4">
              <div className="flex flex-row justify-between w-full pr-8 -md:pr-2">
                <p className="flex text-lg font-ubuntu justify-center items-center font-bold -md:text-sm">
                  {item.name}
                </p>
                <div className="flex flex-row gap-4 items-center">
                  <div style={{ width: 40, height: 40 }}>
                    <CircularProgressbar
                      value={percentage}
                      text={`${percentage}%`}
                      strokeWidth={14}
                      styles={buildStyles({
                        backgroundColor: '#3e98c7',
                        textColor: 'black',
                        pathColor: percentage === 100 ? '#10b981' : '#93BFCF', // Green when complete
                        trailColor: '#d6d6d6',
                        textSize: '1.5rem',
                      })}
                    />
                  </div>
                  {allowRoles.includes(userType) && (
                    <button
                      className="p-2 text-lg border border-primary rounded-full font-semibold text-primary cursor-pointer hover:bg-red-50 transition-colors"
                      onClick={e => {
                        e.stopPropagation(); // Prevent accordion toggle
                        confirmDeleteProjectStep(
                          item?.siteID,
                          item?.name,
                          item?._id
                        );
                      }}
                      aria-label={`Delete ${item.name}`}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-0">
              <div className="bg-[#efefef] pt-2">
                {allowRoles.includes(userType) && (
                  <div className="flex flex-row justify-end gap-2 mb-2">
                    <button
                      className="border border-primary rounded-full p-2 font-semibold text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors"
                      onClick={() => AddStepOpenModal(item?.step, item?.name)}
                      aria-label="Add step"
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="border border-primary rounded-full p-2 font-semibold text-primary cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
                      onClick={() =>
                        DeleteStepOpenModal(item?.step, item?.name)
                      }
                      aria-label="Delete step"
                    >
                      <FaMinus />
                    </button>
                  </div>
                )}
                {/* Table Header */}
                <div className="bg-secondary text-primary h-16 flex flex-row justify-evenly items-center rounded-t-3xl flex-auto text-base font-semibold -md:justify-between">
                  <span className="font-semibold w-24 -sm:hidden" />
                  <span className="font-semibold w-[200px] text-center -md:w-16 -md:ml-8 -sm:ml-12 -md:text-xs">
                    Point
                  </span>
                  <span className="font-semibold w-[200px] flex md:ml-6 -md:w-20 text-left -sm:ml-4 -md:text-xs">
                    Member Issue
                  </span>
                  <span className="font-semibold w-[200px] text-left -md:w-24 -md:text-xs">
                    Schedule Time
                  </span>
                  <span className="font-semibold w-[70px] text-center -md:w-24 -md:text-xs">
                    Action
                  </span>
                </div>
              </div>
              <div>
                {item.step?.map((itm, idx) => {
                  // Improved date calculation logic
                  const duration = itm.duration ? parseInt(itm.duration) : 0;
                  const stepStartDate = new Date(runningDate);
                  runningDate.setDate(runningDate.getDate() + duration);
                  const expectedDate = new Date(runningDate);

                  // Calculate delay/early completion more accurately
                  let statusText = '';
                  let statusColor = '';
                  if (
                    itm.taskId.status === taskStatus.COMPLETE &&
                    itm.taskId.updatedOn
                  ) {
                    const completedDate = new Date(itm.taskId.updatedOn);
                    const daysDiff = Math.floor(
                      (completedDate - expectedDate) / (1000 * 60 * 60 * 24)
                    );

                    if (daysDiff > 0) {
                      statusText = ` (${daysDiff} days late)`;
                      statusColor = 'text-red-600';
                    } else if (daysDiff < 0) {
                      statusText = ` (${Math.abs(daysDiff)} days early)`;
                      statusColor = 'text-green-600';
                    } else {
                      statusText = ' (On time)';
                      statusColor = 'text-blue-600';
                    }
                  }

                  const formattedExpectedDate = expectedDate
                    .toISOString()
                    .split('T')[0];

                  return (
                    <div
                      key={`${itm.taskId._id}-${idx}`} // Use task ID for better key stability
                      className="flex flex-row justify-evenly w-full py-0 outline-none -md:text-xs"
                    >
                      {/* Status Icon */}
                      <div className="relative w-[120px] -md:w-8">
                        <div className="h-full w-6 flex items-center justify-center">
                          <span
                            className={cn(
                              'w-[2px] bg-secondary pointer-events-none h-full -md:w-[1px]',
                              idx === 0 ? 'mt-[100%] h-8' : '',
                              idx === item.step.length - 1
                                ? 'mb-[100%] h-8'
                                : '',
                              itm.taskId.status === taskStatus.COMPLETE
                                ? 'bg-green-400'
                                : 'bg-secondary'
                            )}
                          />
                        </div>
                        <div
                          className={cn(
                            'w-8 h-8 absolute top-1/2 md:right-[92px] -md:right-2 -mt-4 rounded-full shadow-xl text-center -md:h-6 -md:w-6 -md:[&_svg]:text-base flex items-center justify-center',
                            {
                              'bg-green-500':
                                itm.taskId.status === taskStatus.COMPLETE,
                              'bg-blue-500':
                                itm.taskId.status === taskStatus.IN_PROGRESS,
                              'bg-yellow-500':
                                itm.taskId.status === taskStatus.PENDING,
                              'bg-red-500':
                                itm.taskId.status === taskStatus.OVERDUE,
                            }
                          )}
                        >
                          {itm.taskId.status === taskStatus.PENDING && (
                            <BsClockHistory className="text-white text-xl -md:text-base" />
                          )}
                          {itm.taskId.status === taskStatus.COMPLETE && (
                            <Check
                              sx={{
                                fontSize: '20px',
                                color: 'white',
                              }}
                            />
                          )}
                          {itm.taskId.status === taskStatus.IN_PROGRESS && (
                            <TbProgress className="text-white text-xl -md:text-base" />
                          )}
                          {itm.taskId.status === taskStatus.OVERDUE && (
                            <LuTimerReset className="text-white text-xl -md:text-base" />
                          )}
                        </div>
                      </div>

                      {/* Point Name */}
                      <div className="w-[200px] flex items-center -md:w-16">
                        <p className="text-sm font-medium -md:text-xs">
                          {itm.taskId.title}
                          {itm.checkList?.toLowerCase() === 'yes' && (
                            <span className="text-xs text-gray-500 ml-1">
                              (inspections)
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Assigned Member */}
                      <div className="w-[200px] flex self-center justify-start -md:w-16">
                        <span className="text-sm -md:text-xs">
                          {`${itm.taskId.issueMember?.firstname || ''} ${
                            itm.taskId.issueMember?.lastname || ''
                          }`.trim() || 'Unassigned'}
                        </span>
                      </div>

                      {/* Schedule Time */}
                      <div className="w-[200px] -md:w-20 my-1 flex items-start flex-col">
                        <div className="text-left">
                          <div className="flex flex-row mb-1">
                            <p className="text-sm font-medium -md:text-xs">
                              ETC:
                            </p>
                            <p className="text-sm -md:text-xs ml-1">
                              {formattedExpectedDate}
                            </p>
                          </div>
                          {itm?.taskId?.updatedOn &&
                            itm?.taskId?.status === taskStatus.COMPLETE && (
                              <div className="flex flex-row">
                                <p className="text-sm font-medium -md:text-xs">
                                  DOC:
                                </p>
                                <div className="text-sm -md:text-xs ml-1">
                                  <span>
                                    {
                                      new Date(itm.taskId.updatedOn)
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                  </span>
                                  <span className={`text-xs ${statusColor}`}>
                                    {statusText}
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-center w-[70px]">
                        <button
                          className="bg-secondary rounded-3xl text-primary px-3 py-2 -md:text-xs -md:px-2 -md:py-1 scale-100 hover:scale-105 transition-all duration-100 hover:shadow-md"
                          onClick={() =>
                            router.push(`/admin/tasks/${itm.taskId._id}`)
                          }
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    });
};

// const ProjectSteps = ({ projectDetails }) => {
//   if (!projectDetails?.project_status) return null;

//   const runningDate = new Date(projectDetails.date);

//   const getCompletionPercentage = steps => {
//     if (!steps?.length) return 0;
//     const completed = steps.filter(
//       s => s.taskId?.status === taskStatus.COMPLETE
//     ).length;
//     return Math.round((completed * 100) / steps.length);
//   };

//   const calculateStepDates = duration => {
//     const stepStartDate = new Date(runningDate);
//     runningDate.setDate(runningDate.getDate() + (parseInt(duration) || 0));
//     return new Date(runningDate);
//   };

//   const getStatusInfo = (expectedDate, itm) => {
//     if (itm.taskId.status === taskStatus.COMPLETE && itm.taskId.updatedOn) {
//       const completedDate = new Date(itm.taskId.updatedOn);
//       const daysDiff = Math.floor(
//         (completedDate - expectedDate) / (1000 * 60 * 60 * 24)
//       );

//       if (daysDiff > 0)
//         return { text: ` (${daysDiff} days late)`, color: 'text-red-600' };
//       if (daysDiff < 0)
//         return {
//           text: ` (${Math.abs(daysDiff)} days early)`,
//           color: 'text-green-600',
//         };
//       return { text: ' (On time)', color: 'text-blue-600' };
//     }
//     return { text: '', color: '' };
//   };

//   return projectDetails.project_status
//     .sort((a, b) => a.priority - b.priority)
//     .map(item => {
//       const percentage = getCompletionPercentage(item.step);

//       return (
//         <Accordion
//           type="single"
//           collapsible
//           key={item._id || item.name}
//           value={activeTab}
//           onValueChange={handleTabChange}
//         >
//           <AccordionItem
//             value={item.name}
//             className={`bg-white rounded-[14px] mb-2 ${
//               activeTab !== item.name
//                 ? 'shadow-lg scale-100 hover:scale-[1.02] transition-all duration-300'
//                 : ''
//             }`}
//           >
//             {/* Header */}
//             <AccordionTrigger className="px-4">
//               <div className="flex flex-row justify-between w-full pr-8 -md:pr-2">
//                 <p className="flex text-lg font-ubuntu justify-center items-center font-bold -md:text-sm">
//                   {item.name}
//                 </p>
//                 <div className="flex flex-row gap-4 items-center">
//                   <div style={{ width: 40, height: 40 }}>
//                     <CircularProgressbar
//                       value={percentage}
//                       text={`${percentage}%`}
//                       strokeWidth={14}
//                       styles={buildStyles({
//                         backgroundColor: '#3e98c7',
//                         textColor: 'black',
//                         pathColor: percentage === 100 ? '#10b981' : '#93BFCF',
//                         trailColor: '#d6d6d6',
//                         textSize: '1.5rem',
//                       })}
//                     />
//                   </div>
//                   {allowRoles.includes(userType) && (
//                     <button
//                       className="p-2 text-lg border border-primary rounded-full font-semibold text-primary cursor-pointer hover:bg-red-50 transition-colors"
//                       onClick={e => {
//                         e.stopPropagation();
//                         confirmDeleteProjectStep(
//                           item?.siteID,
//                           item?.name,
//                           item?._id
//                         );
//                       }}
//                       aria-label={`Delete ${item.name}`}
//                     >
//                       <RiDeleteBin6Line />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </AccordionTrigger>

//             {/* Content */}
//             <AccordionContent className="py-0">
//               <div className="bg-[#efefef] pt-2">
//                 {allowRoles.includes(userType) && (
//                   <div className="flex flex-row justify-end gap-2 mb-2">
//                     <button
//                       className="border border-primary rounded-full p-2 font-semibold text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors"
//                       onClick={() => AddStepOpenModal(item?.step, item?.name)}
//                       aria-label="Add step"
//                     >
//                       <FaPlus />
//                     </button>
//                     <button
//                       className="border border-primary rounded-full p-2 font-semibold text-primary cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
//                       onClick={() =>
//                         DeleteStepOpenModal(item?.step, item?.name)
//                       }
//                       aria-label="Delete step"
//                     >
//                       <FaMinus />
//                     </button>
//                   </div>
//                 )}

//                 {/* Table Header */}
//                 <div className="bg-secondary text-primary h-16 flex flex-row justify-evenly items-center rounded-t-3xl flex-auto text-base font-semibold -md:justify-between">
//                   <span className="font-semibold w-24 -sm:hidden" />
//                   <span className="font-semibold w-[200px] text-center -md:w-16 -md:ml-8 -sm:ml-12 -md:text-xs">
//                     Point
//                   </span>
//                   <span className="font-semibold w-[200px] flex md:ml-6 -md:w-20 text-left -sm:ml-4 -md:text-xs">
//                     Member Issue
//                   </span>
//                   <span className="font-semibold w-[200px] text-left -md:w-24 -md:text-xs">
//                     Schedule Time
//                   </span>
//                   <span className="font-semibold w-[70px] text-center -md:w-24 -md:text-xs">
//                     Action
//                   </span>
//                 </div>
//               </div>

//               {/* Steps */}
//               <div>
//                 {item.step?.map((itm, idx) => {
//                   const expectedDate = calculateStepDates(itm.duration);
//                   const { text: statusText, color: statusColor } =
//                     getStatusInfo(expectedDate, itm);
//                   const formattedExpectedDate = expectedDate
//                     .toISOString()
//                     .split('T')[0];

//                   return (
//                     <div
//                       key={`${itm.taskId._id}-${idx}`}
//                       className="flex flex-row justify-evenly w-full py-0 outline-none -md:text-xs"
//                     >
//                       {/* Status Icon */}
//                       <div className="relative w-[120px] -md:w-8">
//                         <div className="h-full w-6 flex items-center justify-center">
//                           <span
//                             className={cn(
//                               'w-[2px] bg-secondary pointer-events-none h-full -md:w-[1px]',
//                               idx === 0 ? 'mt-[100%] h-8' : '',
//                               idx === item.step.length - 1
//                                 ? 'mb-[100%] h-8'
//                                 : '',
//                               itm.taskId.status === taskStatus.COMPLETE
//                                 ? 'bg-green-400'
//                                 : 'bg-secondary'
//                             )}
//                           />
//                         </div>
//                         <div
//                           className={cn(
//                             'w-8 h-8 absolute top-1/2 md:right-[92px] -md:right-2 -mt-4 rounded-full shadow-xl text-center -md:h-6 -md:w-6 -md:[&_svg]:text-base flex items-center justify-center',
//                             {
//                               'bg-green-500':
//                                 itm.taskId.status === taskStatus.COMPLETE,
//                               'bg-blue-500':
//                                 itm.taskId.status === taskStatus.IN_PROGRESS,
//                               'bg-yellow-500':
//                                 itm.taskId.status === taskStatus.PENDING,
//                               'bg-red-500':
//                                 itm.taskId.status === taskStatus.OVERDUE,
//                             }
//                           )}
//                         >
//                           {itm.taskId.status === taskStatus.PENDING && (
//                             <BsClockHistory className="text-white text-xl -md:text-base" />
//                           )}
//                           {itm.taskId.status === taskStatus.COMPLETE && (
//                             <Check sx={{ fontSize: '20px', color: 'white' }} />
//                           )}
//                           {itm.taskId.status === taskStatus.IN_PROGRESS && (
//                             <TbProgress className="text-white text-xl -md:text-base" />
//                           )}
//                           {itm.taskId.status === taskStatus.OVERDUE && (
//                             <LuTimerReset className="text-white text-xl -md:text-base" />
//                           )}
//                         </div>
//                       </div>

//                       {/* Point Name */}
//                       <div className="w-[200px] flex items-center -md:w-16">
//                         <p className="text-sm font-medium -md:text-xs">
//                           {itm.taskId.title}
//                           {itm.checkList?.toLowerCase() === 'yes' && (
//                             <span className="text-xs text-gray-500 ml-1">
//                               (inspections)
//                             </span>
//                           )}
//                         </p>
//                       </div>

//                       {/* Assigned Member */}
//                       <div className="w-[200px] flex self-center justify-start -md:w-16">
//                         <span className="text-sm -md:text-xs">
//                           {`${itm.taskId.issueMember?.firstname || ''} ${
//                             itm.taskId.issueMember?.lastname || ''
//                           }`.trim() || 'Unassigned'}
//                         </span>
//                       </div>

//                       {/* Schedule Time */}
//                       <div className="w-[200px] -md:w-20 my-1 flex items-start flex-col">
//                         <div className="text-left">
//                           <div className="flex flex-row mb-1">
//                             <p className="text-sm font-medium -md:text-xs">
//                               ETC:
//                             </p>
//                             <p className="text-sm -md:text-xs ml-1">
//                               {formattedExpectedDate}
//                             </p>
//                           </div>
//                           {itm?.taskId?.updatedOn &&
//                             itm?.taskId?.status === taskStatus.COMPLETE && (
//                               <div className="flex flex-row">
//                                 <p className="text-sm font-medium -md:text-xs">
//                                   DOC:
//                                 </p>
//                                 <div className="text-sm -md:text-xs ml-1">
//                                   <span>
//                                     {
//                                       new Date(itm.taskId.updatedOn)
//                                         .toISOString()
//                                         .split('T')[0]
//                                     }
//                                   </span>
//                                   <span className={`text-xs ${statusColor}`}>
//                                     {statusText}
//                                   </span>
//                                 </div>
//                               </div>
//                             )}
//                         </div>
//                       </div>

//                       {/* Action Button */}
//                       <div className="flex items-center justify-center w-[70px]">
//                         <button
//                           className="bg-secondary rounded-3xl text-primary px-3 py-2 -md:text-xs -md:px-2 -md:py-1 scale-100 hover:scale-105 transition-all duration-100 hover:shadow-md"
//                           onClick={() =>
//                             router.push(`/admin/tasks/${itm.taskId._id}`)
//                           }
//                         >
//                           Details
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         </Accordion>
//       );
//     });
// };

export default ProjectSteps;
