const { faker } = require("@faker-js/faker");

module.exports = () => {
  const data = { posts: [], users: [] };

  // users
  for (let i = 0; i < 3; i++) {
    data.users.push({ id: `${i + 1}`, name: faker.name.fullName() });
  }

  // posts
  for (let i = 0; i < 5; i++) {
    const uniqCountReaction = () => faker.datatype.number({ min: 1, max: 10 });
    const uniqNumber = () =>
      faker.datatype.number({ min: 1, max: data.users.length });

    data.posts.push({
      id: `${faker.random.numeric(5)}`,
      title: faker.lorem.sentence(),
      content: faker.lorem.lines(),
      reactions: {
        thumbsUp: uniqCountReaction(),
        hooray: uniqCountReaction(),
        heart: uniqCountReaction(),
        rocket: uniqCountReaction(),
        eyes: uniqCountReaction(),
      },
      user: `${uniqNumber()}`,
      date: faker.datatype.datetime({ min: 1577836800000, max: 1669836800000 }),
    });
  }

  return data;
};
