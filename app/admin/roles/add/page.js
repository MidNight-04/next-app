"use client";
import axios from "axios";
import { useRouter, redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AsideContainer from "../../../../components/AsideContainer";
import { IoIosArrowBack } from "react-icons/io";

const AddRoleForm = () => {
  const router = useRouter();
  const [role, setRole] = useState("");

  const submitFormData = () => {
    if (role) {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/projectrole/add`, {
          name: role,
        })
        .then(response => {
          if (response) {
            setRole("");
            toast(response.data.message, {
              position: "top-right",
            });
            router.push("/admin/roles");
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      toast("Role is mandatory", {
        position: "top-right",
      });
    }
  };
  return (
    <AsideContainer>
      <div className="flex flex-row items-center text-2xl font-bold gap-2 my-4">
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
        />
        <h1>Add Employee </h1>
      </div>
      <div className="bg-white rounded-3xl p-6 [&_label]:font-semibold shadow-xl">
        <div>
          <div className="flex flex-col gap-2">
            <label>Name</label>
            <div className="flex flex-row w-full gap-4">
              <input
                className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 w-full"
                value={role}
                type="text"
                placeholder="Enter Role"
                name="role"
                onChange={e => setRole(e.target.value)}
              />
              <button
                className="bg-secondary text-primary font-semibold rounded-3xl px-4 py-3 flex flex-row  items-center"
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

export default AddRoleForm;
