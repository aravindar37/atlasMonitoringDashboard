exports = async function(cluster){
  let result = [];
            try{
              const mongodb = await context.services.get(cluster);
              const admin = await mongodb.admin();
              dbNames = await admin.getDBNames();
              for(i=0; i<dbNames.length; i++){
                //skip system databases
                if (dbNames[i] == 'admin'||dbNames[i] == 'config'||dbNames[i] == 'local') { continue; }
                const db = await mongodb.db(dbNames[i]);
                const collections = await db.getCollectionNames();
                for(j=0; j<collections.length; j++)
                  result.push({'dbName': dbNames[i], 'collectionName': collections[j]});
              }
            }       
            catch(err){
            console.error('Failed to load collectionNames:'+ EJSON.stringify(err));
            }
  return result;
};
