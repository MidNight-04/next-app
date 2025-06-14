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
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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

const schema = yup.object({
  title: yup.string().required('Task title is required'),
  description: yup.string().required('Description is required'),
  member: yup.string().required('Member is required'),
  category: yup.string().required('Category is required'),
  priority: yup.string().oneOf(['Low', 'Medium', 'High'], 'Priority is required'),
  repeatType: yup.string(),
  dueDate: yup.date().required('Due Date is required'),
}).required();

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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors,isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      member: '',
      memberName: '',
      category: '',
      repeatType: 'norepeat',
      priority: 'High',
      repeatTime: '',
      dueDate: null,
      file: '',
      audio: '',
      reminder: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memberResponse, categoryResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`),
          axios.get(`${process.env.REACT_APP_BASE_PATH}/api/category/list`)
        ]);
        if (memberResponse?.data?.data) {
          setMemberList(memberResponse.data.data);
        }
        if (categoryResponse?.data?.data) {
          setCategoryList(categoryResponse.data.data);
        }
      } catch (err) {
        setError(err); 
        console.log("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        setFileName(files[0].name);
      }
    } else if (name === 'member') {
      setData({ ...data, [name]: value });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handlePriority = priority => {
    setSelectedPriority(priority);
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

  const handleTimeChange = newValue => {
    if (newValue && newValue.isValid()) {
      setSelectedTime(newValue);
    } else {
      console.error('Invalid date value:', newValue);
    }
  };

  const addReminder = () => {
    setReminders([...reminders, { type: '', time: '', unit: '' }]);
  };

  const removeReminder = index => {
    if (reminders.length > 1) {
      const newReminders = reminders.filter((_, i) => i !== index);
      setReminders(newReminders);
    } else {
      toast('Not Allowed');
    }
  };

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

  const updateReminder = (index, field, value) => {
    const newReminders = reminders.map((reminder, i) =>
      i === index ? { ...reminder, [field]: value } : reminder
    );
    setReminders(newReminders);
  };

  const onSubmit = async (data) => {
  try {
    data.assignedBy = {
      name: userName,
      employeeID: userId,
    };

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('member', data.member?.split('/')[0]);
    formData.append('memberName', data.member?.split('/')[1]);
    formData.append('assignedName', userName);
    formData.append('assignedID', userId);
    formData.append('category', data.category);
    formData.append('priority', data.priority);
    formData.append('repeatType', data.repeatType || '');
    formData.append('repeatTime', data.repeatTime || '');
    formData.append('dueDate', data.dueDate);

    if (data.file) {
      formData.append('file', data.file);
    }

    if (data.audio) {
      formData.append('audio', data.audio, 'recording.wav');
    }

    formData.append('reminder', JSON.stringify(data.reminder || []));

    const response = await axios.post(
      `${process.env.REACT_APP_BASE_PATH}/api/task/add`,
      formData
    );

    console.log('Response:', response.status);

    if (response.status === 201) {
      setFileName('');
      setAudioURL('');
      clearRecording();
      setReminders([{ type: '', time: '', unit: '' }]);
      setSelectedPriority('');
      setChecked(false);
      toast(response.data.message);
      router.back();
    } else {
      toast(response.data.message);
    }
  } catch (error) {
    console.error('Submit Error:', error);
    toast('Something went wrong. Please try again.');
  }
};

  const onFileChange = e => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const renderInput = (label, name, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>
      <input {...register(name)} type={type} placeholder={placeholder}
        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold" />
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value ?? ''}>
            <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {options.map((item, index) => (
                <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
    </div>
  );

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
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-2">
            {renderInput('Task Title', 'title', 'text', 'Enter task title')}
            {renderInput('Description', 'description', 'text', 'Enter description')}

            {renderSelect(
              'Member',
              'member',
              memberList.map(m => ({
                value: `${m._id}/${m.name}`,
                label: `${m.name} (${m.role?.name ?? 'N/A'})`,
              }))
            )}

            {renderSelect(
              'Category',
              'category',
              categoryList.map(c => ({ value: c.name, label: c.name }))
            )}

            {renderSelect('Priority', 'priority', [
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ])}

            {renderSelect('Repeat', 'repeatType', [
              { value: 'norepeat', label: 'Once' },
              { value: 'Daily', label: 'Daily' },
              { value: 'Weekly', label: 'Weekly' },
              { value: 'Monthly', label: 'Monthly' },
              { value: 'Yearly', label: 'Yearly' },
            ])}

            <div className="flex flex-col gap-2">
              <label className="font-semibold">Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="col-span-2 flex gap-4 mt-4 items-center">
              <label
                htmlFor="fileInput"
                className="p-2 bg-primary-foreground rounded-full border border-primary text-primary text-xl cursor-pointer"
              >
                <MdAttachFile />
              </label>
              <input
                type="file"
                id="fileInput"
                hidden
                onChange={onFileChange}
              />

              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className="p-2 bg-primary-foreground rounded-full border border-primary text-primary text-xl"
              >
                <FaMicrophone />
              </button>

              <button
                type="button"
                onClick={() => setReminderOpen(true)}
                className="p-2 bg-primary-foreground rounded-full border border-primary text-primary text-xl"
              >
                <MdOutlineAccessAlarm />
              </button>
            </div>

            {fileName && <p className="col-span-2">File: {fileName}</p>}

            {audioURL && (
              <div className="col-span-2">
                <span>Voice Note</span>
                <audio controls src={audioURL} />
                <button
                  type="button"
                  onClick={clearRecording}
                  className="ml-2 text-red-500"
                >
                  <Clear /> Clear
                </button>
              </div>
            )}

            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-secondary text-primary rounded-3xl px-4 py-3 inline-block font-semibold transition-opacity ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
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
            showMonthYearPicker={false}
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
              value={selectedTime} 
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