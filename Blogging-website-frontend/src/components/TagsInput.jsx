import React from "react";

function TagsInput({ field, form }) {
  return (
    <>
      <input
        onKeyDown={(
          /** @type {import('react').KeyboardEvent<HTMLInputElement>} */ e
        ) => {
          const { value } = e.target;

          if (e.key === "Enter") {
            e.preventDefault();

            form.setFieldValue(field.name, [...field.value, value]);

            e.target.value = "";
          }
        }}
        type="text"
        className="form-control p-2 border rounded-md"
        placeholder="Enter tags"
      />
      <div className="flex flex-wrap mt-2">
        {field?.value?.map((tag, index) => (
          <span
            key={index}
            className="flex items-center bg-[#5E6C6B] text-white text-sm rounded-full px-3 py-1 m-0.5"
          >
            {tag}
            <i
              className="ion-close-round cursor-pointer text-white"
              onClick={() =>
                form.setFieldValue(
                  field.name,
                  field.value.filter((item) => item !== tag)
                )
              }
            />
          </span>
        ))}
      </div>
    </>
  );
}

export default TagsInput;
