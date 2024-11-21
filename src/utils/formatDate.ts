const formatDate = (date: string): string => {
  const dateRaw = new Date(date);

  return `${dateRaw.getDate()}/${
    dateRaw.getMonth() + 1
  }/${dateRaw.getFullYear()} ${dateRaw.getHours()}:${dateRaw.getMinutes()}`;
};

export default formatDate;
