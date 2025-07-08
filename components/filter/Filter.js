import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueries } from '@tanstack/react-query';
import api from '../../lib/api';
import LoaderSpinner from '../loader/LoaderSpinner';

const TaskFilterPopup = ({
  isOpen,
  onClose,
  filterhandler,
  showTo = false,
  showBy = false,
  category = '',
  assgndBy = '',
  assgndTo = '',
  frqcy = '',
  prty = '',
}) => {
  const [activeTab, setActiveTab] = useState('Category');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [assignedBy, setAssignedBy] = useState(assgndBy);
  const [assignedTo, setAssignedTo] = useState(assgndTo);
  const [frequency, setFrequency] = useState(frqcy);
  const [priority, setPriority] = useState(prty);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchAssignedBy, setSearchAssignedBy] = useState('');
  const [searchAssignedTo, setSearchAssignedTo] = useState('');
  const [searchFrequency, setSearchFrequency] = useState('');
  const [searchPriority, setSearchPriority] = useState('');

  const [
    {
      data: categoriesData,
      isLoading: categoriesLoading,
      isError: categoriesError,
    },
    { data: employeeData, isLoading: employeeLoading, isError: employeeError },
  ] = useQueries({
    queries: [
      {
        queryKey: ['categories'],
        queryFn: async () => {
          const response = await api.get(`/category/list`);
          return response.data.data;
        },
      },
      {
        queryKey: ['employees'],
        queryFn: async () => {
          const response = await api.get(`/teammember/getall`);
          return response.data.data;
        },
      },
    ],
  });

  const frequencyOptions = [
    { name: 'Once', id: 'norepeat' },
    { name: 'Hourly', id: 'Hourly' },
    { name: 'Daily', id: 'Daily' },
    { name: 'Weekly', id: 'Weekly' },
    { name: 'Monthly', id: 'Monthly' },
  ];

  const priorityOptions = ['High', 'Medium', 'Low'];

  const handleClear = () => {
    setSelectedCategory('');
    setAssignedBy('');
    setFrequency('');
    setPriority('');
  };

  const handleFilter = () => {
    filterhandler({
      selectedCategory,
      assignedBy,
      assignedTo,
      frequency,
      priority,
    });
    onClose();
  };

  const filters = [
    'Category',
    !showBy ? '' : 'Assigned By',
    !showTo ? '' : 'Assigned To',
    'Frequency',
    'Priority',
  ];

  const isLoading = categoriesLoading || employeeLoading;
  const isError = categoriesError || employeeError;

  if (isLoading && !isError) {
    return <LoaderSpinner />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Category':
        return (
          <>
            <input
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              type="text"
              placeholder="Search Category"
              className="p-2 border rounded-md mb-4 w-full"
            />
            {categoriesData
              .filter(item =>
                item.name.toLowerCase().includes(searchCategory.toLowerCase())
              )
              .map(category => (
                <div
                  key={category._id}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    selectedCategory === category._id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setSelectedCategory(category._id)}
                >
                  <input
                    type="radio"
                    checked={selectedCategory === category._id}
                    onChange={() => setSelectedCategory(category._id)}
                    className="mr-2"
                  />
                  <label>{category.name}</label>
                </div>
              ))}
          </>
        );
      case 'Assigned By':
        return (
          <>
            {showBy && (
              <div className="flex flex-col w-full">
                <input
                  value={searchAssignedBy}
                  onChange={e => setSearchAssignedBy(e.target.value)}
                  type="text"
                  placeholder="Search Assigned By"
                  className="p-2 border rounded-md mb-4 w-full"
                />
                {employeeData
                  .filter(item =>
                    item.firstname
                      .toLowerCase()
                      .includes(searchAssignedBy.toLowerCase())
                  )
                  .map(person => (
                    <div
                      key={person._id}
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        assignedBy === person._id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setAssignedBy(person._id)}
                    >
                      <input
                        type="radio"
                        checked={assignedBy === person._id}
                        onChange={() => setAssignedBy(person._id)}
                        className="mr-2"
                      />
                      <label>{person.firstname + ' ' + person.lastname}</label>
                    </div>
                  ))}
              </div>
            )}
          </>
        );
      case 'Assigned To':
        return (
          <>
            {showTo && (
              <div className="flex flex-col w-full">
                <input
                  value={searchAssignedTo}
                  onChange={e => setSearchAssignedTo(e.target.value)}
                  type="text"
                  placeholder="Search Assigned By"
                  className="p-2 border rounded-md mb-4 w-full"
                />
                {employeeData
                  .filter(item =>
                    item.firstname
                      .toLowerCase()
                      .includes(searchAssignedTo.toLowerCase())
                  )
                  .map(person => (
                    <div
                      key={person._id}
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        assignedTo === person._id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setAssignedTo(person._id)}
                    >
                      <input
                        type="radio"
                        checked={assignedTo === person._id}
                        onChange={() => setAssignedTo(person._id)}
                        className="mr-2"
                      />
                      <label>{person.firstname + ' ' + person.lastname}</label>
                    </div>
                  ))}
              </div>
            )}
          </>
        );
      case 'Frequency':
        return (
          <>
            <input
              value={searchFrequency}
              onChange={e => setSearchFrequency(e.target.value)}
              type="text"
              placeholder="Search Frequency"
              className="p-2 border rounded-md mb-4 w-full"
            />
            {frequencyOptions
              .filter(item =>
                item.id.toLowerCase().includes(searchFrequency.toLowerCase())
              )
              .map(freq => (
                <div
                  key={freq.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    frequency === freq ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setFrequency(freq.id)}
                >
                  <input
                    type="radio"
                    checked={frequency === freq.id}
                    onChange={() => setFrequency(freq.id)}
                    className="mr-2"
                  />
                  <label>{freq.name}</label>
                </div>
              ))}
          </>
        );
      case 'Priority':
        return (
          <>
            <input
              value={searchPriority}
              onChange={e => setSearchPriority(e.target.value)}
              type="text"
              placeholder="Search Priority"
              className="p-2 border rounded-md mb-4 w-full"
            />
            {priorityOptions
              .filter(item =>
                item.toLowerCase().includes(searchPriority.toLowerCase())
              )
              .map(prio => (
                <div
                  key={prio}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    priority === prio ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setPriority(prio)}
                >
                  <input
                    type="radio"
                    checked={priority === prio}
                    onChange={() => setPriority(prio)}
                    className="mr-2"
                  />
                  <label>{prio}</label>
                </div>
              ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-[36rem] rounded-2xl shadow-lg bg-white h-[40rem]">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Task Filters</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-col h-full justify-between">
                  <div className="flex space-x-4 mb-6 h-full">
                    {/* Left Tabs */}
                    <div className="flex flex-col w-1/3 border-r pr-4">
                      {filters
                        .filter(item => item !== '')
                        .map(tab => (
                          <button
                            key={tab}
                            className={`text-left mb-2 font-semibold ${
                              activeTab === tab
                                ? 'text-primary'
                                : 'text-gray-600'
                            }`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab}
                          </button>
                        ))}
                    </div>

                    {/* Right Content */}
                    <div className="flex flex-col w-2/3 max-h-[30rem] overflow-y-auto">
                      {renderTabContent()}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={handleClear}>
                      Clear
                    </Button>
                    <Button onClick={handleFilter}>Filter Tasks</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskFilterPopup;
