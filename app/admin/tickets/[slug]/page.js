'use client';

import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from '../../../../lib/api';
import {
  FormControl,
  TextField,
  Skeleton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { toast } from 'sonner';
import Modal from '@mui/material/Modal';
import { useParams, useRouter } from 'next/navigation';
import AsideContainer from '../../../../components/AsideContainer';
import { IoIosArrowBack } from 'react-icons/io';
import { useAuthStore } from '../../../../store/useAuthStore';
import { cn } from '../../../../lib/utils';
import { MdChecklist, MdOutlineInsertComment } from 'react-icons/md';
import { HiOutlineLockOpen } from 'react-icons/hi2';
import { RiProgress3Line } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa';
import { IoLockClosedOutline } from 'react-icons/io5';
import Image from 'next/image';
import { FiDownload } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import { SidebarTrigger } from '../../../../components/ui/sidebar';
import { Separator } from '../../../../components/ui/separator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { allowRoles } from '../../../../helpers/constants';

const TicketDetailsSkeleton = memo(function TicketDetailsSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white flex flex-col gap-4 mb-4">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="text" width="60%" height={28} />
          ))}
        </div>
        <Skeleton variant="circular" width={160} height={160} />
      </div>
    </div>
  );
});

export default function TicketViewClient() {
  const { slug } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userId, userType } = useAuthStore.getState();

  const duration = useMemo(() => 72 * 60 * 60 * 1000, []); // 72 hours in ms
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openComment, setOpenComment] = useState(false);
  const [commentType, setCommentType] = useState(null);
  const [comment, setComment] = useState('');
  const [imageFiles, setImageFiles] = useState(null);
  const [newMember, setNewMember] = useState('');
  const [openAssignMember, setOpenAssignMember] = useState(false);

  // Fetch ticket data
  const { data, isLoading } = useQuery({
    queryKey: ['ticket', slug],
    queryFn: async () => {
      const res = await api.get(`/projecttask/viewbyid/${slug}`);
      return res.data.data;
    },
    staleTime: 0,
  });

  const ticket = data?.ticket;

  const ticketCreationTime = useMemo(
    () => (ticket?.date ? new Date(ticket.date) : null),
    [ticket?.date]
  );

  const { data: projectMembers } = useQuery({
    queryKey: ['projectMembers', ticket?.siteID],
    queryFn: async () => {
      const res = await api.get(
        `/project/getallprojectissuemembers/${ticket?.siteID}`
      );
      return res.data.data;
    },
    enabled: openAssignMember && Boolean(ticket?.siteID),
  });

  useEffect(() => {
    if (!ticketCreationTime) return;
    const updateCountdown = () => {
      const now = Date.now();
      const remaining = duration - (now - ticketCreationTime.getTime());
      setTimeLeft(Math.max(remaining, 0));
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [ticketCreationTime, duration]);

  const formatTime = useCallback(time => {
    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  }, []);

  const updateTicketMutation = useMutation({
    mutationFn: async () => {
      if (!comment) throw new Error('Please add a comment');
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('ticketId', slug);
      formData.append('type', commentType);
      if (imageFiles) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append('image', imageFiles[i]);
        }
      }
      formData.append('comment', comment);
      return api.put(`/project/ticketupdatemember/byid`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      toast.success('Ticket updated successfully');
      queryClient.invalidateQueries(['ticket', slug]);
      setOpenComment(false);
      setComment('');
      setImageFiles(null);
    },
    onError: err => toast.error(err.message || 'Error updating ticket'),
  });

  const changeAssignMember = useMutation({
    mutationFn: async () => {
      return api.put(`/tickets/changeissuemember`, {
        ticketId: slug,
        newMemberId: newMember,
      });
    },
    onSuccess: () => {
      toast.success('Assign member updated successfully');
      queryClient.invalidateQueries({ queryKey: ['ticket', slug] });
      setOpenAssignMember(false);
    },
    onError: err => {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          'Error updating assign member'
      );
    },
  });

  const handleDownloadImage = useCallback(
    url => saveAs(url, 'ticket_image.jpg'),
    []
  );

  const isOverdue = useMemo(
    () => timeLeft <= 0 && ticket?.status !== 'Completed',
    [timeLeft, ticket?.status]
  );

  const isAssignedToMe = useMemo(
    () => ticket?.assignMember?._id === userId,
    [ticket?.assignMember?._id, userId]
  );

  const isAssignedByMe = useMemo(
    () => ticket?.assignedBy?._id === userId,
    [ticket?.assignedBy?._id, userId]
  );

  const isAllowedRole = allowRoles.includes(userType);

  const isComplete = ticket?.status === 'Complete';
  const isClosed = ticket?.status === 'Closed';

  if (!ticket) return null;

  return (
    <AsideContainer>
      <div className="flex w-full items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-2 hover:bg-primary" />
        <Separator orientation="vertical" className="h-4 bg-black" />
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer hover:scale-150 transition"
        />
        <h1 className="font-ubuntu font-bold text-[25px] leading-7 py-5">
          Ticket Details
        </h1>
      </div>

      {isLoading ? (
        <TicketDetailsSkeleton />
      ) : (
        <div className="p-5 rounded-2xl bg-white flex flex-col gap-4 shadow-md">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <DetailRow label="Query Point" value={ticket.content} />
              <DetailRow label="Query" value={ticket.query} />
              <DetailRow label="Work" value={ticket.work} />
              <DetailRow
                label="Assign member"
                value={`${ticket.assignMember?.firstname || ''} ${
                  ticket.assignMember?.lastname || ''
                }`}
              />
              <DetailRow
                label="Ticket Date"
                value={new Date(ticket.date).toLocaleDateString()}
              />
              <div className="flex items-center gap-2">
                <h5 className="font-semibold">Status:</h5>
                <p
                  className={cn(
                    ticket.status === 'Pending' && '_pending',
                    ticket.status === 'Process' && '_process',
                    ticket.status === 'Completed' && '_resolve'
                  )}
                >
                  {ticket.status}
                </p>
                {isOverdue && !isComplete && (
                  <span className="text-red-500 font-semibold">(Overdue)</span>
                )}
              </div>
            </div>
            {!isOverdue && ticket.status !== 'Completed' && (
              <div className="h-40 w-40">
                <CircularProgressbar
                  value={100 * (timeLeft / duration)}
                  text={formatTime(timeLeft)}
                  styles={buildStyles({
                    textColor: isOverdue ? 'red' : 'green',
                    trailColor: '#e5e5e5',
                  })}
                />
              </div>
            )}
          </div>

          {ticket.image?.length > 0 && (
            <div className="flex flex-col gap-4 my-4">
              <h2 className="font-ubuntu text-lg font-semibold mb-2">
                Images:
              </h2>
              <div className="flex gap-2 flex-wrap">
                {ticket.image.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-28 h-28 cursor-pointer group"
                    onClick={() => setSelectedImage(img)}
                  >
                    <span className="absolute inset-0 bg-black bg-opacity-30 hidden group-hover:flex items-center justify-center text-white font-semibold rounded">
                      View
                    </span>
                    <Image
                      src={img}
                      alt="ticket"
                      width={112}
                      height={112}
                      className="rounded object-cover w-28 h-28"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isClosed && (
            <div className="flex gap-4 flex-wrap">
              {(isAllowedRole || isAssignedToMe || isAssignedByMe) &&
                !isComplete && (
                  <ActionButton
                    icon={<RiProgress3Line />}
                    text="In Progress"
                    onClick={() => {
                      setCommentType('In Progress');
                      setOpenComment(true);
                    }}
                  />
                )}
              {((isComplete && isAllowedRole) ||
                (isComplete && isAssignedByMe)) && (
                <ActionButton
                  icon={<HiOutlineLockOpen />}
                  text="Re-open"
                  onClick={() => {
                    setCommentType('Reopened');
                    setOpenComment(true);
                  }}
                />
              )}
              {(isAllowedRole || isAssignedToMe) && !isComplete && (
                <ActionButton
                  icon={<FaCheck />}
                  text="Complete"
                  onClick={() => {
                    setCommentType('Complete');
                    setOpenComment(true);
                  }}
                />
              )}
              {(isAllowedRole || isAssignedByMe) && !isComplete && (
                <ActionButton
                  icon={<IoLockClosedOutline />}
                  text="Close"
                  onClick={() => {
                    setCommentType('Closed');
                    setOpenComment(true);
                  }}
                />
              )}
              {(isAllowedRole || isAssignedToMe || isAssignedByMe) &&
                !isComplete &&
                !isClosed && (
                  <ActionButton
                    icon={<MdOutlineInsertComment />}
                    text="Comment"
                    onClick={() => {
                      setCommentType('Comment');
                      setOpenComment(true);
                    }}
                  />
                )}
              {isAllowedRole && !isComplete && (
                <ActionButton
                  icon={<MdOutlineInsertComment />}
                  text="Reassign Member"
                  onClick={() => {
                    setOpenAssignMember(true);
                    setCommentType('Task Updated');
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      {ticket.comments?.length > 0 && (
        <div className="my-4">
          <div className="flex items-center gap-2 mb-4">
            <MdChecklist className="text-3xl text-primary" />
            <h3 className="text-xl font-bold font-ubuntu">Ticket Updates</h3>
          </div>
          <div className="flex flex-col gap-4">
            {ticket.comments.map(item => (
              <div key={item._id} className="bg-white rounded-xl p-5 shadow-md">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <Image
                      src={
                        item?.createdBy?.profileImage ||
                        '/assets/profile-placeholder.png'
                      }
                      alt="profile"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <div className="text-sm">
                      <span className="font-semibold">
                        {item?.createdBy?.firstname}
                      </span>
                      <span className="block">
                        At{' '}
                        {new Date(item.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'font-ubuntu text-sm text-white p-1 rounded',
                      item.type === 'In Progress' && 'bg-yellow-500',
                      item.type === 'Complete' && 'bg-green-600',
                      item.type === 'Comment' && 'bg-gray-600',
                      item.type === 'Reopened' && 'bg-blue-600',
                      item.type === 'Closed' && 'bg-red-600',
                      item.type === 'Task Updated' && 'bg-purple-600'
                    )}
                  >
                    {item?.type}
                  </span>
                </div>
                <p className="mt-4">{item.comment}</p>
                {item.images?.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {item.images.map((img, idx) => (
                      <div
                        key={img}
                        className="relative w-16 h-16 cursor-pointer group"
                        onClick={() => setSelectedImage(img)}
                      >
                        <span className="absolute inset-0 bg-black bg-opacity-30 hidden group-hover:flex items-center justify-center text-white font-semibold rounded">
                          View
                        </span>
                        <Image
                          src={img}
                          alt="comment"
                          width={100}
                          height={100}
                          className="rounded object-cover w-16 h-16"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <div className="bg-white rounded-3xl h-5/6 p-5 flex flex-col items-center justify-center outline-none">
          <img
            src={selectedImage}
            alt="ticket"
            className="h-5/6 object-contain"
          />
          <button
            className="mt-4 px-4 py-2 bg-secondary text-primary rounded-full flex items-center gap-2"
            onClick={() => handleDownloadImage(selectedImage)}
          >
            <FiDownload /> Download
          </button>
        </div>
      </Modal>

      {/* Comment Modal */}
      <Modal
        open={openComment}
        onClose={() => setOpenComment(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <div className="bg-white p-8 rounded-3xl w-1/3">
          <h3 className="text-2xl font-semibold mb-3">Ticket Update</h3>
          <textarea
            rows={5}
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />
          {/* <TextField
              type="file"
              onChange={e => setImageFiles(e.target.files)}
            /> */}
          <input
            type="file"
            onChange={e => setImageFiles(e.target.files)}
            className=" w-full text-gray-400 font-semibold text-sm bg-gray-100 border border-primary rounded-[7px] file:cursor-pointer cursor-pointer file:border-0 file:py-[14px] file:px-3 file:mr-4 file:bg-secondary file:hover:bg-gray-200 file:text-primary"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="border px-4 py-2 rounded-full"
              onClick={() => setOpenComment(false)}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary px-4 py-2 rounded-full"
              onClick={() => updateTicketMutation.mutate()}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign Member Modal */}
      <Modal
        open={openAssignMember}
        onClose={() => setOpenAssignMember(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <div className="bg-white p-8 rounded-3xl w-1/3">
          <h3 className="text-2xl font-semibold mb-3">Reassign Member</h3>
          <FormControl fullWidth>
            <InputLabel id="newmember-simple-select-label">
              New Member
            </InputLabel>
            <Select
              labelId="newmember-simple-select-label"
              id="newmember-simple-select"
              label="newmember"
              value={newMember}
              name="newmember"
              variant="outlined"
              onChange={e => setNewMember(e.target.value)}
              sx={{ borderRadius: '16px', background: '#f3f4f6' }}
            >
              {projectMembers?.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item.firstname + ' ' + item.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="border px-4 py-2 rounded-full"
              onClick={() => setOpenAssignMember(false)}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary px-4 py-2 rounded-full"
              onClick={() => changeAssignMember.mutate()}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </AsideContainer>
  );
}

const DetailRow = memo(function DetailRow({ label, value }) {
  return (
    <div className="flex gap-2">
      <h5 className="font-semibold">{label}:</h5>
      <p>{value || '-'}</p>
    </div>
  );
});

const ActionButton = memo(function ActionButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex items-center gap-2"
    >
      {icon} {text}
    </button>
  );
});
