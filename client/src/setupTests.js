// localStorage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}

global.localStorage = localStorageMock;

// mock fetchApi
jest.mock("./utils/fetchApi", () => jest.fn())
jest.mock("./utils/fetchAuthApi", () => jest.fn())

