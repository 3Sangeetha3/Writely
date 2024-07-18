import React from 'react'
import './TagsInput.css'

function TagsInput({ field, form }) {

  return (
    <>
      <input
        onKeyDown={(/** @type {import('react').KeyboardEvent<HTMLInputElement>} */ e) => {
          // @ts-ignore
          const { value } = e.target

          if (e.key === 'Enter') {
            e.preventDefault()

            form.setFieldValue(field.name, [...field.value, value])

            // @ts-ignore
            e.target.value = ''
          }
        }}
        type="text"
        className="form-control"
        placeholder="Enter tags"
      />
      <div className="tag-list">
        {field?.value?.map((tag, index) => (
          <span key={index} className="tag-default tag-pill tag-item">
            <i
              className="ion-close-round tag-icon"
              onClick={() =>
                form.setFieldValue(
                  field.name,
                  field.value.filter((item) => item !== tag)
                )
              }
            />
            {tag}
          </span>
        ))}
      </div>
    </>
  )
}

export default TagsInput