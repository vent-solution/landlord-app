const validateFormData = (
  field: HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement,
  isValid?: boolean
) => {
  const parent: HTMLElement | null = field.parentElement;

  if (!parent) return;

  const small = parent?.querySelector("small");

  if (!isValid) {
    parent?.classList.add("required");
    small?.classList.add("visible");
  } else {
    parent?.classList.remove("required");
    small?.classList.remove("visible");
  }
};

export default validateFormData;
