export const getMountain = async id => {
  const response = await fetch(
    `https://summit-register-api.herokuapp.com/api/v1/mountains/${id}`
  );
  const mountains = await response.json();
  return mountains;
};

export const postToLog = async (id, logEntry, timeStamp) => {
  const { name, hometown, comments } = logEntry;
  const response = await fetch(
    `https://summit-register-api.herokuapp.com/api/v1/mountains/${id}/registries`,
    {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({
        name,
        hometown,
        comments,
        sign_time: timeStamp,
      }),
      headers: { "Content-Type": "application/json" }
    }
  );
  const updatedLog = await response.json();
  return updatedLog.data;
};
