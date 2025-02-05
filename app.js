// Require MongoDB language driver
const { MongoClient } = require("mongodb")


// Set the value of uri to your Atlas connection string.
const uri = 'mongodb+srv://xxx:xxx@test-cluster1.vp6si.mongodb.net/?retryWrites=true&w=majority&appName=test-Cluster1'

// Create the MongoClient instance
const client = new MongoClient(uri)

// Inserting a bank account information in the accounts collection name in the bank database
const dbname = "bank"
const collection_name = "accounts"
const accountsCollection = client.db(dbname).collection(collection_name)

const sampleAccount = [{
 account_holder: "Elon Musk",
 account_id: "MDB829001337",
 account_type: "checking",
 balance: 50352434
},
{
 account_holder: "Jeff Bezos",
 account_id: "MDB829001338",
 account_type: "checking",
 balance: 10352434},
 {
 account_holder: "Mark Zuckerberg", 
 account_id: "MDB829001339",
 account_type: "checking",
 balance: 20352434}]


// Document used as a filter for the find() method
const documentsToFind = { balance: { $gt: 10000000 } }

// Document used to be updated
const documentToUpdate = { account_id: "MDB829001338" }

const update = { $inc: { balance: 10000000 } }

//Document to delete
const documentsToDelete = { account_id: "MDB829001337" }

//Move Elon Musk account to transfer account
const transfers = client.db("bank").collection("transfers")

const transferAccount = {
    account_holder: "Elon Musk",
    account_id: "MDB829001337",
    account_type: "checking",
    balance: 50352434
   }

// Establishes a connection to the database using the MongoClient instance
const main = async () => {
   try {
      await client.connect()
      console.log("Connected to the database");
      const db = client.db(dbname);

      // Drop the accounts collection if it exists
      const accountsExists = await accountsCollection.countDocuments();
      if (accountsExists > 0) {
          await accountsCollection.drop();
          console.log("Dropped accounts collection");
      }

      // Drop the transfers collection if it exists
      const transfersCollection = db.collection("transfers");
      const transfersExists = await transfersCollection.countDocuments();
      if (transfersExists > 0) {
          await transfersCollection.drop();
          console.log("Dropped transfers collection");
      }

      // Drop the bank database if it exists
      const dbList = await client.db().admin().listDatabases();
      if (dbList.databases.some(db => db.name === dbname)) {
          await db.dropDatabase();
          console.log("Dropped bank database");
      }
      // list out all the databases in the cluster
      const dbs = await client.db().admin().listDatabases()
      console.table(dbs.databases)
      // insertOne method is used here to insert the sampleAccount document
      let insertAccount = await accountsCollection.insertMany(sampleAccount)
      console.log(`Inserted document: ${insertAccount.insertedId}`)
      // find() method is used here to find documents that match the filter
      let findAccount = accountsCollection.find(documentsToFind)
      let docCount = accountsCollection.countDocuments(documentsToFind)
      await findAccount.forEach((doc) => console.log(doc))
      console.log(`Found ${await docCount} documents`)
      // update() method is used here to update the account that match the filer
      let updateAccount = await accountsCollection.updateOne(documentToUpdate, update)
      updateAccount.modifiedCount === 1
      ? console.log("Updated one document")
      : console.log("No documents updated")
      // delete() method is used here to delete documents that match the filter
      let deleteAccount = await accountsCollection.deleteOne(documentsToDelete)
      deleteAccount.deletedCount > 0
        ? console.log(`Deleted ${deleteAccount.deletedCount} documents`)
        : console.log("No documents deleted")
      await findAccount.forEach((doc) => console.log(doc))
      console.log(`Found ${await docCount} documents`)
      // insert Elon Musk account to transfer collection
      let insertTransferAccount = await transfers.insertOne(transferAccount)
      console.log(`Inserted document: ${insertTransferAccount.insertedId}`)      
   } catch (error) {
      console.error(error);
      process.exit(1);
   } finally {
      await client.close()
   }
}

// Run the main function, catch any errors and finally close the connection when the main function is done
main()
   .catch((err) => console.log(err))
   .finally(() => client.close())

