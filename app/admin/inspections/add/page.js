"use client";
import axios from "axios";
import AsideContainer from "../../../../components/AsideContainer";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { toast } from "sonner";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const AddProjectCheckList = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [checklistItems, setChecklistItems] = useState([
    { heading: "", points: [{ point: "" }] },
  ]);

  const handleAddChecklistItem = () => {
    setChecklistItems([
      ...checklistItems,
      { heading: "", points: [{ point: "" }] },
    ]);
  };

  // Function to handle removing a checklist item
  const handleRemoveChecklistItem = indexToRemove => {
    setChecklistItems(
      checklistItems.filter((item, index) => index !== indexToRemove)
    );
  };

  const handleAddChecklistPoint = idx => {
    const newItems = [...checklistItems];
    newItems[idx].points.push({ point: "" });
    setChecklistItems(newItems);
  };

  const handleRemoveChecklistPoint = (idx, pointIdx) => {
    const newItems = [...checklistItems];
    newItems[idx].points = newItems[idx].points.filter(
      (_, index) => index !== pointIdx
    );
    setChecklistItems(newItems);
  };

  const submitFormData = () => {
    // Check if name is empty
    if (!name.trim()) {
      toast("Checklist name is required");
      return; // Exit early if name is empty
    }

    // Check if any checklist item heading is empty
    const isAnyHeadingEmpty = checklistItems.some(item => !item.heading.trim());
    if (isAnyHeadingEmpty) {
      toast("Checklist item heading is required");
      return; // Exit early if any heading is empty
    }

    // Check if any checklist item point is empty
    const isAnyPointEmpty = checklistItems.some(item =>
      item.points.some(point => !point.point.trim())
    );
    if (isAnyPointEmpty) {
      toast("Checklist item point is required");
      return; // Exit early if any point is empty
    } else {
      const data = {
        name: name,
        checkList: checklistItems,
      };
      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/add`,
          data
        )
        .then(response => {
          if (response) {
            toast(response.data.message, {
              position: "top-right",
            });
            router.push("/admin/inspections");
          }
        })
        .catch(error => {
          toast("Error while add checklist");
          console.log(error);
        });
    }
  };
  return (
    <AsideContainer>
      <div>
        <div className="flex flex-row gap-2 items-center my-5">
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Add CheckList
          </h1>
        </div>
        {/* <AdminSidebar /> */}
        <div className="bg-white rounded-[15px] p-5 mb-5">
          {/* <AdminNavbar /> */}
          <div className="bottomRightContainer mx-5">
            <div className="form">
              <div className="flex flex-col gap-2 [&_label]:font-semibold">
                <label>CheckList Name</label>
                <input
                  value={name}
                  type="text"
                  placeholder="Enter checklist name ..."
                  name="name"
                  onChange={e => setName(e.target.value)}
                  className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                />
              </div>
              {checklistItems.map((item, index) => (
                <div className="name-container w-100" key={index}>
                  <div className="flex flex-col gap-2 [&_label]:font-semibold">
                    <label className="flex flex-row justify-between items-center mt-2">
                      <span>Checklist Step</span>
                      <span className="flex flex-row gap-2">
                        {index === checklistItems.length - 1 && (
                          <span
                            onClick={handleAddChecklistItem}
                            className="p-2 bg-primary-foreground border border-primary rounded-full cursor-pointer [&_svg]:text-primary"
                          >
                            <FaPlus />
                          </span>
                        )}
                        {index !== 0 && (
                          <span
                            className="p-2 bg-primary-foreground border border-primary rounded-full cursor-pointer [&_svg]:text-primary"
                            onClick={() => handleRemoveChecklistItem(index)}
                          >
                            <FaMinus />
                          </span>
                        )}
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter checklist step ..."
                      name="heading"
                      value={item.heading}
                      onChange={e => {
                        const newItems = [...checklistItems];
                        newItems[index].heading = e.target.value;
                        setChecklistItems(newItems);
                      }}
                      className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                    />
                  </div>
                  {item?.points?.map((itm, idx) => {
                    return (
                      <div
                        className="flex flex-col gap-2 [&_label]:font-semibold"
                        key={idx}
                      >
                        <label className="flex flex-row justify-between items-center mt-2">
                          <span>CheckList Point</span>
                          <span className="flex flex-row gap-2">
                            {idx === item.points?.length - 1 && (
                              <span
                                className="p-2 bg-primary-foreground border border-primary rounded-full cursor-pointer [&_svg]:text-primary"
                                onClick={() => handleAddChecklistPoint(index)}
                              >
                                <FaPlus />
                              </span>
                            )}
                            {idx !== 0 && (
                              <span
                                className="p-2 bg-primary-foreground border border-primary rounded-full cursor-pointer [&_svg]:text-primary"
                                onClick={() =>
                                  handleRemoveChecklistPoint(index, idx)
                                }
                              >
                                <FaMinus />
                              </span>
                            )}
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter checklist point ..."
                          name="point"
                          value={itm.point}
                          onChange={e => {
                            const newItems = [...checklistItems];
                            newItems[index].points[idx].point = e.target.value;
                            setChecklistItems(newItems);
                          }}
                          className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex flex-row justify-end">
              <button
                className="px-4 py-2 border border-secondary bg-secondary text-primary rounded-3xl cursor-pointer mt-4"
                onClick={submitFormData}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default AddProjectCheckList;
