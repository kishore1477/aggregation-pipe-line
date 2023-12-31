import express from 'express'
import mongoose from 'mongoose';
const { Schema } = mongoose;
const app = express()
app.use(express.json());
const port = 3000
const DATABASE_URL = 'mongodb+srv://personal:personal@cluster0.jbfhiuh.mongodb.net/?retryWrites=true&w=majority'
// mongoose.connect('mongodb://localhost:27017/test');

// Connect mongoDb 
 const connectDb = async(DataBaseUrl)=>{
    try {
        const DB_OPTIONS ={
            dbName : "aggregatepipeline"
        }
   await mongoose.connect(DataBaseUrl, DB_OPTIONS)
   console.log("connected Successfully inside ")
    } catch (error) {
        console.log(error)
    }
}
connectDb(DATABASE_URL).then(()=>{
    console.log("connected Successfully")
})
// Create a model 
const studentSchema = new Schema({
        student_id: String,
        class: Number,
        section: String,
        course_fee: Number
})
const Students = mongoose.model('Student',  studentSchema);
app.post('/students',async(req, res)=>{
console.log('req is', req.body)
const add  = await  Students.insertMany([{
    student_id: "P0001",
    class: 101,
    section: "A",
    course_fee: 12
    }, 
    {
    student_id: "P0002",
    class: 102,
    section: "A",
    course_fee: 8
    }, 
    {
    student_id: "P0002",
    class: 101,
    section: "A",
    course_fee: 12
    },
    {
    student_id: "P0004",
    class: 103,
    section: "B",
    course_fee: 19,
    }])
    console.log("add", add)
})
// app.get('/aggregateData', async(req, res) => {
//    const data  = await Students.aggregate([
//         { $match: { section: "A" } },
//         { $group: { student_id: "student_id", total: {$sum: "$course_fee" }}} 
//             ])
// console.log("data", data)
// //   res.json({data})
// })
app.get('/aggregateData', async (req, res) => {
    try {
         const data = await Students.aggregate([
            //  { $match: { section: "A" } },
            //  { $group: { _id: "$student_id", total: { $sum: "$course_fee" } } }
            { $match: { section: "A" } },
    { $group: { _id: "$student_id", section: { $first: "$section" }, total: { $sum: "$course_fee" } } },
    { $project: { _id: 0, student_id: "$_id", section: 1, total: 1 } },
    {$sort : {total:-1}}
    //  1=>  ascending order   and  -1  => descending order
         ]);
 
         console.log("data", data);
         res.json({ data });
     } catch (error) {
         console.error("Error in aggregation:", error);
         res.status(500).json({ error: "Internal Server Error" });
     }
 });
 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})