import express from 'express';
import con  from "../utils/DB.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/employee_login', (req, res) => {
    const sql = "SELECT * FROM Employee Where email = ?";
    con.query(sql, [req.body.email],  (err, result) => {
        if (err) {
            console.error('SQL Error:', err);  
            return res.status(500).json({ loginStatus: false, Error: "Query error" });
        }
        console.log('Query Result:', result); 
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (err, response) =>{
                if(err) {
                    console.error(`Bcrypt Error:`, err);
                    return res.status(500).json({ loginStatus: false, Error: "Wrong Password" });
                }
                if(response){
                    const email = result[0].email;
                    const token = jwt.sign(
                        { role: "employee", email: email, id:  result[0].id},
                        "jwt_secret_key", { expiresIn: "1d" }
                    );
                    res.cookie('token', token, {httpOnly: true});
                    return res.json({ loginStatus: true, id: result[0].id});
                    
                }else {
                    // if password is incorrect
                    return res.status(401).json({loginStatus: false, Error: "Wrong email or password"})
                }
            });
           
        } else {
            // if email is incorrect
            return res.status(401).json({ loginStatus: false, Error: "Wrong email or password" });
        }
});
});
router.get('/detail/:id', (req, res) =>{
    const id = req.params.id;
    const sql = 'SELECT * FROM Employee where id = ?'
    con.query(sql, [id], (err, result) =>{
        if(err) return res.json({Status: false});
        return res.json(result)
    })
})
router.get('/logout', (req, res) =>{
    res.clearCookie('token')
    return res.json({Status: true})
})
export {router as EmployeeRouter}