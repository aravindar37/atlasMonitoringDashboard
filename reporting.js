exports = async function(arg){
  let querydate = new Date();
  querydate.setDate(querydate.getDate() - 1);
  console.log(querydate);
  const pipeline = [{ $match: { createdAt: { $gt: querydate } } }, { $unwind: { path: '$ruleViolation', preserveNullAndEmptyArrays: false } }, { $group: { _id: '$cluster', ruleViolation: { $addToSet: '$ruleViolation' } }}];
  var collection = await context.services.get("Cluster0").db("contReview").collection("reviewResult");
  var result = await collection.aggregate(pipeline);
  console.log(EJSON.stringify(result));
  return result;
};
