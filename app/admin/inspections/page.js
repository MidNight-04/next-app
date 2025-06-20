'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
} from '@mui/material';
import { toast } from 'sonner';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import AsideContainer from '../../../components/AsideContainer';
import { useRouter } from 'next/navigation';
import { Add } from '@mui/icons-material';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion';
import { MdDeleteOutline } from 'react-icons/md';
import { cn } from '../../../lib/utils';

const Page = () => {
  const [point, setPoint] = useState('');
  const [pointAddOpen, setPointAddOpen] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [showContent, setShowContent] = useState([]);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [newField, setNewField] = useState('');
  const [heading, setHeading] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [checkName, setCheckName] = useState('');
  const [checkNameAdd, setCheckNameAdd] = useState(false);
  const [uniqueStep, setUniqueStep] = useState([]);
  const [checklistItems, setChecklistItems] = useState([
    { heading: '', points: [{ point: '' }] },
  ]);
  const router = useRouter();

  const handleAddChecklistItem = () => {
    setChecklistItems([
      ...checklistItems,
      { heading: '', points: [{ point: '' }] },
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
    newItems[idx].points.push({ point: '' });
    setChecklistItems(newItems);
  };

  const handleRemoveChecklistPoint = (idx, pointIdx) => {
    const newItems = [...checklistItems];
    newItems[idx].points = newItems[idx].points.filter(
      (_, index) => index !== pointIdx
    );
    setChecklistItems(newItems);
  };

  useEffect(() => {
    // Initialize showContent state based on the number of project steps
    if (data?.checkList) {
      setShowContent(new Array(data?.checkList?.length).fill(false));
    }
  }, [data]);

  const toggleContent = index => {
    setShowContent(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  useEffect(() => {
    getAllCheckList();
  }, []);

  const filterUniqueNames = array => {
    const seen = new Set();
    return array.filter(item => {
      if (seen.has(item.checkListStep)) {
        return false;
      }
      seen.add(item.checkListStep);
      return true;
    });
  };

  const getAllCheckList = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/project/checklist/all`)
      .then(response => {
        setData(response?.data?.data);
        var uniqueData = filterUniqueNames(response?.data?.data);
        setUniqueStep(uniqueData);
      })
      .catch(error => {
        console.log(error);
        setData([]);
      });
  };

  const confirmDelete = id => {
    setId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setDeleteDialogOpen(false);
  };
  const handleDelete = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/delete/${id}`
      )
      .then(response => {
        if (response) {
          toast('Record deleted successfully');
          getAllCheckList();
          setOpen(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const AddNewField = (itemId, heading, name) => {
    setId(itemId);
    setHeading(heading);
    setCheckName(name);
    setPointAddOpen(true);
  };
  const AddNewCheckName = (itemId, name) => {
    setCheckNameAdd(true);
    setId(itemId);
    setCheckName(name);
    setAddFieldOpen(true);
    setNewField('');
    setChecklistItems([{ heading: '', points: [{ point: '' }] }]);
  };
  const confirmDeleteField = (itemId, heading, checkName, checkPoint) => {
    setId(itemId);
    setHeading(heading);
    setCheckName(checkName);
    setNewField(checkPoint);
    setDeleteDialogOpen(true);
  };
  const DeleteField = () => {
    const data = {
      id: id,
      heading: heading,
      name: checkName,
      point: newField,
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/deletepoint`,
        data
      )
      .then(response => {
        if (response) {
          toast(`${response.data.message}`);
          setDeleteDialogOpen(false);
          getAllCheckList();
        }
      })
      .catch(error => {
        toast('Error while delete checklist point');
        console.log(error);
      });
  };
  const handleFieldCancel = () => {
    setAddFieldOpen(false);
  };
  const handlePointAddCancel = () => {
    setPointAddOpen(false);
  };
  const handleUpdateNewField = () => {
    const isAnyHeadingEmpty = checklistItems.some(item => !item.heading.trim());
    if (isAnyHeadingEmpty) {
      toast('Checklist heading is required');
      return; // Exit early if any heading is empty
    }
    // Check if any checklist item point is empty
    const isAnyPointEmpty = checklistItems.some(item =>
      item.points.some(point => !point.point.trim())
    );
    if (isAnyPointEmpty) {
      toast('Checklist point is required');
      return; // Exit early if any point is empty
    } else {
      const data = {
        id: id,
        name: checkName,
        checkList: checklistItems,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/addpoint`,
          data
        )
        .then(response => {
          if (response) {
            toast(response.data.message);
            setAddFieldOpen(false);
            getAllCheckList();
            setChecklistItems([{ heading: '', points: [{ point: '' }] }]);
          }
        })
        .catch(error => {
          toast('Error while add checklist');
          console.log(error);
        });
    }
  };
  const handleSubmitPoint = () => {
    if (!point) {
      toast('Point is required');
    } else {
      const data = {
        id: id,
        name: checkName,
        heading: heading,
        point: point,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/addextrapoint`,
          data
        )
        .then(response => {
          if (response) {
            toast(response.data.message);
            setPointAddOpen(false);
            getAllCheckList();
            setPoint('');
          }
        })
        .catch(error => {
          toast('Error while add checklist');
          console.log(error);
        });
    }
  };
  return (
    <>
      <AsideContainer>
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-[25px] font-ubuntu font-bold my-5 -md:text-lg -lg:my-2 -md:my-3">
            Inspections List
          </h1>
          <button
            className="bg-secondary text-primary rounded-3xl px-4 pr-5 py-3 flex flex-row gap-1 items-center -md:text-xs -md:px-2 -md:py-[6px] -md:[&_svg]:text-sm"
            onClick={() => router.push('/admin/inspections/add')}
          >
            <Add />
            Add CheckList
          </button>
        </div>
        <div className="row mt-4">
          {uniqueStep?.map(itm => (
            <div key={itm.checkListStep}>
              {/* <h3 className="text-secondary font-bold text-xl font-ubuntu mb-4 -md:text-base">
                {itm.checkListStep}
                {` Checklist`}
              </h3> */}
              <Accordion type="single" id="checklist" collapsible>
                {data
                  ?.filter(dt => dt.checkListStep === itm.checkListStep)
                  ?.map((item, idc) => (
                    <AccordionItem
                      value={item.name + +idc}
                      key={item.name + +idc}
                      className="bg-white px-4 py-1 rounded-2xl mb-2"
                    >
                      <AccordionTrigger>
                        <span className="font-semibold font-ubuntu">
                          {item.name}
                        </span>
                        {/* <span
                                className="process-delete"
                                onClick={() => confirmDelete(item?._id)}
                              >
                                Delete
                              </span> */}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div>
                          <div className="flex flex-row justify-end mb-2">
                            <span
                              onClick={() =>
                                AddNewCheckName(item?._id, item?.name)
                              }
                              className="flex flex-row items-center gap-1 text-primary font-semibold text-sm p-2 rounded-full border border-primary bg-primary-foreground [&_svg]:text-primary cursor-pointer"
                            >
                              <FaPlus
                                data-tooltip-id="my-tooltipname"
                                data-tooltip-content="Add Point"
                                data-tooltip-place="top"
                              />
                              <p>Add Checkpoint</p>
                            </span>
                          </div>
                          <Accordion type="single" id="checks" collapsible>
                            {item.checkList?.map((itm, index) => (
                              <AccordionItem
                                className="no-underline border-none my-1"
                                key={itm.heading}
                                value={itm.heading}
                              >
                                <AccordionTrigger className="border border-primary rounded-lg px-2 py-3">
                                  <div className="flex flex-row justify-between items-center gap-4 w-full">
                                    <h5 className="text-sm font-semibold">
                                      {itm.heading}
                                    </h5>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0 pl-2">
                                  <div className="flex flex-row justify-end items-center my-2">
                                    <span
                                      onClick={() =>
                                        AddNewField(
                                          item?._id,
                                          itm?.heading,
                                          item?.name
                                        )
                                      }
                                      className="flex flex-row items-center gap-1 text-primary font-semibold text-sm p-2 rounded-full border border-primary bg-primary-foreground [&_svg]:text-primary cursor-pointer"
                                    >
                                      <FaPlus
                                        data-tooltip-id="my-tooltip1"
                                        data-tooltip-content="Add new point"
                                        data-tooltip-place="top"
                                      />
                                      <p>Add Point</p>
                                    </span>
                                  </div>
                                  <div>
                                    {itm?.points?.map((dt, idx) => (
                                      <div
                                        key={dt.point}
                                        className="flex flex-row gap-4 items-center -md:gap-2"
                                      >
                                        <div className="relative -md:w-8">
                                          <div className="h-full w-6 flex items-center justify-center">
                                            <span
                                              className={cn(
                                                'w-[2px] bg-secondary pointer-events-none h-12',
                                                idx === 0
                                                  ? 'mt-[100%] h-5'
                                                  : '',
                                                idx === itm.points.length - 1
                                                  ? 'mb-[100%] h-5'
                                                  : ''
                                              )}
                                            />
                                            <span className="w-6 h-6 absolute rounded-full shadow-xl text-center border border-dashed border-primary p-[3px]" />
                                            <span className="w-4 absolute h-4 -ml-[1px] rounded-full bg-primary shadow-xl text-center" />
                                          </div>
                                        </div>
                                        <div className="flex flex-row items-center justify-between w-full">
                                          <p className="text-xs font-semibold">
                                            {dt?.point}
                                          </p>
                                          <span
                                            onClick={() =>
                                              confirmDeleteField(
                                                item?._id,
                                                itm?.heading,
                                                item?.name,
                                                dt?.point
                                              )
                                            }
                                            className="flex flex-row items-center gap-1 text-primary font-semibold text-sm p-2 rounded-full border border-primary bg-primary-foreground [&_svg]:text-primary [&_svg]:text-lg cursor-pointer"
                                          >
                                            <MdDeleteOutline />
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))}
          {uniqueStep?.length === 0 && (
            <p className="text-center mt-5">No record available</p>
          )}
        </div>
      </AsideContainer>

      {/* Dialog for  delete */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none -lg:w-3/4">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Delete Checkpoint
            </h3>
            <hr className="my-4" />
          </div>
          <h5>Are your sure you want to delete ?</h5>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Add new work field Dialog */}
      <Modal
        open={addFieldOpen}
        onClose={handleFieldCancel}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="bg-white -xl:w-1/2 w-1/3 p-8 rounded-3xl outline-none -md:w-11/12">
          {checklistItems.map((item, index) => (
            <FormControl
              fullWidth
              key={index}
              className="p-2 rounded-1 mb-2 check-container mt-1"
            >
              <div className="flex flex-row justify-between mb-2">
                <span className="font-semibold">
                  Heading
                  <span className="text-danger">*</span>
                </span>
                <div className="flex flex-row gap-2">
                  {index === checklistItems.length - 1 && (
                    <span
                      onClick={handleAddChecklistItem}
                      className="p-2 rounded-full border border-primary bg-primary-foreground [&_svg]:text-primary cursor-pointer"
                    >
                      <FaPlus />
                    </span>
                  )}
                  {index !== 0 && (
                    <span
                      onClick={() => handleRemoveChecklistItem(index)}
                      className="p-2 rounded-full border border-primary bg-primary-foreground [&_svg]:text-primary cursor-pointer"
                    >
                      <FaMinus />
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 mb-2">
                <input
                  className="h-[54px] border border-primary px-4  text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  placeholder="Enter Heading"
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
                  <div fullWidth key={idx}>
                    <div className="w-full flex flex-row justify-between items-center mb-2">
                      <span className="font-semibold">
                        Point {` ${idx + 1}`}
                        <span className="text-danger">*</span>
                      </span>
                      <div className="flex flex-row gap-2">
                        {idx === item.points?.length - 1 && (
                          <span
                            onClick={() => handleAddChecklistPoint(index)}
                            className="p-2 rounded-full border border-primary bg-primary-foreground [&_svg]:text-primary cursor-pointer"
                          >
                            <FaPlus />
                          </span>
                        )}
                        {idx !== 0 && (
                          <span
                            onClick={() =>
                              handleRemoveChecklistPoint(index, idx)
                            }
                            className="p-2 rounded-full border border-primary bg-primary-foreground [&_svg]:text-primary"
                          >
                            <FaMinus />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 my-1">
                      <input
                        className="h-[54px] border border-primary px-4  text-gray-600 outline-none rounded-[7px] bg-gray-100"
                        placeholder="Enter checklist point ..."
                        name="point"
                        value={itm.point}
                        onChange={e => {
                          const newItems = [...checklistItems];
                          newItems[index].points[idx].point = e.target.value;
                          setChecklistItems(newItems);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </FormControl>
          ))}
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleFieldCancel}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleUpdateNewField}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
      {/* Dialog for field delete */}
      <Modal
        open={deleteDialogOpen}
        onClose={handleClose}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl -md:w-3/4 outline-none">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Delete Point
            </h3>
            <hr className="my-4" />
          </div>
          <h5>Are your sure you want to delete ?</h5>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={DeleteField}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* dialog for add point */}
      <Modal
        open={pointAddOpen}
        onClose={handlePointAddCancel}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl -md:w-3/4 outline-none">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Add New Point
            </h3>
            <hr className="my-4" />
          </div>
          <div className="grid grid-cols-1">
            <input
              id="role"
              type="text"
              className="h-[54px] border border-primary px-4  text-gray-600 outline-none rounded-[7px] bg-gray-100"
              name="point"
              value={point}
              onChange={e => setPoint(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handlePointAddCancel}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleSubmitPoint}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Page;
