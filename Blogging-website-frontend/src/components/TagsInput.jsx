import { X } from "lucide-react";
import React, { useState, useRef } from "react";

const TagsInput = ({ field, form }) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState(field.value || []);
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const newTag = tag.trim();
    if (newTag && !tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);
      form.setFieldValue(field.name, newTags);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setFieldValue(field.name, newTags);
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 w-full outline-none`}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#53C7C0]/10 text-[#243635] rounded-full text-sm font-medium border border-[#53C7C0]/20 hover:bg-[#53C7C0]/20 transition-colors duration-200"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1 hover:bg-[#53C7C0]/30 rounded-full p-0.5 transition-colors duration-200 focus:outline-none"
            aria-label={`Remove tag ${tag}`}
          >
            <X className="w-3 h-3 text-[#53C7C0]" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length ? "" : "Type a tag and press Enter..."}
        className="w-full outline-none bg-transparent text-[#243635] placeholder-gray-400 text-lg py-1.5"
        aria-label="Add tag"
      />
    </div>
  );
};

export default TagsInput;
