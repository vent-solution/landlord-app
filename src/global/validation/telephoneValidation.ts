const isValidTelephone = (telephone?: string) => {
  const telephoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return telephoneRegex.test(telephone ? telephone : "");
};

export default isValidTelephone;
