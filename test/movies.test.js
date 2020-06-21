const request = require("supertest");
const { Movie } = require("../models/movie/movies");
const { User } = require("../models/user/users");
let server;
describe("/api/movies", () => {
  beforeEach(() => {
    server = require("../index");
  });
  afterEach(async () => {
    server.close();
    await Movie.deleteMany({});
  });

  describe("GET", () => {
    it("should return all the movies", async () => {
      await Movie.collection.insertMany([
        { name: "movie1", numberInStock: 50, dailyRentalRate: 10 },
        { name: "movie2", numberInStock: 50, dailyRentalRate: 10 },
      ]);
      const token = new User().generateAuthToken();
      const res = await request(server)
        .get("/api/movies")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((c) => c.name === "movie1")).toBeTruthy();
      expect(res.body.some((c) => c.name === "movie2")).toBeTruthy();
    });
  });
  describe(" GET /:id", () => {
    it("should return a movie if valid id is passed", async () => {
      const movie = await new Movie({
        name: "movie1",
        numberInStock: 50,
        dailyRentalRate: 10,
      });
      await movie.save();
      const token = new User().generateAuthToken();
      const res = await request(server)
        .get("/api/movies/" + movie._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", movie.name);
    });

    it("should return 401 if invalid id is passed", async () => {
      const res = await request(server).get("/api/movies/1");
      expect(res.status).toBe(401);
    });
  });

  describe(" POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/movies")
        .send({ name: "Movie12", numberInStock: 20, dailyRentalRate: 100 });

      expect(res.status).toBe(401);
    });

    it("should return 400 if course name is less than 5 chars", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({ name: "1234", numberInStock: 20, dailyRentalRate: 100 });

      expect(res.status).toBe(400);
    });

    it("should return 400 if movie name is greater than 50 chars", async () => {
      let movieName = "a";
      while (movieName.length < 101) {
        movieName += "a";
      }
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/movies/")
        .set("x-auth-token", token)
        .send({ name: movieName, numberInStock: 20, dailyRentalRate: 100 });

      expect(res.status).toBe(400);
    });
  });
});
