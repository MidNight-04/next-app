'use client';
import React from 'react';
import AdminNewForm from '../../../../components/AdminNewForm/AdminNewForm';
import { dealersInputs } from '../../../../constant/adminFormSource';
import { useAuthStore } from '../../../../store/useAuthStore';

const ContractorDetail = ({ isView = true, isEdit = false }) => {
  const userType = useAuthStore(state => state.userType);
  return (
    <div className="home">
      <div
      // className={`homeContainer menu_open_${
      //   openMenu === undefined ? false : openMenu
      // }`}
      >
        <AdminNewForm
          isView={isView}
          isEdit={isEdit}
          inputs={dealersInputs}
          title="View Details"
          postUrl={`/contractor/details`}
          updateUrl={`/contractor/update-details`}
          getUrl={`/contractor/detail`}
          role={userType}
          status="approval"
          approvalUrl={`/admin/approve-application/contractor`}
        />
      </div>
    </div>
  );
};

export default ContractorDetail;
