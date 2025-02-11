import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const JoditField = ({ field, form, ...props }) => {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: props.placeholder || 'Start typing your article...',
  }), [props.placeholder]);

  return (
    <JoditEditor
      ref={editor}
      value={field.value}
      config={config}
      tabIndex={1}
      onBlur={(newContent) => {
        form.setFieldValue(field.name, newContent);
      }}
    //   onChange={(newContent) => {
    //     // Optionally, you can update onChange too:
    //     // form.setFieldValue(field.name, newContent);
    //   }}
    />
  );
};

export default JoditField;
