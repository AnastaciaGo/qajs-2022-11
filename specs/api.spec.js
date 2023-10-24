const user = async (url, login, password) => {
  const result = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: login,
      password: password,
    }),
  })
    .then(async (res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
};

const urls = {
  user: "https://bookstore.demoqa.com/Account/v1/User",
  token: "https://bookstore.demoqa.com/Account/v1/GenerateToken",
};
const login = "usertest" + Math.floor(Math.random() * 10000);
const passwordValid = "123ASD!_09hg1";
const passwordInvalid = "123ASD";

describe("Api tests", () => {
  test("create user with valid login and password => success", async () => {
    const res = await user(urls.user, login, passwordValid);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.username).toBe(login);
  });
  test("create ueser with exist login => fail", async () => {
    const res = await user(urls.user, login, passwordValid);
    const data = await res.json();
    console.log(res.status, data);
    expect(res.status).toBe(406);
    expect(data.code).toBe("1204");
    expect(data.message).toBe("User exists!");
  });
  test("create user with invalid password => fail", async () => {
    const res = await user(urls.user, login, passwordInvalid);
    const data = await res.json();
    console.log(res.status, data);
    expect(res.status).toBe(400);
    expect(data.code).toBe("1300");
    expect(data.message).toBe(
      "Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.",
    );
  });
  test("authorization with invalid password => fail", async () => {
    const res = await user(urls.token, login, passwordInvalid);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Failed");
    expect(data.result).toBe("User authorization failed.");
  });
  test("authorization with valid login and password => success", async () => {
    const res = await user(urls.token, login, passwordValid);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("Success");
    expect(data.result).toBe("User authorized successfully.");
    expect("token" in data).toBeTruthy();
  });
});
