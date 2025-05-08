import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

interface Props {
  changeCountry: (selectedOption: CountryOption | null) => void;
  selectedCountry: CountryOption | null;
  setAddress: React.Dispatch<
    React.SetStateAction<{
      country: string | null;
      state: string | null;
      city: string | null;
      county: string | null;
      division: string | null;
      parish: string | null;
      zone: string | null;
      street: string | null;
      plotNumber: string | null;
    }>
  >;
}

// Define the shape of your option (for react-select)
interface CountryOption {
  label: string; // Country name
  value: string; // Country code
  flag: string; // Flag URL for rendering in the dropdown
}

const CountrySelect: React.FC<Props> = ({
  changeCountry,
  selectedCountry,
  setAddress,
}) => {
  const [countries, setCountries] = useState<CountryOption[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch the list of countries from the REST API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryOptions = response.data.map((country: any) => ({
          label: country.name.common, // Display country name
          value: country.cca2, // Use ISO Alpha-2 code as value
          flag: country.flags.svg, // Store the flag image URL
        }));
        setCountries(countryOptions);
        setLoading(false);
      } catch (error) {
        setError("Failed to load country data");
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Custom label renderer to show flag and country name
  const formatOptionLabel = (option: CountryOption) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={option.flag}
        alt={`Flag of ${option.label}`}
        style={{ width: "20px", marginRight: "10px" }}
      />
      {option.label}
    </div>
  );

  if (loading) {
    return <p>Loading countries...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full">
      <Select
        value={selectedCountry} // Currently selected country
        onChange={(e) => {
          changeCountry(e);
          setAddress((prev) => ({ ...prev, country: String(e?.label) }));
        }} // Change handler
        options={countries} // Array of country options
        placeholder="Select a country"
        isSearchable={true}
        formatOptionLabel={formatOptionLabel} // Custom option renderer
      />
    </div>
  );
};

export default CountrySelect;
