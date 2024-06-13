import React from "react";
import { useCache } from "../providers/cache";
import Breadcrumb from "./Breadcrumb";
import { faker } from "@faker-js/faker";

const App = () => {
  const path = window.location.pathname.replace(/^\/|\/$/g, "");
  if (!path) window.location.pathname = "/" + faker.word.sample();

  const { useFetch } = useCache();
  const { data, error, isLoading } = useFetch(path);

  if (isLoading && !data) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const isList = Array.isArray(data);

  return (
    <>
      <Breadcrumb />
      <pre>{path}</pre>
      <pre>
        {isList
          ? data.map((item) => (
              <div key={item.id}>
                <a href={"/" + path + "/" + item.id}>
                  {JSON.stringify(item, null, 2)}
                </a>
              </div>
            ))
          : JSON.stringify(data, null, 2)}
      </pre>
      {!isList && (
        <div className="Row">
          {faker.helpers.multiple(faker.word.sample, 3).map((word) => (
            <a className="Breadcrumb" key={word} href={"/" + path + "/" + word}>
              {word}
            </a>
          ))}
        </div>
      )}
      <div>
        <p className="UpdateText">
          {isLoading
            ? "Updating..."
            : "Updated at " + new Date().toLocaleTimeString()}
        </p>
      </div>
    </>
  );
};

export default App;
