const express=require("express")
const cors=require("cors")
const bodyparser=require("body-parser")
const mongoose = require('mongoose');
const SearchHistory = require('./model/history');

require('dotenv').config();

const {Configuration, OpenAIApi} = require('openai')

const config =new Configuration({
    apiKey:process.env.APIKEY,
})

const openai=new OpenAIApi(config);

//server
const app=express();
app.use(bodyparser.json());
app.use(cors());

//endpoint for prompt
app.post("/chat", async (req,res) =>{
   const {prompt}=req.body;
   try {
     const completion= await openai.createCompletion({
     model: "text-davinci-003",
     max_tokens: 512,
     temperature:0,
     prompt: prompt,
     });
   
     const output=completion.data.choices[0].text;
     const searchRecord = new SearchHistory({
        result: output,
        timestamp: new Date()
     });
     await searchRecord.save();
     res.status(200).send(output);

   } catch (error) {
     res.status(501).send({error:error.message})
   }
  
})

app.displayhistory("/display", async (req,res)=>{
    try {
        // Retrieve chat history from MongoDB
        const chatHistory = await SearchHistory.find().sort({ timestamp: -1 });

        res.json(chatHistory);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const port=8000;
app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
}); 

const dbUrl = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

