import React from "react";
import { useTagsQuery } from "../hooks";

function PopularTags() {
  const { isTagsLoading, tags, tagsError } = useTagsQuery();

  if (isTagsLoading) {
    return <div>Loading tags...</div>;
  }

  if (tagsError) {
    return <div>Error loading tags.</div>;
  }

  function content() {
    return tags?.tags?.map((tag) => (
      <span
        key={tag}
        className="px-3 py-1 bg-[#5E6C6B] text-white text-sm rounded-full m-0.5"
      >
        {tag}
      </span>
    ));
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl text-[#001519] font-medium ml-0">Popular Tags</h2>
      <div className="flex items-center justify-start mb-2">
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="inline-flex p-3 space-x-3">
          {tags?.tags?.map((tag) => (
            <span
              key={tag}
              className="snap-center whitespace-nowrap cursor-pointer px-3 py-1 bg-[#5E6C6B] text-white text-sm rounded-full m-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PopularTags;
