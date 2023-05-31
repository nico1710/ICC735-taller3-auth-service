import mongoose from "mongoose";
import { expect, sinon } from "../chai.config.js";
import UserModel from "../../src/models/user.model.js";

describe("Models: User model unit test", () => {
  let createStub;
  let findStub;
  const data = {
    name: "Nicolas",
    email: "nico@gmail.com",
    password: "123456",
    rut: "12345678-9",
    verified: true,
    blocked: false,
  };

  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/auth-service-local?readPreference=primary&ssl=false&directConnection=true`;
    mongoose.set("strictQuery", true);
    await mongoose.connect(url, { useNewUrlParser: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(() => {
    createStub = sinon.stub(UserModel, "create");
    findStub = sinon.stub(UserModel, "findOne");
  });

  afterEach(async () => {
    createStub.restore();
    findStub.restore();
    await UserModel.deleteMany({});
  });

  it("[SUCCESS] Create user with stub", async () => {
    const { _id, ...others } = data;

    await UserModel.create(others);
    expect(createStub.calledOnce).to.be.true;
  });

  it("[SUCCESS] should create a new document", async () => {
    await UserModel.create(data);

    expect(createStub.calledOnce).to.be.true;
    expect(createStub.calledWith(data)).to.be.true;
  });

  it("[SUCCESS] Check user doesn't exists", async () => {
    createStub.restore();

    await UserModel.create(data);

    const result = await UserModel.findOne({
      email: "nico@gmail.com",
    });

    expect(result).not.to.be.null;
    expect(createStub.calledOnce).not.to.be.true;
  });

  it("[SUCCESS] Check user exists", async () => {
    createStub.restore();

    const createdUser = await UserModel.create(data);

    const result = await UserModel.findOne({
      email: "nico@gmail.com",
    });

    expect(createStub.calledOnce).not.be.true;
    expect(findStub.calledWith({ email: data.email })).to.be.true;
  });
});
