import account from "../services/user";
import config from "../config";
import { faker } from "@faker-js/faker";

const passwordValid = "123ASD!_09hg1";
const passwordInvalid = "123ASD";

describe("createUser api tests", () => {
  test("create user with valid login and password => success", async () => {
    const creds = {
      userName: faker.internet.userName(),
      password: passwordValid,
    };
    const res = await account.createUser(creds);
    expect(res.status).toBe(201);
    expect(res.body.username).toBe(creds.userName);
    await account.deleteUserAfterTest(res.body.userID, creds);
  });
  test("create ueser with exist login => fail", async () => {
    const res = await account.createUser(config.credentials);
    expect(res.status).toBe(406);
    expect(res.body.code).toBe("1204");
    expect(res.body.message).toBe("User exists!");
  });
  test("create user with invalid password => fail", async () => {
    const res = await account.createUser({
      userName: faker.internet.userName(),
      password: passwordInvalid,
    });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("1300");
    expect(res.body.message).toBe(
      "Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.",
    );
  });
});

describe("getToken tests", () => {
  test("authorization with invalid password => fail", async () => {
    const res = await account.getToken({
      userName: faker.internet.userName(),
      password: passwordInvalid,
    });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Failed");
    expect(res.body.result).toBe("User authorization failed.");
  });
  test("authorization with valid login and password => success", async () => {
    const res = await account.getToken(config.credentials);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Success");
    expect(res.body.result).toBe("User authorized successfully.");
    expect("token" in res.body).toBeTruthy();
  });
});

describe("authorized tests", () => {
  test("check authorisation if user authorized => true", async () => {
    await account.getToken(config.credentials);
    const res = await account.checkAuth(config.credentials);
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });
  test("check authorisation if user unauthorized => false", async () => {
    const creds = {
      userName: faker.internet.userName(),
      password: passwordValid,
    };
    const user = await account.createUser(creds);
    const res = await account.checkAuth(creds);
    expect(res.status).toBe(200);
    expect(res.body).toBeFalsy();
    await account.deleteUserAfterTest(user.body.userID, creds);
  });
  test("check authorization if creds are invalid=> failed", async () => {
    const res = await account.checkAuth({
      userName: faker.internet.userName(),
      password: passwordValid,
    });
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("1207");
    expect(res.body.message).toBe("User not found!");
  });
});

describe("getUserInfo tests", () => {
  test("try to get info authorized => success", async () => {
    const creds = {
      userName: faker.internet.userName(),
      password: passwordValid,
    };
    const user = await account.createUser(creds);
    const id = user.body.userID;
    const token = await account.getTokenInCache(creds);
    const res = await account.getUserInfo(id, token);
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe(id);
    expect(res.body.username).toBe(creds.userName);
    await account.deleteUserAfterTest(id, creds);
  });
  test("try to get info unauthorized => fail", async () => {
    const creds = {
      userName: faker.internet.userName(),
      password: passwordValid,
    };
    const user = await account.createUser(creds);
    const id = user.body.userID;
    const token = "";
    const res = await account.getUserInfo(id, token);
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("1200");
    expect(res.body.message).toBe("User not authorized!");
    await account.deleteUserAfterTest(id, creds);
  });
  test("try to get info if token and userid from different users => fail", async () => {
    const creds = {
      userName: faker.internet.userName(),
      password: passwordValid,
    };
    const user = await account.createUser(creds);
    const id = user.body.userID;
    const token = await account.getTokenInCache(config.credentials);
    const res = await account.getUserInfo(id, token);
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("1200");
    expect(res.body.message).toBe("User not authorized!");
    await account.deleteUserAfterTest(id, creds);
  });
  test("try to get info if userid not exsists => fail", async () => {
    const creds = {
      userName: faker.internet.userName(),
      password: passwordValid,
    };
    const user = await account.createUser(creds);
    const id = user.body.userID + "8";
    const token = await account.getTokenInCache(creds);
    const res = await account.getUserInfo(id, token);
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("1207");
    expect(res.body.message).toBe("User not found!");
    await account.deleteUserAfterTest(id, creds);
  });
});
describe("deleteUser tests", () => {
  test("try to delete user authorized => success", async () => {
    const creds = {
      userName: faker.internet.userName(),
      password: passwordValid,
    };
    const user = await account.createUser(creds);
    const id = user.body.userID;
    const token = await account.getTokenInCache(creds);
    const res = await account.deleteUser(id, token);
    expect(res.status).toBe(204);
  });
  test("try to delete user unauthorized => fail", async () => {
    const creds = {
      userName: faker.internet.userName(),
      password: passwordValid,
    };
    const user = await account.createUser(creds);
    const id = user.body.userID;
    const token = "";
    const res = await account.deleteUser(id, token);
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("1200");
    expect(res.body.message).toBe("User not authorized!");
    await account.deleteUserAfterTest(id, creds);
  });
  test("try to delete another user => fail", async () => {
    const creds = {
      userName: faker.internet.userName(),
      password: passwordValid,
    };
    const user = await account.createUser(creds);
    const id = user.body.userID;
    const token = await account.getTokenInCache(config.credentials);
    const res = await account.getUserInfo(id, token);
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("1200");
    expect(res.body.message).toBe("User not authorized!");
    await account.deleteUserAfterTest(id, creds);
  });
});
