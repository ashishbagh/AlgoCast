import { useState, useEffect } from "react";

const URL = "https://hacker-news.firebaseio.com/v0/jobstories.json";
export default function App() {
  const [jobs, setJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const [cursor, setCursor] = useState(0);
  let limit = 6;

  useEffect(() => {
    get(URL).then((data) => {
      setJobs(data);
      loadMore({ results: data });
    });
  }, []);

  const loadMore = ({ results = jobs }) => {
    if (cursor < results.length) {
      getJobDetails([...results].slice(cursor, cursor + limit)).then((data) => {
        setJobDetails([...jobDetails, ...data]);
        setCursor(cursor + limit);
      });
    } else {
      console.log("No More Data");
    }
  };

  return (
    <>
      <h3>Hacker News Jobs Board</h3>
      {jobDetails.length === 0 && <div>Loading...</div>}
      {jobDetails.map((props) => (
        <Card {...props} />
      ))}
      {cursor <= jobs.length && (
        <button onClick={loadMore}>Load more Jobs</button>
      )}
    </>
  );
}

const Card = ({ title, by, time, url }) => {
  return (
    <div
      style={{
        border: "1px solid",
        marginBottom: "5px",
        padding: "10px",
        borderRadius: "4px",
        backgroundColor: "#d9d9eb",
      }}
    >
      <a href={url}>{title}</a>
      <div>
        <>By {by}</>
        <> </>
        <>{getDate(new Date(time))}</>
      </div>
    </div>
  );
};

const getDate = (date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format;
  };
  // Using 'en-US' locale formats as MM/DD/YYYY by default
  return date.toLocaleDateString("en-US", options);
};

const get = async (URL) => {
  try {
    const result = await fetch(URL);
    console.log(result);
    const data = await result.json();
    return data;
  } catch (error) {}
};

const getJobDetails = async (ids) => {
  const results = await Promise.allSettled(
    ids.map((id) =>
      get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`),
    ),
  );
  return results.map(({ value }) => value);
};
