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
          <span key={index} className="tag-pill tag-default p-6" style={{backgroundColor: "#5E6C6B", textAlign: 'center', padding: '8px', marginTop: '10px'}}>
            <i
              className="ion-close-round tag-icon p-6"
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