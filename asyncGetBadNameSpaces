exports = async function() {
    
    // Supply projectID and clusterNames...
    const projectID = '621f12c72843ee414562f255';
    const clusterNames = ['Cluster0'];
    const cluster = 'Cluster0';
  
    // Get stored credentials...
    const username = context.values.get("username");;
    const password = context.values.get("password");;
    const process = context.values.get("process");;
    console.log(`Atlas Public + Private Keys: ${username}, ${password}`)
    
    //To be inserted to target collection
    let reviewComment = {
     docs: [] 
    };
    
    /*
    // The below piece is a sample showing how data from Atlas APIs (metrics, profiler) etc can be pulled
    // if they need to be included in the dashboard
    
    const arg = { 
      scheme: 'https', 
      host: 'cloud.mongodb.com', 
      path: 'api/atlas/v1.0/groups/' + projectID + '/processes/' + process + '/performanceAdvisor/namespaces', 
      username: username, 
      password: password,
      headers: {'Content-Type': ['application/json'], 'Accept-Encoding': ['bzip, deflate']}, 
      digestAuth:true
    };
    
    // The response body is a BSON.Binary object. Parse it and return.
    response = await context.http.get(arg);
    const body = JSON.parse(response.body.text());
    */
    
    // get list of collections
    let collections = await context.functions.execute('asyncGetCollections', 'Cluster0');


    // enforce the rules
    for(i=0; i<collections.length; i++){
      try{
        
        const collection = await context.services.get("Cluster0").db(collections[i].dbName).collection(collections[i].collectionName);
        let document = await collection.findOne();
        const type = typeof document._id;
        if(type=='string'){
          reviewComment.cluster = "Cluster0";
          namespace=collections[i].dbName+'.'+collections[i].collectionName;
          reviewComment.docs.push({"cluster": cluster, "createdAt": new Date(), "namespace": namespace, "field": '_id', "rule": "_id should not be string"});
        }
        let values = Object.values(document);
        let keys = Object.keys(document);
        for(k=0; k<values.length; k++){
          if(values[k]==null||values[k]==''){
            namespace=collections[i].dbName+'.'+collections[i].collectionName;
            reviewComment.docs.push({"cluster": cluster, "createdAt": new Date(), "namespace": namespace, "field": keys[k], "rule": "null values should not be stored"});
          }
        }
      }
      catch(err){
            console.error('Failed to find documents. error: ' + EJSON.stringify(err));
      }
    }
    
    // bulk insert to target collection
    context.services.get("Cluster0").db("contReview").collection("reviewResult").insertMany(reviewComment.docs)
      .then(result => console.log(`Successfully inserted items with _id: ${EJSON.stringify(result)}`))
      .catch(err => console.error(`Failed to insert items: ${err}`));

    return "executed";
  };
