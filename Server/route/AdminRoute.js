import express from "express";
import con  from "../utils/DB.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import multer from 'multer';
import path from 'path'

const router = express.Router();
router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);  // Debugging output
            return res.status(500).json({ loginStatus: false, Error: "Query error" });
        }
        console.log('Query Result:', result);  // Debugging output
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign(
                { role: "admin", email: email },
                "jwt_secret_key", { expiresIn: "1d" }
            );
            res.cookie('token', token);
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
});
});
router.get('/category', (req, res) =>{
    const sql = "SELECT * FROM Category";
    con.query(sql, (err, result) =>{
        if(err) {
            console.error("Query Error:", err);
            return res.json({Status: false, Error: "Query Error"});
    }
        return res.json ({Status: true, Result: result});
    });
});
router.post('/add_category', (req, res) =>{
    const sql = "INSERT INTO Category (`name`) VALUES (?)";
    con.query(sql, [req.body.name], (err, result) =>{
        if(err) {
            console.error("Query Error:", err);
        return res.json({Status: false, Error: "Query Error"});
    }   
    return res.json({Status: true});
    })
})

 // image upload
 const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/images')
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
 })
  const upload = multer({
    storage: storage
  })
 // end image upload
router.post('/add_employee', upload.single('image'), (req, res) => {
    const sql = `INSERT INTO Employee (name, email, password, address, salary, image, category_id) VALUES (?)`;
     bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
            console.error('Hashing Error:', err);
            return res.json({Status: false, Error: "Hashing Error"})
        }
        const values = [
        req.body.name,
        req.body.email,
        hash,
        req.body.address,
        req.body.salary,
        req.file.filename,
        req.body.category_id
    ];
    con.query(sql, [values], (err, result) => {
        if(err) {
            console.error('SQL Query Error:',err);
            return res.json({Status: false, Error: "Query Error", Details: err});
        }  
            return res.json ({Status: true})
    
    })
     })
})
router.get('/employee', (req, res) =>{
    const sql = "SELECT * FROM Employee";
    con.query(sql, (err, result) =>{
        if(err) {
            console.error("Query Error:", err);
            return res.json({Status: false, Error: "Query Error"});
    }
        return res.json ({Status: true, Result: result});
    });
});
export {router as adminRouter}