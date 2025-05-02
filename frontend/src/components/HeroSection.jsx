import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="text-center px-4 py-12 bg-gray-50">
      <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
        <span className="px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium text-sm sm:text-base">
          No. 1 Job Hunt Website
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Search, Apply &<br />
          Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
        </h1>

        <p className="text-gray-600 max-w-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
          aspernatur temporibus nihil tempora dolor!
        </p>

        <div className="flex w-full max-w-xl mx-auto shadow-md border border-gray-200 rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Find your dream jobs"
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm sm:text-base focus:outline-none"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-none rounded-r-full bg-[#6A38C2] hover:bg-[#5b30a6]"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
