import { LogOut, Settings, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

function DropdownMenu() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState<string | null>(
    null
  );
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const actionDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setFilterDropdownOpen(false);
      }

      if (actionDropdownOpen) {
        const ref = actionDropdownRefs.current[actionDropdownOpen];
        if (ref && !ref.contains(event.target as Node)) {
          setActionDropdownOpen(null);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen, filterDropdownOpen, actionDropdownOpen]);

  return (
    <div className="flex items-center space-x-4">
      <div className="relative" ref={userDropdownRef}>
        <button
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white"
        >
          U
        </button>

        {userDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-indigo-900/5 z-10">
            <div className="py-1">
              <button className="flex items-center w-full px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors duration-150">
                <User className="mr-2 h-4 w-4" />
                Profile
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors duration-150">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </button>
              <div className="border-t border-indigo-200/30 my-1"></div>
              <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DropdownMenu;
