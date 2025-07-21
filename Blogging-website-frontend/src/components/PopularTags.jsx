import React from "react";
import { useTagsQuery } from "../hooks";
import { ChevronLeft, ChevronRight, Hash, TrendingUp, Sparkles } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";

function PopularTags({ onTagClick }) {
  const { isTagsLoading, tags, tagsError } = useTagsQuery();
  const scrollContainerRef = React.useRef(null);

  function scrollLeft() {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  }

  function scrollRight() {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  }

  if (isTagsLoading) {
    return (
      <div className="relative">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: "#E0E3E3" }} />
          <Skeleton variant="text" width={150} height={30} sx={{ bgcolor: "#E0E3E3" }} />
        </div>
        <div className="relative flex items-center">
          <div className="absolute left-0 z-10">
            <Skeleton variant="circular" width={48} height={48} sx={{ bgcolor: "#E0E3E3" }} />
          </div>
          <div className="w-full overflow-x-auto scrollbar-hide mx-16">
            <div className="inline-flex gap-4">
              {Array.from(new Array(8)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={140}
                  height={48}
                  sx={{ bgcolor: "#E0E3E3", borderRadius: "24px" }}
                />
              ))}
            </div>
          </div>
          <div className="absolute right-0 z-10">
            <Skeleton variant="circular" width={48} height={48} sx={{ bgcolor: "#E0E3E3" }} />
          </div>
        </div>
      </div>
    );
  }

  if (tagsError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 inline-block shadow-lg shadow-red-100/50">
          <p className="text-red-600 font-medium">Error loading tags. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-[#53C7C0] to-[#4AB3AC] rounded-2xl shadow-lg shadow-[#53C7C0]/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[#243635] font-semibold text-lg mb-1">Trending Topics</p>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#53C7C0]" />
              Click any tag to explore articles
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative flex items-center">
        {/* Left scroll button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-20 bg-white/90 backdrop-blur-xl border border-[#243635] w-12 h-12 flex items-center justify-center rounded-2xl shadow-xl shadow-[#53C7C0]/10 hover:shadow-2xl hover:shadow-[#53C7C0]/20 hover:scale-110 hover:bg-gradient-to-br hover:from-[#53C7C0] hover:to-[#4AB3AC] hover:border-[#53C7C0]/30 transition-all duration-300 group"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-[#243635] group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300" />
        </button>
        
        {/* Scrollable tags container */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory mx-16 py-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          <div className="inline-flex gap-4 pb-2">
            {tags?.tags?.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="group snap-center whitespace-nowrap px-6 py-3 text-[#243635] text-sm font-semibold rounded-2xl bg-white border-2 border-[#53C7C0] hover:bg-[#53C7C0] hover:text-white hover:border-[#53C7C0] transition-all duration-300 shadow-blue-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Hash className="w-4 h-4 group-hover:text-white text-[#53C7C0] transition-colors duration-300" />
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right scroll button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 z-20 bg-white/90 backdrop-blur-xl border border-[#243635] w-12 h-12 flex items-center justify-center rounded-2xl shadow-xl shadow-[#53C7C0]/10 hover:shadow-2xl hover:shadow-[#53C7C0]/20 hover:scale-110 hover:bg-gradient-to-br hover:from-[#53C7C0] hover:to-[#4AB3AC] hover:border-[#53C7C0]/30 transition-all duration-300 group"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-[#243635] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
        </button>
      </div>
    </div>
  );
}

export default PopularTags;