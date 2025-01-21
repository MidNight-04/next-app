"use client";
import { useEffect, useRef, useState } from "react";
import { Cancel, Check, Clear, Flag, Repeat } from "@mui/icons-material";
// import VoiceRecorder from "./VoiceRecorder";
import { FaFile, FaMicrophone } from "react-icons/fa6";
import { MdAttachFile, MdOutlineAccessAlarm } from "react-icons/md";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import dayjs from "dayjs";
import "dayjs/locale/en-gb"; // Import locale if needed
import { FaPlus, FaTimes } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai"; // Import check icon
import { redirect } from "next/navigation";
import AsideContainer from "../../../../components/AsideContainer";

const styles = {
  container: {
    width: "430px",
    padding: "25px 20px",
    backgroundColor: "#f7f7f7",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  reminderRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  select: {
    marginRight: "10px",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  input: {
    width: "50px",
    marginRight: "10px",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  deleteButton: {
    // backgroundColor: "#ff4d4d",
    border: "none",
    padding: "5px",
    // borderRadius: "4px",
    cursor: "pointer",
    color: "#ff4d4d",
    fontSize: "18px",
  },
  addButton: {
    backgroundColor: "#28a745",
    border: "none",
    padding: "6px 10px",
    borderRadius: "50%",
    color: "#fff",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#28a745",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
    marginTop: "20px",
  },
};

const Page = () => {
  const [reminders, setReminders] = useState([
    { type: "", time: "", unit: "" },
  ]);
  const [categoryList, setCategoryList] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [fileName, setFileName] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [time, setTime] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [checked, setChecked] = useState(false);
  // const activeUser = localStorage.getItem("activeUser");
  // const activeEmployee = localStorage.getItem("employeeID");
  // const userName = localStorage.getItem("userName");
  const activeUser = "";
  const activeEmployee = "";
  const userName = "";

  const [data, setData] = useState({
    title: "",
    description: "",
    member: "",
    memberName: "",
    category: "",
    priority: "",
    repeatType: "",
    repeatTime: "",
    dueDate: "",
    file: "",
    audio: "",
    reminder: [],
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`)
      .then(response => {
        if (response) {
          //   console.log(response.data.data);
          setMemberList(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/category/list`)
      .then(response => {
        setCategoryList(response?.data?.data);
        // console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!checked) {
      setData(prevData => ({
        ...prevData,
        repeatType: "",
      }));
      setSelectedDate(null);
    }
  }, [checked]);

  const handleFormData = e => {
    const { value, name, files } = e.target;
    if (name === "repeatType" && value) {
      setData({ ...data, [name]: value });
      setTime(false);
      if (value === "Monthly") {
        setDateOpen(true);
      } else if (value === "Daily") {
        setTimeOpen(true);
      }
    } else if (name === "file") {
      if (files && files[0]) {
        setFileSelected(true);
        setData({ ...data, [name]: files[0] });
        setFileName(files[0].name); // Update fileName state
      }
    } else if (name === "member") {
      setData({ ...data, [name]: value });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handlePriority = priority => {
    setSelectedPriority(priority);
    // Update the state with the new priority value
    setData(prevData => ({
      ...prevData,
      priority: priority,
    }));
  };

  const handleCancel = () => {
    setDateOpen(false);
    setTimeOpen(false);
    setReminderOpen(false);
    setSelectedDate(null);
    setSelectedPriority(dayjs());
  };
  const handleSave = () => {
    setData(prevData => ({
      ...prevData,
      repeatTime: selectedDate ? selectedDate : selectedTime.format("hh:mm A"),
    }));
    setDateOpen(false);
    setTimeOpen(false);
    setTime(true);
  };

  /* ~ ~ ~ Recording ~ ~ ~ */

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = event => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/wav" });
          setData(prevData => ({
            ...prevData,
            audio: blob,
          }));
          setAudioURL(URL.createObjectURL(blob));
          chunksRef.current = [];
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    } else {
      alert("Media Devices not supported");
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  const clearRecording = () => {
    setAudioURL("");
    setData(prevData => ({
      ...prevData,
      audio: "",
    }));
  };

  /* ~ ~ ~ Time picker ~ ~ ~  */

  const handleTimeChange = newValue => {
    // Check if newValue is a valid dayjs object
    if (newValue && newValue.isValid()) {
      setSelectedTime(newValue); // Update state with dayjs object
    } else {
      console.error("Invalid date value:", newValue);
    }
  };

  /* ~ ~ ~ Reminder ~ ~ ~ */

  // Function to handle adding a new reminder
  const addReminder = () => {
    setReminders([...reminders, { type: "", time: "", unit: "" }]);
  };

  // Function to handle removing a reminder
  const removeReminder = index => {
    // Ensure that at least one reminder remains
    if (reminders.length > 1) {
      const newReminders = reminders.filter((_, i) => i !== index);
      setReminders(newReminders);
    } else {
      toast.warning("Not Allowed", {
        position: "top-center",
      });
    }
  };

  // Function to handle saving reminders
  const saveReminders = () => {
    const hasNonEmptyValue = reminders?.some(
      obj =>
        obj.type &&
        obj.type.trim() !== "" &&
        obj.time &&
        obj.time.trim() !== "" &&
        obj.unit &&
        obj.unit.trim() !== ""
    );
    if (hasNonEmptyValue) {
      setData(prevData => ({
        ...prevData,
        reminder: reminders,
      }));
      setReminderOpen(false);
    } else {
      toast.error("Field are mandatory", {
        position: "top-center",
      });
    }
  };

  // Function to handle updating reminder values
  const updateReminder = (index, field, value) => {
    const newReminders = reminders.map((reminder, i) =>
      i === index ? { ...reminder, [field]: value } : reminder
    );
    setReminders(newReminders);
  };

  /* ~ ~ ~ Submit form ~ ~ ~ */

  const submitFormData = () => {
    data.assignedBy = {
      name: userName,
      employeeID: activeEmployee ? activeEmployee : activeUser,
    };
    if (!data.title) {
      toast.error("Task Title is required", {
        position: "top-right",
      });
    } else if (!data.description) {
      toast.error("Title Description is required", {
        position: "top-right",
      });
    } else if (!data.member) {
      toast.error("Member is required", {
        position: "top-right",
      });
    } else if (!data.category) {
      toast.error("Category is required", {
        position: "top-right",
      });
    } else if (!data.priority) {
      toast.error("Priority is required", {
        position: "top-right",
      });
    } else if (!data.dueDate) {
      toast.error("Due Date is required", {
        position: "top-right",
      });
    } else {
      let employeeID = activeEmployee ? activeEmployee : activeUser;
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("member", data.member?.split("/")[0]);
      formData.append("memberName", data.member?.split("/")[1]);
      formData.append("assignedName", userName);
      formData.append("assignedID", employeeID);
      formData.append("category", data.category);
      formData.append("priority", data.priority);
      formData.append("repeatType", data.repeatType);
      formData.append("repeatTime", data.repeatTime);
      formData.append("dueDate", data.dueDate);
      formData.append("file", data.file);
      if (data.audio) {
        formData.append("audio", data.audio, "recording.wav");
      } else {
        formData.append("audio", data.audio);
      }
      formData.append("reminder", JSON.stringify(data.reminder));
      //   console.log(audioURL)
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/task/add`, formData)
        .then(response => {
          if (response.data.status === 201) {
            setData({
              title: "",
              description: "",
              member: "",
              memberName: "",
              category: "",
              priority: "",
              repeatType: "",
              repeatTime: "",
              dueDate: "",
              file: "",
              audio: "",
              reminder: [],
            });
            clearRecording();
            setReminders([{ type: "", time: "", unit: "" }]);
            setFileName("");
            setSelectedPriority("");
            setChecked(false);
            toast.success(response.data.message, {
              position: "top-right",
            });
            redirect("/admin/taskdashboard");
          } else {
            toast.error(response.data.message, {
              position: "top-right",
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <AsideContainer>
      <div className="datatable">
        <div className="datatableTitle detail-heading mb-3">
          <p className="project-list-client">Assign New Task</p>
        </div>
        <div className="single">
          {/* <AdminSidebar /> */}
          <div className="singleContainer">
            {/* <AdminNavbar /> */}
            <div className="adminNewUser">
              <div className="newContainer">
                <div className="bottomContainer">
                  <div className="bottomRightContainer">
                    <div className="form">
                      <div className="formInputContainer">
                        <label>
                          Task Title<span className="text-danger">*</span>
                        </label>
                        <input
                          value={data.title}
                          type="text"
                          //   placeholder="Enter Name"
                          name="title"
                          onChange={e => handleFormData(e)}
                        />
                      </div>
                      <div className="formInputContainer">
                        <label>
                          Description<span className="text-danger">*</span>
                        </label>
                        <input
                          value={data.description}
                          type="text"
                          //   placeholder="Enter Employee ID"
                          name="description"
                          onChange={e => handleFormData(e)}
                        />
                      </div>
                      <div className="formInputContainer">
                        <label htmlFor="role">
                          Member<span className="text-danger">*</span>
                        </label>
                        <select
                          style={{ width: "100%", height: "30px" }}
                          className="mt-2"
                          name="member"
                          value={data.member}
                          onChange={e => handleFormData(e)}
                        >
                          <option value="">Member</option>
                          {memberList?.map((item, idx) => {
                            return (
                              <option
                                key={idx}
                                value={`${item?.employeeID}/${item?.name}`}
                              >
                                {`${item?.name} (${item?.role})`}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="formInputContainer">
                        <label>
                          Category<span className="text-danger">*</span>
                        </label>
                        <select
                          style={{ width: "100%", height: "30px" }}
                          className="mt-2"
                          name="category"
                          value={data.category}
                          onChange={e => handleFormData(e)}
                        >
                          <option value="">Category</option>
                          {categoryList?.map((itm, idx) => {
                            return (
                              <option key={idx} value={itm.name}>
                                {itm.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="formInputContainer">
                        <label>
                          <Flag />
                          Priority<span className="text-danger">*</span>
                        </label>
                        <div className="task_priority">
                          <p
                            className={`priority-option ${
                              selectedPriority === "High" ? "selected" : ""
                            }`}
                            onClick={() => handlePriority("High")}
                          >
                            {selectedPriority === "High" && (
                              <span className="tick">&#10003;</span>
                            )}
                            High
                          </p>
                          <p
                            className={`priority-option ${
                              selectedPriority === "Medium" ? "selected" : ""
                            }`}
                            onClick={() => handlePriority("Medium")}
                          >
                            {selectedPriority === "Medium" && (
                              <span className="tick">&#10003;</span>
                            )}
                            Medium{" "}
                          </p>
                          <p
                            className={`priority-option ${
                              selectedPriority === "Low" ? "selected" : ""
                            }`}
                            onClick={() => handlePriority("Low")}
                          >
                            {selectedPriority === "Low" && (
                              <span className="tick">&#10003;</span>
                            )}
                            Low{" "}
                          </p>
                        </div>
                      </div>
                      <div className="formInputContainer">
                        <label className="checkbox">
                          <Repeat />
                          Repeat{" "}
                          <input
                            type="checkbox"
                            value={checked}
                            onClick={() => setChecked(!checked)}
                            aria-label="Toggle repeat options"
                          />
                          <span className="slider"></span>
                        </label>
                        {checked && (
                          <select
                            style={{ width: "100%", height: "30px" }}
                            className="mt-2"
                            name="repeatType"
                            value={data.repeatType}
                            onChange={e => handleFormData(e)}
                            aria-label="Select repeat type"
                          >
                            <option value="">Select</option>
                            <option value="Daily">Daily</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        )}
                        {data?.repeatType && time && (
                          <p className="repeat">
                            Repeat{" "}
                            {data.repeatType === "Daily" ? "Time" : "Date"}:{" "}
                            {selectedDate
                              ? selectedDate.getDate()
                              : data.repeatTime}
                          </p>
                        )}
                      </div>
                      <div className="formInputContainer">
                        <label>
                          Due Date<span className="text-danger">*</span>
                        </label>
                        <input
                          value={data.dueDate}
                          type="date"
                          name="dueDate"
                          onChange={e => handleFormData(e)}
                        />
                      </div>
                      <div className="file_block">
                        <div>
                          {/* Hide the default file input */}
                          <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            name="file"
                            onChange={e => handleFormData(e)}
                          />
                          {/* Custom styled label that acts as a file picker */}
                          <label
                            htmlFor="fileInput"
                            style={{
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                            className={
                              fileSelected
                                ? "task_file me-3 bg-success text-light"
                                : "task_file me-3"
                            }
                            name="file"
                          >
                            <MdAttachFile />
                          </label>
                        </div>
                        <div>
                          <button
                            onClick={
                              isRecording ? stopRecording : startRecording
                            }
                            style={{
                              color: isRecording ? "red" : "black",
                              fontSize: "18px",
                            }}
                            className={
                              audioURL
                                ? "task_file me-3 mt-3 bg-success text-light"
                                : "task_file me-3 mt-3"
                            }
                          >
                            <FaMicrophone />
                          </button>
                        </div>
                        <button
                          style={{
                            fontSize: "18px",
                          }}
                          className={
                            reminders?.length > 0 &&
                            reminders?.some(
                              obj =>
                                obj.type &&
                                obj.type.trim() !== "" &&
                                obj.time &&
                                obj.time.trim() !== "" &&
                                obj.unit &&
                                obj.unit.trim() !== ""
                            )
                              ? "task_file me-3 mt-3 bg-success text-light"
                              : "task_file me-3 mt-3"
                          }
                          onClick={() => {
                            setReminderOpen(true);
                            setReminders([{ type: "", time: "", unit: "" }]);
                          }}
                        >
                          <MdOutlineAccessAlarm />
                        </button>
                      </div>
                    </div>
                    <div className="display_file mt-4 formInputContainer">
                      {/* Display the selected file name */}
                      {fileName && (
                        <p className="file_name_display">
                          <span className="fw-bold">File: </span>
                          {fileName}
                        </p>
                      )}
                      {/* Display audio file */}
                      {audioURL && (
                        <div className="record_block">
                          <span className="head">Voice-Note</span>
                          <audio
                            controls
                            src={audioURL}
                            className="audio-record"
                          />
                          {audioURL && (
                            <>
                              <span
                                className="audio_clear"
                                onClick={clearRecording}
                                disabled={!audioURL}
                              >
                                <Clear
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                  }}
                                  className="text-danger me-2"
                                />
                                Clear
                              </span>
                            </>
                          )}
                        </div>
                      )}
                      {/* Display reminder */}

                      {reminders?.length > 0 &&
                        reminders?.some(
                          obj =>
                            obj.type &&
                            obj.type.trim() !== "" &&
                            obj.time &&
                            obj.time.trim() !== "" &&
                            obj.unit &&
                            obj.unit.trim() !== ""
                        ) && (
                          <div className="reminder_block">
                            {reminders?.map((item, idx) => {
                              return (
                                <>
                                  <span key={idx}>
                                    <MdOutlineAccessAlarm
                                      className="me-2"
                                      style={{ fontSize: "18px" }}
                                    />
                                    {`${item.type} ${item.time} ${item.unit}`}
                                  </span>
                                  <br />
                                </>
                              );
                            })}
                          </div>
                        )}
                    </div>
                    <div
                      className="createUserSubmitBTN"
                      onClick={submitFormData}
                    >
                      Submit
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={dateOpen} onClose={handleCancel}>
          <DialogTitle>Select Date</DialogTitle>
          <DialogContent style={{ width: "500px", height: "260px" }}>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="dd"
              showMonthDropdown={false}
              showYearDropdown={false}
              placeholderText="Select Date"
              showMonthYearPicker={false} // Disables month/year picker
              todayButton="Today"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={timeOpen} onClose={handleCancel}>
          <DialogTitle>Select Time</DialogTitle>
          <DialogContent style={{ width: "500px", height: "260px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticTimePicker
                orientation="landscape"
                value={selectedTime} // Pass the selected time
                onChange={handleTimeChange}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={reminderOpen} onClose={handleCancel}>
          <DialogTitle>
            <MdOutlineAccessAlarm className="me-2 fs-4" />
            Add Task Reminders
          </DialogTitle>
          <DialogContent style={{ width: "500px", height: "250px" }}>
            <div style={styles.container}>
              {reminders?.map((reminder, index) => (
                <div key={index} style={styles.reminderRow}>
                  <select
                    value={reminder.type}
                    onChange={e =>
                      updateReminder(index, "type", e.target.value)
                    }
                    style={styles.select}
                  >
                    <option value="">Select</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>

                  <input
                    type="number"
                    value={reminder.time}
                    onChange={e =>
                      updateReminder(index, "time", e.target.value)
                    }
                    style={styles.input}
                  />

                  <select
                    value={reminder.unit}
                    onChange={e =>
                      updateReminder(index, "unit", e.target.value)
                    }
                    style={styles.select}
                  >
                    <option value="">Select</option>
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                  </select>
                  {index === 0 ? (
                    <button onClick={addReminder} style={styles.addButton}>
                      <FaPlus />
                    </button>
                  ) : (
                    <button
                      onClick={() => removeReminder(index)}
                      style={styles.deleteButton}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={saveReminders} style={styles.saveButton}>
                Save Reminders
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AsideContainer>
  );
};

export default Page;
