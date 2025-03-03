"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import AsideContainer from "../../../../components/AsideContainer";
import Image from "next/image";
import { RiProgress3Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineInsertComment } from "react-icons/md";
import { Modal } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../../../store/useAuthStore";
import { MdChecklist } from "react-icons/md";
import { HiOutlineLockOpen } from "react-icons/hi2";
import { cn } from "../../../../lib/utils";
import { toast } from "sonner";

const Page = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [openComment, setOpenComment] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [type, setType] = useState(null);
  const [comment, setComment] = useState(null);
  const userId = useAuthStore(state => state.userId);
  const { data, error, isFetched, refetch } = useQuery({
    queryKey: [`gettaskbyid/${slug}`],
    queryFn: async () =>
      await fetch(
        `${process.env.REACT_APP_BASE_PATH}/api/task/gettaskbyid/${slug}`
      )
        .then(res => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .catch(error => {
          throw new Error("Failed to fetch data");
        }),
  });

  if (!isFetched) {
    return (
      <AsideContainer>
        <p className="text-center mt-10 text-lg font-semibold">Loading...</p>
      </AsideContainer>
    );
  }

  if (error) {
    return <AsideContainer>Error: {error.message}</AsideContainer>;
  }

  const toggleDelete = () => {
    setOpenDelete(prev => !prev);
  };

  const addComment = () => {
    setOpenComment(prev => !prev);
    const api = axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/task/taskaddcomment`, {
        userId,
        taskId: slug,
        type,
        comment,
      })
      .then(() => {
        refetch();
      });
  };

  const deleteTask = () => {
    setOpenDelete(prev => !prev);
    const api = axios
      .delete(`${process.env.REACT_APP_BASE_PATH}/api/task/delete/${slug}`)
      .then(() => {
        toast("Task Deleted!", {
          description: "Task Deleted Successfully.",
        });
        router.back();
      });
  };

  return (
    <AsideContainer>
      <div className="flex flex-row gap-2 items-center my-4">
        <IoIosArrowBack
          className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
          onClick={() => router.back()}
        />
        <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
          Project Details
        </h1>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center">
            <div>
              <span className="flex flex-row gap-2 items-center">
                <p className="font-ubuntu font-semibold text-gray-600">
                  Assigned To :
                </p>
                <Image
                  src={"/assets/profile-placeholder.png"}
                  alt="project image"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <p>{data.data.issueMember?.name}</p>
              </span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p className="font-ubuntu font-semibold text-gray-600">
                Assigned By :
              </p>
              <Image
                src={"/assets/profile-placeholder.png"}
                alt="project image"
                width={20}
                height={20}
                className="rounded-full"
              />
              <>
                {data.data.assignedBy?.name === "ThikedaarDotCom" ? (
                  <span className="font-semibold text-sm">Admin</span>
                ) : (
                  <span>{data.data.assignedBy?.name}</span>
                )}
              </>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <p className="font-ubuntu font-semibold text-gray-600">
              Created At :
            </p>
            <p>
              {`${new Date(data.data.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}`}
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <p className="font-ubuntu font-semibold text-gray-600">Status :</p>
            <p className="flex flex-row gap-1 items-center">
              {data.data.status === "Complete" ? (
                <FaCheck className="text-xl text-primary" />
              ) : (
                <RiProgress3Line className="text-primary text-lg" />
              )}
              {data.data.status}
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <p className="font-ubuntu font-semibold text-gray-600">
              Category :
            </p>
            <p className="flex flex-row gap-1 items-center">
              {data.data.category}
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <p className="font-ubuntu font-semibold text-gray-600">
              Priority :
            </p>
            <p className="flex flex-row gap-1 items-center">
              {data.data.priority}
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <p className="font-ubuntu font-semibold text-gray-600">
              Description :
            </p>
            <p className="flex flex-row gap-1 items-center">
              {data.data.description}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4 mt-4">
          {data.data.issueMember._id === userId ||
            (data.data.assignedBy?._id === userId &&
              data.data.status !== "Complete" && (
                <button
                  className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                  onClick={() => {
                    setType("In Progress");
                    setOpenComment(prev => !prev);
                  }}
                >
                  <RiProgress3Line className="text-xl" />
                  In Progress
                </button>
              ))}
          {data.data.status === "Complete" &&
            data.data.assignedBy?._id === userId && (
              <button
                className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                onClick={() => {
                  setType("In Progress");
                  setOpenComment(prev => !prev);
                }}
              >
                <HiOutlineLockOpen className="text-xl" />
                Re-open
              </button>
            )}
          {data.data.issueMember._id === userId ||
            (data.data.assignedBy?._id === userId &&
              data.data.status !== "Complete" && (
                <button
                  className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                  onClick={() => {
                    setType("Complete");
                    setOpenComment(prev => !prev);
                  }}
                >
                  <FaCheck className="text-xl" />
                  Complete
                </button>
              ))}
          {/* {data.data.assignedBy?._id === userId &&
            data.data.status !== "Complete" && (
              <button className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center">
                <MdEdit className="text-xl" />
                Edit
              </button>
            )} */}
          {data.data.assignedBy?._id === userId &&
            data.data.status !== "Complete" && (
              <button
                className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                onClick={() => toggleDelete()}
              >
                <MdDeleteOutline className="text-xl" />
                Delete
              </button>
            )}
          {data.data.issueMember._id === userId ||
            (data.data.assignedBy?._id === userId &&
              data.data.status !== "Complete" && (
                <button
                  className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                  onClick={() => {
                    setType("Comment");
                    setOpenComment(prev => !prev);
                  }}
                >
                  <MdOutlineInsertComment className="text-xl" />
                  Comment
                </button>
              ))}
        </div>
      </div>
      {data.data.comments.length > 0 && (
        <>
          <div className="flex flex-row gap-2 my-4">
            <MdChecklist className="text-3xl text-primary" />
            <h3 className="text-xl font-bold font-ubuntu">Task Updates</h3>
          </div>
          <div className="flex flex-col gap-4">
            {data.data.comments.map(item => (
              <div key={item._id} className="bg-white rounded-xl p-5">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-4 items-center">
                    <Image
                      src={"/assets/profile-placeholder.png"}
                      alt="project image"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <div className="text-sm flex flex-col">
                      <span className="font-semibold">
                        {item.createdBy?.name}
                      </span>
                      <span>
                        At{" "}
                        {new Date(item.createdAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "font-ubuntu text-sm text-white p-1 rounded",
                      item.type === "In Progress" && "bg-yellow-500",
                      item.type === "Complete" && "bg-green-600",
                      item.type === "Comment" && "bg-gray-600"
                    )}
                  >
                    {item.type}
                  </span>
                </div>
                <p>{item.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
      <Modal
        open={openComment}
        onClose={() => setOpenComment(prev => !prev)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bg-white 2xl:w-1/3 p-8 rounded-3xl outline-none -md:w-3/4 -lg:w-2/4 -xl:4/6 -2xl:3/6">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">Task Update</h3>
            <p>Please add a note before marking the task as Comment</p>
            <hr className="my-3" />
          </div>

          <div className="w-full">
            <textarea
              type="text"
              id="comment"
              onChange={e => setComment(e.target.value)}
              maxLength="250"
              className="w-full resize-none outline-primary border border-gray-400 rounded-lg p-2"
              rows={6}
            />
            <p className="text-xs text-red-500">
              Should be not more than 250 Charactors.
            </p>
          </div>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row items-center"
              onClick={() => setOpenComment(prev => !prev)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={addComment}
            >
              Add Comment
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        open={openDelete}
        onClose={toggleDelete}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">Delete Task</h3>
            <hr className="my-4" />
          </div>
          <h5>Are your sure you want to delete ?</h5>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={toggleDelete}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={deleteTask}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </AsideContainer>
  );
};
export default Page;
