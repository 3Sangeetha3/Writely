import React from "react";
import { useTagsQuery } from "../hooks";
import Lottie from "lottie-react";
import left_Arrow from "../assets/Left_Arrow.json";
import right_Arrow from "../assets/Right_Arrow.json";
import Skeleton from "@mui/material/Skeleton";

function PopularTags({ onTagClick }) {
  const { isTagsLoading, tags, tagsError } = useTagsQuery();
  const scrollContainerRef = React.useRef(null);

  // Array of light background colors
  const colorClasses = [
    "bg-pink-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-red-100",
    "bg-indigo-100",
    "bg-teal-100",
    "bg-sky-100",
  ];

  // Scroll left by 100px
  function scrollLeft() {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  }

  // Scroll right by 100px
  function scrollRight() {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  }

  if (isTagsLoading) {
    return (
      <div className="mb-6 border p-4 rounded-lg">
        {/* Title Skeleton */}
        <Skeleton 
          variant="text" 
          width={150} 
          height={30} 
          sx={{ bgcolor: "#E0E3E3" }} 
        />
  
        <div className="relative flex items-center mt-2 p-2 border rounded-full shadow-sm">
          {/* Left Arrow Skeleton */}
          <div className="absolute left-2 z-10">
            <Skeleton 
              variant="circular" 
              width={32} 
              height={32} 
              sx={{ bgcolor: "#E0E3E3" }} 
            />
          </div>
  
          {/* Scrollable Tags Skeleton */}
          <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory mx-12">
            <div className="inline-flex space-x-3">
              {Array.from(new Array(20)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={150}
                  height={30}
                  sx={{ bgcolor: "#E0E3E3" }}
                />
              ))}
            </div>
          </div>
  
          {/* Right Arrow Skeleton */}
          <div className="absolute right-2 z-10">
            <Skeleton 
              variant="circular" 
              width={32} 
              height={32} 
              sx={{ bgcolor: "#E0E3E3" }} 
            />
          </div>
        </div>
      </div>
    );
  }

  if (tagsError) {
    return <div>Error loading tags.</div>;
  }

  return (
    <div className="mb-6 border p-4 rounded-lg">
      <h2 className="text-xl text-[#001519] font-medium">Popular Tags</h2>

      <div className="relative flex items-center mt-2 p-2 border rounded-full shadow-sm">
        {/* Left scroll button */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 z-10 bg-[#475756] w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-[#A8AFAF] focus:outline-none"
        >
          <Lottie
            animationData={left_Arrow}
            loop={true}
            className="w-10 h-10 justify-items-start"
          />
        </button>

        {/* The scrollable area */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory mx-12"
        >
          <div className="inline-flex space-x-3">
            {tags?.tags?.map((tag, index) => {
              // Pick a background color
              const bgColor = colorClasses[index % colorClasses.length];

              return (
                <span
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className={`snap-center whitespace-nowrap cursor-pointer px-5 py-2 text-gray-800 text-sm font-medium rounded-md m-0.5 ${bgColor} hover:bg-opacity-80 transition`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        {/* Right scroll button */}
        <button
          onClick={scrollRight}
          className="absolute right-2 z-10 bg-[#475756] w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-[#A8AFAF] focus:outline-none"
        >
          <Lottie
            animationData={right_Arrow}
            loop={true}
            className="w-10 h-10 justify-items-start"
          />
        </button>
      </div>
    </div>
  );
}

export default PopularTags;
