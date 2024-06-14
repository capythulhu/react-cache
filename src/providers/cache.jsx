import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchData } from "../mocks/api";

const CacheContext = createContext();

const normalize = (path) => path.replace(/(^\/)|(\/$)/g, "");

const loadCacheFromSession = () => {
  const cachedData = sessionStorage.getItem("cache");
  return cachedData ? JSON.parse(cachedData) : {};
};

const saveCacheToSession = (cache) => {
  sessionStorage.setItem("cache", JSON.stringify(cache));
};

export const CacheProvider = ({ children }) => {
  const cache = useRef(loadCacheFromSession());

  const useFetch = (path) => {
    path = normalize(path);
    const [state, setState] = useState({
      isLoading: true,
      error: null,
      data: cache.current[path],
    });

    useEffect(() => {
      const fetchDataAsync = async () => {
        try {
          if (!cache.current[path] || Array.isArray(cache.current[path])) {
            const result = await fetchData(path);
            if (Array.isArray(result)) {
              result.forEach((item) => {
                cache.current[`${path}/${item.id}`] = item;
              });
            }
            cache.current[path] = result;
            saveCacheToSession(cache.current);
          }
          setState({
            isLoading: false,
            error: null,
            data: cache.current[path],
          });
        } catch (error) {
          setState({ isLoading: false, error, data: null });
        }
      };

      fetchDataAsync();
    }, [path]);

    return state;
  };

  const useFetchNames = (path) => {
    path = normalize(path);
    const pathParts = path.split("/");
    const [state, setState] = useState({
      isLoading: true,
      error: null,
      names: null,
    });

    useEffect(() => {
      const fetchDataAsync = async () => {
        try {
          const names = await Promise.all(
            pathParts.map(async (word, i) => {
              const currentPath = pathParts.slice(0, i + 1).join("/");
              if (i % 2 === 0) return word;
              if (!cache.current[currentPath]) {
                const result = await fetchData(currentPath);
                cache.current[currentPath] = result;
                saveCacheToSession(cache.current);
              }
              return cache.current[currentPath].name;
            })
          );
          setState({ isLoading: false, error: null, names });
        } catch (error) {
          setState({ isLoading: false, error, names: null });
        }
      };

      fetchDataAsync();
    }, [path]);

    return state;
  };

  const useFetchAsync = async (path) => {
    path = normalize(path);
    try {
      if (!cache.current[path] || Array.isArray(cache.current[path])) {
        const result = await fetchData(path);
        if (Array.isArray(result)) {
          result.forEach((item) => {
            cache.current[`${path}/${item.id}`] = item;
          });
        }
        cache.current[path] = result;
        saveCacheToSession(cache.current);
      }
      return cache.current[path];
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CacheContext.Provider value={{ useFetch, useFetchNames, useFetchAsync }}>
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => useContext(CacheContext);
