const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the partitionKey as passed when the property is available, is a String and has lenght <= 256", () => {
    let event = {partitionKey: "partitionkey123"}
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(event.partitionKey);
  });

  it("Returns the partitionKey HASHED on SHA3-512 when the property is available and has lenght > 256", () => {
    let event = {partitionKey: "this are more than 256 characters using this sample text to mock a partition key that surpasses the maximum defined on characters for the deterministic partition functionality. this are more than 256 characters using this sample text to mock a partition key that surpasses the maximum defined on characters for the deterministic partition functionality"}
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(crypto.createHash("sha3-512").update(event.partitionKey).digest("hex"));
  });

  it("Returns the partitionKey as String  when the property is available, is NOT a String and has lenght <= 256", () => {
    let event = {partitionKey: 123}
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(JSON.stringify(event.partitionKey));
  });
  
  it("Returns the event stringified and HASHED on SHA3-512 when event is defined BUT the property partitionKey is NOT defined", () => {
    let event = {property: "Sample Property"}
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex"));
  });
  
});


