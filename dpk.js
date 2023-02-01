const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  const hash = "sha3-512";
  const digest = "hex";
  let candidate = TRIVIAL_PARTITION_KEY;
  if(event){
    const data = JSON.stringify(event);
    candidate = crypto.createHash(hash).update(data).digest(digest);
    if(event.partitionKey) {
      candidate = typeof event.partitionKey !== "string" ?  JSON.stringify(event.partitionKey):  event.partitionKey;
      if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
        candidate = crypto.createHash(hash).update(candidate).digest(digest);
      }
    }
  }
 
  return candidate;
};