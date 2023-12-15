import { Coordinate } from './coordinate'; // Adjust the import path based on your project structure

describe('Coordinate', () => {
  it('should create an instance of Coordinate', () => {
    const coordinate = new Coordinate(1, 2);

    expect(coordinate).toBeTruthy();
    expect(coordinate.x).toBe(1);
    expect(coordinate.y).toBe(2);
  });

  it('should have the correct values after instantiation', () => {
    const coordinate = new Coordinate(3, 4);

    expect(coordinate.x).toBe(3);
    expect(coordinate.y).toBe(4);
  });

  // Add more test cases as needed
});
