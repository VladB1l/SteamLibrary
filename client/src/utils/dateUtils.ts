function formatDate(date: string): string {
  let newDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return newDate;
}

export { formatDate };
