import supertest from "supertest";
import config from "../config";

const account = {
  async createUser(creds) {
    return supertest(config.url)
      .post("/Account/v1/User")
      .set("Accept", "application/json")
      .send(creds);
  },
  async getToken(creds) {
    return await supertest(config.url)
      .post("/Account/v1/GenerateToken")
      .set("Accept", "application/json")
      .send(creds);
  },
  async checkAuth(creds) {
    return await supertest(config.url)
      .post("/Account/v1/Authorized")
      .set("Accept", "application/json")
      .send(creds);
  },
  async getUserInfo(id, token) {
    return await supertest(config.url)
      .get(`/Account/v1/User/${id}`)
      .set({ accept: "application/json", Authorization: `Bearer ${token}` });
  },
  async deleteUser(id, token) {
    return await supertest(config.url)
      .delete(`/Account/v1/User/${id}`)
      .set({ accept: "application/json", Authorization: `Bearer ${token}` });
  },
  async deleteUserAfterTest(id, creds) {
    const auth = await this.getToken(creds);
    const token = auth.body.token;
    await this.deleteUser(id, token);
    //console.log(res.status, res.body);
  },
  async getTokenInCache(creds) {
    const res = await this.getToken(creds);
    return res.body.token;
  },
  getUniqueLogin: () => {
    return "usertest" + Math.floor(Math.random() * 10000);
  },
};

export default account;
