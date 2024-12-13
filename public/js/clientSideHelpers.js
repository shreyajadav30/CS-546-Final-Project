const getData = async (url) => {
  try {
    const { data } = await axios.get(url);
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
