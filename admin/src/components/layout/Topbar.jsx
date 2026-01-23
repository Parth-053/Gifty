import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <h2 className="text-lg font-medium text-gray-800">Admin Dashboard</h2>
      
      <div className="flex items-center gap-4">
        <Menu as="div" className="relative ml-3">
          <Menu.Button className="flex items-center gap-2 text-sm focus:outline-none">
            <span className="font-medium text-gray-700">{user?.name || "Admin"}</span>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6 text-gray-500" />
            </div>
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Topbar;