import { faker } from "@faker-js/faker";

const hashStringToNumber = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const fetchData = async (path) => {
  const seed = hashStringToNumber(window.location.pathname);
  faker.seed(seed);

  await new Promise((resolve) =>
    setTimeout(resolve, faker.number.int({ min: 3, max: 5 }) * 1000)
  );

  return path.split("/").filter((word) => word !== "").length % 2 === 0
    ? {
        id: faker.word.sample(5),
        name: faker.person.lastName(),
      }
    : [
        {
          id: faker.word.sample(5),
          name: faker.person.lastName(),
        },
        {
          id: faker.word.sample(5),
          name: faker.person.lastName(),
        },
        {
          id: faker.word.sample(5),
          name: faker.person.lastName(),
        },
      ];
};
