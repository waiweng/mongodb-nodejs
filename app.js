// Require MongoDB language driver
const { MongoClient } = require("mongodb")


// Set the value of uri to your Atlas connection string.
const uri = 'mongodb+srv://waiweng84:3dS4NAlIJLShs0TC@test-cluster1.vp6si.mongodb.net/?retryWrites=true&w=majority&appName=test-Cluster1'

// Create the MongoClient instance
const client = new MongoClient(uri)

// Inserting a bank account information in the accounts collection name in the bank database
const dbname = "bank"
const collection_name = "accounts"
const accountsCollection = client.db(dbname).collection(collection_name)

const sampleAccount = {
 account_holder: "Elon Musk",
 account_id: "MDB829001338",
 account_type: "checking",
 balance: 50352434,
}

// Document used as a filter for the find() method
const documentsToFind = { balance: { $gt: 4700 } }

// Document used to be updated
const documentToUpdate = { account_id: "MDB829001338" }

const update = { $inc: { balance: 100 } }

// Establishes a connection to the database using the MongoClient instance
const main = async () => {
   try {
      await client.connect()
      console.log("Connected to MongoDB Atlas!")
      // list out all the databases in the cluster
      const dbs = await client.db().admin().listDatabases()
      console.table(dbs.databases)
      // insertOne method is used here to insert the sampleAccount document
      let result = await accountsCollection.insertOne(sampleAccount)
      console.log(`Inserted document: ${result.insertedId}`)
      // find() method is used here to find documents that match the filter
      let findAccount = accountsCollection.find(documentsToFind)
      let docCount = accountsCollection.countDocuments(documentsToFind)
      await findAccount.forEach((doc) => console.log(doc))
      console.log(`Found ${await docCount} documents`)
      let updateAccount = await accountsCollection.updateOne(documentToUpdate, update)
      updateAccount.modifiedCount === 1
      ? console.log("Updated one document")
      : console.log("No documents updated")
      await findAccount.forEach((doc) => console.log(doc))
      console.log(`Found ${await docCount} documents`)      
   } catch (error) {
      console.error(error)
   } finally {
      await client.close()
   }
}

// Run the main function, catch any errors and finally close the connection when the main function is done
main()
   .catch((err) => console.log(err))
   .finally(() => client.close())

