import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true); // Update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          ); // Ensure the state is in sync with fetched data
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {singleJob?.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="text-blue-700 font-semibold" variant="ghost">
              {singleJob?.postion} Positions
            </Badge>
            <Badge className="text-[#F83002] font-semibold" variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className="text-[#7209b7] font-semibold" variant="ghost">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg px-6 py-2 text-white transition duration-200 ${
            isApplied
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h2 className="text-lg font-medium border-b border-gray-300 py-4 mt-8">
        Job Description
      </h2>

      <div className="grid gap-4 mt-4 text-gray-800">
        <div>
          <span className="font-semibold">Role:</span>{" "}
          <span className="ml-2">{singleJob?.title}</span>
        </div>
        <div>
          <span className="font-semibold">Location:</span>{" "}
          <span className="ml-2">{singleJob?.location}</span>
        </div>
        <div>
          <span className="font-semibold">Description:</span>{" "}
          <span className="ml-2">{singleJob?.description}</span>
        </div>
        <div>
          <span className="font-semibold">Experience:</span>{" "}
          <span className="ml-2">{singleJob?.experience} yrs</span>
        </div>
        <div>
          <span className="font-semibold">Salary:</span>{" "}
          <span className="ml-2">{singleJob?.salary} LPA</span>
        </div>
        <div>
          <span className="font-semibold">Total Applicants:</span>{" "}
          <span className="ml-2">{singleJob?.applications?.length}</span>
        </div>
        <div>
          <span className="font-semibold">Posted Date:</span>{" "}
          <span className="ml-2">{singleJob?.createdAt?.split("T")[0]}</span>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
