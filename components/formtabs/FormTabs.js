'use client';

import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import OtpForm from './otpform';
import PasswordForm from './PasswordForm';

const LoginFormTabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => setSelectedIndex(i => Math.min(i + 1, 1)),
    onSwipedRight: () => setSelectedIndex(i => Math.max(i - 1, 0)),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedIndex]);

  return (
    <div {...handlers} className="w-full">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList className="flex space-x-1 rounded-xl bg-gray-200 p-1 mb-4 ">
          {['OTP Login', 'Password Login'].map(label => (
            <Tab
              key={label}
              className={({ selected }) =>
                `w-full py-2 text-sm font-medium rounded-lg transition-all duration-200 outline-none ${
                  selected ? 'bg-white shadow text-secondary' : 'text-gray-500'
                }`
              }
            >
              {label}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel>
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
            >
              <OtpForm inputRef={inputRef} />
            </motion.div>
          </TabPanel>

          <TabPanel>
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
            >
              <PasswordForm inputRef={inputRef} />
            </motion.div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default LoginFormTabs;
