exports = async function(arg){
  let dateQuery = new Date();
  dateQuery.setDate(dateQuery.getDate() - 1);
  const pipeline = [
    { $match: { createdAt: { $gt: dateQuery } } }, 
    {
     $group: {
        _id: {
            cluster: '$cluster', namespace: '$namespace'
        },
        violations: { $addToSet: { rule: '$rule', field: '$field' }}
      }
    }];
  var collection = await context.services.get("Cluster0").db("contReview").collection("reviewResult");
  var result = await collection.aggregate(pipeline);
  return result;
};
