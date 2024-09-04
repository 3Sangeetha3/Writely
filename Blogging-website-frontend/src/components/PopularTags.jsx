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
            <span key={tag} className='tag-pill tag-default p-6' style={{ background:"#5E6C6B" }}>
                {tag}
            </span>
        ))
    }
  return (
    <div className='sidebar' style={{background: '#e0e3e3', borderRadius: '15px'}}>
        <p style={{color: '#001519', margin: '10px', marginTop: '15px'}}>Popular Tags</p>
        <div className='tag-list' style={{ margin: '10px'}}>{content()}</div>
    </div>
  )
}

export default PopularTags;