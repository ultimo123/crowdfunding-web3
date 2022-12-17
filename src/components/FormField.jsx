import React from "react"

const FormField = ({
  labelName,
  placeholder,
  inputType,
  value,
  handleChange,
  isTextArea,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
          {labelName}
        </span>
      )}

      {isTextArea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          rows={10}
          required
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      ) : (
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          step="0.1"
          required
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      )}
    </label>
  )
}

export default FormField
