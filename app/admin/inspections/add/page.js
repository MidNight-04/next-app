"use client";
import axios from "axios";
import AsideContainer from "../../../../components/AsideContainer";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      toast.error("Checklist name is required", {
        position: "top-center",
      });
      return; // Exit early if name is empty
    }

    // Check if any checklist item heading is empty
    const isAnyHeadingEmpty = checklistItems.some(item => !item.heading.trim());
    if (isAnyHeadingEmpty) {
      toast.error("Checklist item heading is required", {
        position: "top-center",
      });
      return; // Exit early if any heading is empty
    }

    // Check if any checklist item point is empty
    const isAnyPointEmpty = checklistItems.some(item =>
      item.points.some(point => !point.point.trim())
    );
    if (isAnyPointEmpty) {
      toast.error("Checklist item point is required", {
        position: "top-center",
      });
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
            toast.success(response.data.message, {
              position: "top-right",
            });
            router.push("/admin/project/checklist");
          }
        })
        .catch(error => {
          toast.error("Error while add checklist", {
            position: "top-right",
          });
          console.log(error);
        });
    }
  };
  return (
    <AsideContainer>
      <div className="single">
        {/* <AdminSidebar /> */}
        <div className="singleContainer">
          {/* <AdminNavbar /> */}
          <div className="adminNewUser">
            <div className="newContainer">
              <div className="topContainer">
                <h1>Add CheckList</h1>
              </div>
              <div className="bottomContainer">
                <div className="bottomRightContainer mx-5">
                  <div className="form">
                    <div className="formInputContainer w-100 m-0">
                      <label>
                        CheckList Name<span className="text-danger">*</span>
                      </label>
                      <input
                        value={name}
                        type="text"
                        placeholder="Enter checklist name ..."
                        name="name"
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    {checklistItems.map((item, index) => (
                      <div className="name-container w-100" key={index}>
                        <div className="formInputContainer w-100">
                          <label className="checklistLabel">
                            <span>
                              CheckList Step
                              <span className="text-danger">*</span>
                            </span>
                            {index === checklistItems.length - 1 && (
                              <span onClick={handleAddChecklistItem}>
                                <FaPlus className="fs-5 fw-bold text-success mx-2" />
                              </span>
                            )}
                            {index !== 0 && (
                              <span
                                onClick={() => handleRemoveChecklistItem(index)}
                              >
                                <FaMinus className="fs-5 fw-bold text-danger mx-2" />
                              </span>
                            )}
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
                          />
                        </div>
                        {item?.points?.map((itm, idx) => {
                          return (
                            <div className="formInputContainer w-100" key={idx}>
                              <label className="checklistLabel">
                                <span>
                                  CheckList Point
                                  <span className="text-danger">*</span>
                                </span>
                                {idx === item.points?.length - 1 && (
                                  <span
                                    onClick={() =>
                                      handleAddChecklistPoint(index)
                                    }
                                  >
                                    <FaPlus className="fs-5 fw-bold text-success mx-2" />
                                  </span>
                                )}
                                {idx !== 0 && (
                                  <span
                                    onClick={() =>
                                      handleRemoveChecklistPoint(index, idx)
                                    }
                                  >
                                    <FaMinus className="fs-5 fw-bold text-danger mx-2" />
                                  </span>
                                )}
                              </label>
                              <input
                                type="text"
                                placeholder="Enter checklist point ..."
                                name="point"
                                value={itm.point}
                                onChange={e => {
                                  const newItems = [...checklistItems];
                                  newItems[index].points[idx].point =
                                    e.target.value;
                                  setChecklistItems(newItems);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="createUserSubmitBTN" onClick={submitFormData}>
                    Submit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default AddProjectCheckList;
