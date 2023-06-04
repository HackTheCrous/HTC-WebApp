import test from "unit.js";
import UserController from "../controllers/UserController";

describe('Test Authentication', () => {
  it('Test gen refresh token', async () => {
    const token = UserController.genRefreshToken();
    test.assert(token.length === 128);
    
  });
})
