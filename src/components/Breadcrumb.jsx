import { useCache } from "../providers/cache";

function Breadcrumb() {
  const { useFetchNames } = useCache();
  const path = window.location.pathname.replace(/^\/|\/$/g, "");
  const pathParts = path.split("/");
  const { names, isLoading } = useFetchNames(path);

  const getDestination = (index) => {
    const newPath = pathParts.slice(0, index + 1).join("/");
    return `/${newPath}`;
  };

  if (isLoading && !names) return <div>Loading...</div>;

  return (
    <div className="BreadcrumbRow">
      {pathParts.map((part, i) => (
        <div className="Row" key={part}>
          <a className="Breadcrumb" href={getDestination(i)}>
            {names[i].charAt(0).toUpperCase() + names[i].slice(1)}
          </a>
          {i < pathParts.length - 1 && <span className="Breadcrumb">/</span>}
        </div>
      ))}
      <div>{isLoading && <p>Updating...</p>}</div>
    </div>
  );
}

export default Breadcrumb;
