const mongoose=require('mongoose')
const express=require('express')
const bodyParser=require('body-parser')
const {Expense}=require('./schema.js')
const cors=require('cors')
const app=express()
app.use(bodyParser.json())
app.use(cors())
 async function connecttodb(){
 try{
    await mongoose.connect('mongodb+srv://ashwithaa:WynlhhO4B8YPwtWc@cluster0.gwnlctj.mongodb.net/cluster?retryWrites=true&w=majority&appName=Cluster0')
 console.log('db connection established')
 const port=process.env.PORT || 8000
    app.listen(port,function(){
        console.log(`listening on port ${port}`)
 })
 }catch(error){
    console.log(error)
    console.log('couldn\'t connect')
 }
}
connecttodb()

app.post('/add-expense',async function(request,response){
   try{
      await Expense.create({
         "amount":request.body.amount,
         "category":request.body.category,
         "date":request.body.date
      })
      response.status(201).json({
      "status":"success",
      "entry":"created"
      })
   }catch(error){
      response.status(500).json({
         "status":"failure",
         "entry":"not created",
         "error":error
         })
   }
})

app.get('/get-expenses', async function(request, response) {
   try {
       const expenseDetails = await Expense.find()
       response.status(200).json(expenseDetails)
   } catch(error) {
       response.status(500).json({
           "status" : "failure",
           "message" : "could not fetch data",
           "error" : error
       })
   }
})

app.delete('/delete/:id',async function(request, response) {
   try{
      const expenseentry=await Expense.findById(request.params.id)
      if(expenseentry){
         await Expense.findByIdAndDelete(request.params.id)
         response.status(200).json({
            "status":"success"
         })
      }else{
         response.status(404).json({
            "status":"failure"
         })
      }
   }catch(error){
      response.status(500).json({
         "status":"failure"
      })
   }
})



app.patch('/update/:id',async function(request,response){
   try{
      const expenseentry=await Expense.findById(request.params.id)
      if(expenseentry){
       await expenseentry.updateOne({
            "amount": request.params.amount,
            "category": request.params.category,
            "date": request.params.date
         })
         response.status(200).json({
            "status":"success"
         })
      }else{
         response.status(404).json({
            "status":"failure"
         })
      }
   }catch(error){
      response.status(500).json({
         "status":"failure"
      })
   }
})
