import React, { useState } from "react";
import { placeholderCSS } from "react-select/dist/declarations/src/components/Placeholder";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  onChange: (selectedOption: Option) => void;

  id: string;
  name: string;

  placeholder: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  onChange,
  id,
  name,
  placeholder,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSelect = (option: Option) => {
    onChange(option);
    setSearch(option.label);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        name={name}
        value={search}
        onChange={handleSearchChange}
        onFocus={() => setIsOpen(!isOpen)}
        placeholder={placeholder}
        className="w-full p-2 border"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute w-full border bg-white shadow-lg max-h-60 overflow-y-auto mt-1">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
