import markRequiredFormField from "./markRequiredFormField";

const checkRequiredFormFields = (
  inputArray: HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[]
) => {
  inputArray.forEach((input) => {
    if (input.value.trim().length < 1) {
      markRequiredFormField(input);
    }
  });
};

export default checkRequiredFormFields;
