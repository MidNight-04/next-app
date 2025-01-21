import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { TiMinus } from "react-icons/ti";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

const SortableItem = ({ id, item }) => {
  const [expanded, setExpanded] = useState(false);
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const style = {
    // transformOrigin: "50% 50%",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  const AddNewField = (itemId, point) => {
    setId(itemId);
    setPoint(point);
    setAddFieldOpen(true);
    setNewField("");
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`)
      .then(response => {
        if (response) {
          const uniqueRoles = response.data.data.filter(
            (user, index, self) =>
              index === self.findIndex(u => u.role === user.role)
          );
          setMemberList(uniqueRoles);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const confirmDeleteField = (itemId, point) => {
    setId(itemId);
    setPoint(point);
    setDeleteDialogOpen(true);
  };

  return (
    <Accordion
      style={style}
      expanded={expanded === id}
      onChange={handleChange(id)}
      sx={{ width: "96rem" }}
      className={cn(
        "w-full bg-white rounded-md py-2 px-4 cursor-grabs shadow-sm mb-2"
        // isDragging ? "opacity-50 cursor-grabbing shadow-lg scale-[1.01]" : ""
      )}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel1bh-${id}-content`}
        id={`panel1bh-${id}-header`}
      >
        <div
          className={cn(
            "w-full bg-white flex flex-row justify-between",
            isDragging
              ? "opacity-50 cursor-grabbing shadow-lg scale-[1.01]"
              : ""
          )}
        >
          <button
            className={cn(
              "hover:bg-slate-200 rounded-md p-3 mr-2",
              isDragging
                ? "opacity-50 cursor-grabbing shadow-lg scale-[1.01]"
                : ""
            )}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
          >
            <svg viewBox="0 0 20 20" width="12">
              <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
            </svg>
          </button>
          <h3 className="w-full font-ubuntu text-lg font-semibold leading-none content-center">
            {item.name}
          </h3>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {item.points?.map((itm, idx) => {
          return (
            <div
              key={idx}
              className="bg-white w-full flex flex-row justify-between px-2 py-2"
            >
              <div>
                {`${itm.content} (`}
                <span className="fw-bold">{`Issue Member - `}</span>
                {itm.issueMember?.map((mem, ids) => {
                  return (
                    <>
                      <span key={ids} style={{ color: "#fec20e" }}>
                        {mem}
                      </span>
                      {ids === itm.issueMember?.length - 1 ? "" : "/"}
                    </>
                  );
                })}
                {`)`}
              </div>
              <div className="flex flex-row gap-4 ">
                <div className="bg-gray-200 rounded-md px-2 py-2 cursor-pointer hover:bg-slate-300">
                  <FaPlus
                    onClick={() => AddNewField(item?._id, itm?.point)}
                    data-tooltip-id="my-tooltip1"
                    data-tooltip-content="Add New Field"
                    data-tooltip-place="top"
                  />
                </div>
                <div className="bg-gray-200 rounded-md px-2 py-2 cursor-pointer hover:bg-slate-300">
                  <TiMinus
                    onClick={() => confirmDeleteField(item?._id, itm?.point)}
                    data-tooltip-id="my-tooltip2"
                    data-tooltip-content="Delete Field"
                    data-tooltip-place="top"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default SortableItem;
