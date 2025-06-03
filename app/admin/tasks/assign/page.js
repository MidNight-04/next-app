'use client';
import { useEffect, useRef, useState } from 'react';
import { Cancel, Check, Clear, Flag, Repeat } from '@mui/icons-material';
// import VoiceRecorder from "./VoiceRecorder";
import { FaFile, FaMicrophone } from 'react-icons/fa6';
import { MdAttachFile, MdOutlineAccessAlarm } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb'; // Import locale if needed
import { FaPlus, FaTimes } from 'react-icons/fa';
import { AiOutlineCheck } from 'react-icons/ai'; // Import check icon
import { redirect } from 'next/navigation';
import AsideContainer from '../../../../components/AsideContainer';
import { IoIosArrowBack } from 'react-icons/io';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useRouter } from 'next/navigation';

const styles = {
  container: {
    width: '430px',
    padding: '25px 20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  reminderRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  select: {
    marginRight: '10px',
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  input: {
    width: '50px',
    marginRight: '10px',
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  deleteButton: {
    // backgroundColor: "#ff4d4d",
    border: 'none',
    padding: '5px',
    // borderRadius: "4px",
    cursor: 'pointer',
    color: '#ff4d4d',
    fontSize: '18px',
  },
  addButton: {
    backgroundColor: '#28a745',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#28a745',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
  },
};

const Page = () => {
  const router = useRouter()
  const [reminders, setReminders] = useState([
    { type: '', time: '', unit: '' },
  ]);
  const [categoryList, setCategoryList] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [fileName, setFileName] = useState('');
  const [memberList, setMemberList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [time, setTime] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [checked, setChecked] = useState(false);
  const userId = useAuthStore(state => state.userId);
  const userName = useAuthStore(state => state.username);

  const [data, setData] = useState({
    title: '',
    description: '',
    member: '',
    memberName: '',
    category: '',
    repeatType: 'norepeat',
    priority: 'High',
    repeatTime: '',
    dueDate: '',
    file: '',
    audio: '',
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
        repeatType: '',
      }));
      setSelectedDate(null);
    }
  }, [checked]);

  const handleFormData = e => {
    const { value, name, files } = e.target;
    if (name === 'repeatType' && value) {
      setData({ ...data, [name]: value });
      setTime(false);
      if (value === 'Monthly') {
        setDateOpen(true);
      } else if (value === 'Daily') {
        setTimeOpen(true);
      }
    } else if (name === 'file') {
      if (files && files[0]) {
        setFileSelected(true);
        setData({ ...data, [name]: files[0] });
        setFileName(files[0].name); // Update fileName state
      }
    } else if (name === 'member') {
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
      repeatTime: selectedDate ? selectedDate : selectedTime.format('hh:mm A'),
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
          const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
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
        console.error('Error accessing media devices.', err);
      }
    } else {
      alert('Media Devices not supported');
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  const clearRecording = () => {
    setAudioURL('');
    setData(prevData => ({
      ...prevData,
      audio: '',
    }));
  };

  /* ~ ~ ~ Time picker ~ ~ ~  */

  const handleTimeChange = newValue => {
    // Check if newValue is a valid dayjs object
    if (newValue && newValue.isValid()) {
      setSelectedTime(newValue); // Update state with dayjs object
    } else {
      console.error('Invalid date value:', newValue);
    }
  };

  /* ~ ~ ~ Reminder ~ ~ ~ */

  // Function to handle adding a new reminder
  const addReminder = () => {
    setReminders([...reminders, { type: '', time: '', unit: '' }]);
  };

  // Function to handle removing a reminder
  const removeReminder = index => {
    // Ensure that at least one reminder remains
    if (reminders.length > 1) {
      const newReminders = reminders.filter((_, i) => i !== index);
      setReminders(newReminders);
    } else {
      toast('Not Allowed');
    }
  };

  // Function to handle saving reminders
  const saveReminders = () => {
    const hasNonEmptyValue = reminders?.some(
      obj =>
        obj.type &&
        obj.type.trim() !== '' &&
        obj.time &&
        obj.time.trim() !== '' &&
        obj.unit &&
        obj.unit.trim() !== ''
    );
    if (hasNonEmptyValue) {
      setData(prevData => ({
        ...prevData,
        reminder: reminders,
      }));
      setReminderOpen(false);
    } else {
      toast('Field are mandatory');
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
      employeeID: userId,
    };
    if (!data.title) {
      toast('Task Title is required');
    } else if (!data.description) {
      toast('Title Description is required');
    } else if (!data.member) {
      toast('Member is required');
    } else if (!data.category) {
      toast('Category is required');
    } else if (!data.priority) {
      toast('Priority is required');
    } else if (!data.dueDate) {
      toast('Due Date is required');
    } else {
      let employeeID = userId;
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('member', data.member?.split('/')[0]);
      formData.append('memberName', data.member?.split('/')[1]);
      formData.append('assignedName', userName);
      formData.append('assignedID', userId);
      formData.append('category', data.category);
      formData.append('priority', data.priority);
      formData.append('repeatType', data.repeatType);
      formData.append('repeatTime', data.repeatTime);
      formData.append('dueDate', data.dueDate);
      formData.append('file', data.file);
      if (data.audio) {
        formData.append('audio', data.audio, 'recording.wav');
      } 
      formData.append('reminder', JSON.stringify(data.reminder));
      //   console.log(audioURL)
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/task/add`, formData)
        .then(response => {
          if (response.data.status === 201) {
            setData({
              title: '',
              description: '',
              member: '',
              memberName: '',
              category: '',
              priority: '',
              repeatType: '',
              repeatTime: '',
              dueDate: '',
              file: '',
              audio: '',
              reminder: [],
            });
            clearRecording();
            setReminders([{ type: '', time: '', unit: '' }]);
            setFileName('');
            setSelectedPriority('');
            setChecked(false);
            toast(response.data.message, {
              position: 'top-right',
            });
            router.back();
          } else {
            toast(response.data.message, {
              position: 'top-right',
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
      <div className="flex flex-col my-4 justify-between -md:flex-col -md:gap-2 -md:pl-0 -md:my-2">
        <div className="flex flex-row gap-2 items-center">
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition
            duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Assign Task
          </h1>
        </div>
        <div className="bg-white rounded-[15px] p-5 my-5">
          <div className="">
            <div className="grid grid-cols-2 gap-x-4">
              <div className="flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label>Task Title</label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  value={data.title}
                  type="text"
                  placeholder="Task Title"
                  name="title"
                  onChange={e => handleFormData(e)}
                />
              </div>
              <div className="flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label>Description</label>
                <input
                  value={data.description}
                  placeholder="Description"
                  type="text"
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  name="description"
                  onChange={e => handleFormData(e)}
                />
              </div>
              <div className="flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label htmlFor="role">Member</label>
                <Select
                  onValueChange={value => {
                    setData(prevData => ({
                      ...prevData,
                      member: value,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberList?.map((item, idx) => {
                      return (
                        <SelectItem
                          key={idx}
                          value={`${item?._id}/${item?.name}`}
                        >
                          {`${item?.name} (${item?.role?.name})`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label>Category</label>
                <Select
                  onValueChange={value => {
                    setData(prevData => ({
                      ...prevData,
                      category: value,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryList?.map((itm, idx) => {
                      return (
                        <SelectItem key={idx} value={itm.name}>
                          {itm.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label>
                  {/* <Flag /> */}
                  Priority
                </label>
                <Select
                  onValueChange={value => {
                    setData(prevData => ({
                      ...prevData,
                      priority: value,
                    }));
                  }}
                  defaultValue="High"
                  value={data.priority}
                >
                  <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label className="checkbox">
                  {/* <Repeat /> */}
                  Repeat
                </label>
                <Select
                  onValueChange={value => {
                    setData(prevData => ({
                      ...prevData,
                      repeatType: value,
                    }));
                    if (value === 'Monthly') {
                      setDateOpen(true);
                    } else if (value === 'Daily') {
                      setTimeOpen(true);
                    }
                  }}
                  value={data.repeatType}
                >
                  <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="norepeat">
                      Once
                    </SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                    {/* <SelectItem value="Periodically">Periodically</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem> */}
                  </SelectContent>
                </Select>

                {data?.repeatType && time && (
                  <p className="font-semibold">
                    Repeat {data.repeatType === 'Daily' ? 'Time' : 'Date'}:{' '}
                    {selectedDate ? selectedDate.getDate() : data.repeatTime}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label>Due Date</label>
                <input
                  value={data.dueDate}
                  type="date"
                  name="dueDate"
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  onChange={e => handleFormData(e)}
                />
              </div>
              <div className="flex flex-row justify-center gap-4 items-center mt-6">
                <div className="flex flex-row items-center">
                  {/* Hide the default file input */}
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    name="file"
                    onChange={e => handleFormData(e)}
                  />
                  {/* Custom styled label that acts as a file picker */}
                  <label
                    htmlFor="fileInput"
                    name="file"
                    className="p-2 bg-primary-foreground rounded-full border border-primary [&_svg]:text-primary text-xl cursor-pointer"
                  >
                    <MdAttachFile />
                  </label>
                </div>
                <div>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className="p-2 bg-primary-foreground rounded-full border border-primary [&_svg]:text-primary text-xl"
                  >
                    <FaMicrophone />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setReminderOpen(true);
                    setReminders([{ type: '', time: '', unit: '' }]);
                  }}
                  className="p-2 bg-primary-foreground rounded-full border border-primary [&_svg]:text-primary text-xl"
                >
                  <MdOutlineAccessAlarm />
                </button>
              </div>
            </div>
            <div>
              {/* Display the selected file name */}
              {fileName && (
                <p>
                  <span>File: </span>
                  {fileName}
                </p>
              )}
              {/* Display audio file */}
              {audioURL && (
                <div>
                  <span>Voice-Note</span>
                  <audio controls src={audioURL} />
                  {audioURL && (
                    <>
                      <span onClick={clearRecording} disabled={!audioURL}>
                        <Clear />
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
                    obj.type.trim() !== '' &&
                    obj.time &&
                    obj.time.trim() !== '' &&
                    obj.unit &&
                    obj.unit.trim() !== ''
                ) && (
                  <div className="reminder_block">
                    {reminders?.map((item, idx) => {
                      return (
                        <>
                          <span key={idx}>
                            <MdOutlineAccessAlarm />
                            {`${item.type} ${item.time} ${item.unit}`}
                          </span>
                          <br />
                        </>
                      );
                    })}
                  </div>
                )}
            </div>
            <div className="flex flex-row justify-end" onClick={submitFormData}>
              <button className="px-4 py-2 border border-secondary bg-secondary text-primary rounded-3xl cursor-pointer mt-4">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={dateOpen}
        onClose={handleCancel}
        sx={{
          '& .MuiDialog-paper': {
            width: '400px',
            height: '460px',
            maxWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <DialogTitle>Select Date</DialogTitle>
        <DialogContent>
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
        <DialogContent style={{ width: '500px', height: '260px' }}>
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
        <DialogContent style={{ width: '500px', height: '250px' }}>
          <div style={styles.container}>
            {reminders?.map((reminder, index) => (
              <div key={index} style={styles.reminderRow}>
                <select
                  value={reminder.type}
                  onChange={e => updateReminder(index, 'type', e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>

                <input
                  type="number"
                  value={reminder.time}
                  onChange={e => updateReminder(index, 'time', e.target.value)}
                  style={styles.input}
                />

                <select
                  value={reminder.unit}
                  onChange={e => updateReminder(index, 'unit', e.target.value)}
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
    </AsideContainer>
  );
};

export default Page;
