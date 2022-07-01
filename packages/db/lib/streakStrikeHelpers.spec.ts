import assert from 'assert';
import { timeWhenStrike } from "./streakStrikeHelpers";

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2022, 6, 5));
});

afterAll(() => {
  jest.useRealTimers();
});

describe('when last strike time is old', function () {
  const lastStrike = new Date(2000);

  it('should return tomorrow morning, if posted yesterday', () => {
    const lastPost = new Date(2022, 6, 4, 12); // yesterday
    assert.equal(
      timeWhenStrike(lastPost, lastStrike)?.toISOString(),
      new Date(2022, 6, 6)?.toISOString()
    )
  });

  it('should return tomorrow^2 morning, if posted today', () => {
    const lastPost = new Date(2022, 6, 5, 12); // today
    assert.equal(
      timeWhenStrike(lastPost, lastStrike)?.toISOString(),
      new Date(2022, 6, 7)?.toISOString()
    )
  });
});

describe('when last strike time is within the day', function () {

  it('should return tomorrow morning, if posted old & striked today', () => {
    const lastPost = new Date(2022, 5, 5, 12);
    const lastStrike = new Date();
    assert.equal(
      timeWhenStrike(lastPost, lastStrike)?.toISOString(),
      new Date(2022, 6, 6)?.toISOString()
    )
  });

  it('should return tomorrow^2 morning, if posted today & striked today', () => {
    const lastPost = new Date();
    const lastStrike = new Date();
    assert.equal(
      timeWhenStrike(lastPost, lastStrike)?.toISOString(),
      new Date(2022, 6, 7)?.toISOString()
    )
  });
});