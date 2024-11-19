// Require MongoDB language driver
const { MongoClient } = require("mongodb")


// Set the value of uri to your Atlas connection string.
const uri = 'mongodb+srv://waiweng84:3dS4NAlIJLShs0TC@test-cluster1.vp6si.mongodb.net/?retryWrites=true&w=majority&appName=test-Cluster1'

// Create the MongoClient instance
const client = new MongoClient(uri)

// Collections
const accounts = client.db("bank").collection("accounts")
const transfers = client.db("bank").collection("transfers")
const transactions = client.db("bank").collection("transactions")


// Account information
let account_id_sender = "MDB829001338"
let account_id_receiver = "MDB829001337"
let transaction_amount = 10000000

// Start the client session
const session = client.startSession()

// use withTransaction to start a transaction, execute the callback, and commit the transaction
// the callback for withTransaction must be async/await
// Note: Each individual operation must be awaited and have the session passed in as an argument
const main = async () => {
    try {
        const transactionResults = await session.withTransaction(async () => {
            // Step 1: Update the account sender balance
            const senderUpdate = await accounts.updateOne(
                { account_id: account_id_sender },
                { $inc: { balance: -transaction_amount } },
                { session }
              )
            console.log(
                `${senderUpdate.matchedCount} document(s) matched the filter, updated ${senderUpdate.modifiedCount} document(s) for the sender account`
            )
            // Step 2: Update the receiver's account
            const receiverUpdate = await transfers.updateOne(
                { account_id: account_id_receiver },
                { $inc: { balance: transaction_amount } },
                { session }
              )
              console.log(
                `${receiverUpdate.matchedCount} document(s) matched the filter, updated ${receiverUpdate.modifiedCount} document(s) for the receiver account`
            )
            // Step 3: create a document and insert it to the transfer collection
            const transfer = {
                transfer_id: "TR21872187",
                amount: 10000000,
                from_account: account_id_sender,
                to_account: account_id_receiver,
              }
              
            const insertTransferResults = await transactions.insertOne(transfer, { session })
            console.log(`Successfully inserted ${insertTransferResults.insertedId} in the transaction collection`)
            // Step 4: Update transfer_complete array of the sender's account by adding the transfer_id to the array
            const updateSenderTransferResults = await accounts.updateOne(
                { account_id: account_id_sender },
                { $push: { transfers_complete: transfer.transfer_id } },
                { session }
              )
            console.log(`${updateSenderTransferResults.matchedCount} document(s) matched in the accounts collection, updated ${updateSenderTransferResults.modifiedCount}`)
            // Step 5 Update the transfer_complete array of the receivers account by adding the transfer_id to the array
            const updateReceiverTransferResults = await transfers.updateOne(
                { account_id: account_id_receiver },
                { $push: { transfers_complete: transfer.transfer_id } },
                { session }
              )
            console.log(`${updateReceiverTransferResults.matchedCount} document(s) matched in the transfer collection, updated ${updateReceiverTransferResults.modifiedCount}`)
          })
          console.log("Commiting transaction...")
          // log a message regarding the success or failure of the transactions
          if (transactionResults) {
            console.log("Transaction failed")
          } else {
            console.log("Transaction completed successfully.")
          }
  
            
        } catch (err) {
            console.error(`Transaction aborted: ${err}`)
            process.exit(1)
          } finally {
            await session.endSession()
            await client.close()
          }
 }
 
 // Run the main function, catch any errors and finally close the connection when the main function is done
 main()
 .catch((err) => console.log(err))
 .finally(() => client.close())