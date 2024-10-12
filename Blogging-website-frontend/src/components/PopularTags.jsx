import React from 'react'
import { useTagsQuery } from '../hooks'

function PopularTags() {

  const {
    isTagsLoading,
    tags,
    tagsError,
  } = useTagsQuery();

  function content() {
    return tags?.tags?.map((tag) => (
      <span key={tag} className="px-3 py-1 bg-[#5E6C6B] text-white text-sm rounded-full m-0.5">
        {tag}
      </span>
    ))
  }

  return (
    <div className="p-6 bg-[#e0e3e3] rounded-xl">
      <p className="text-[#001519] text-2xl mb-4">Popular Tags</p>
      <div className="flex flex-wrap">{content()}</div>
    </div>
  )
}

export default PopularTags;
