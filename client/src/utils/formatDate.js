const formatDate = (dateString, locale = "tr-TR") => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(locale, options);
};

export default formatDate;
