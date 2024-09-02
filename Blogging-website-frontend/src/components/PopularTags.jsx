import React from 'react'
import { useTagsQuery } from '../hooks'

function PopularTags() {

    const  {
        isTagsLoading,
        tags,
        tagsError,
      } = useTagsQuery();

    function content(){
        return tags?.tags?.map((tag) => (
            <span key={tag} className='tag-pill tag-default p-6s'>
                {tag}
            </span>
        ))
    }
  return (
    <div className='sidebar'>
        <p style={{color: '#001519'}}>Popular Tags</p>
        <div className='tag-list'>{content()}</div>
    </div>
  )
}

export default PopularTags;