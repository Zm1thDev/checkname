const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const pool = require('./db');
const { title } = require('process');
const app = express();

// ---------- Middleware ----------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------- ตั้งค่า EJS เป็น view engine ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static folder to server 
app.use(express.static(path.join(__dirname, 'public')));




// ---------- ส่งข้อมูลไปยังหน้า index.ejs ----------
app.get('/', async (req, res) => {
    res.render('index',{
        title: "Home"
    })
})
// ---------- ส่งข้อมูลไปยังหน้า index-2.ejs ----------
app.get('/sec1' , async (req,res) =>{
    try{
        const result = await pool.query('SELECT s.id , p.prefix , s.first_name ,s.last_name FROM student s JOIN prefix p ON s.prefix_id = p.id  WHERE section_id = $1 ORDER BY s.id ASC',['S01']);
        const students = result.rows;

        res.render('index-2', { 
            students,
            title: "sce1"
         })
    }catch (err){
        console.error(err);
        res.status(500).send('Server error');
    }
})
// ---------- ส่งข้อมูลไปยังหน้า index-3.ejs ----------
app.get('/sec2' , async (req,res) =>{
    try{
        const result = await pool.query('SELECT s.id , p.prefix , s.first_name ,s.last_name FROM student s JOIN prefix p ON s.prefix_id = p.id  WHERE section_id = $1 ORDER BY s.id ASC',['S02']);
        const students = result.rows;

        res.render('index-3', { 
            students,
            title: "sce2"
         })
    }catch (err){
        console.error(err);
        res.status(500).send('Server error');
    }
})

// ---------- ส่งข้อมูลไปยังหน้า index-4.ejs ----------
app.get('/search', (req , res) => {
    res.render('index-4',{
        title: 'Search'
    })
})
// ---------- ส่งข้อมูลไปยังหน้า index-5.ejs ----------
app.get('/dashboard' , (req ,res) => {
    res.render('index-5',{
        title: 'Dashboard'
    })
})
// ---------- ค้นหาวันต่างๆแสดงจำนวน ขาด ลา มา สาย ----------
app.get('/dashboard/:date', async (req, res) => {
    const date = req.params.date;

    try{
        const result = await pool.query(
            `SELECT 
                COUNT(CASE WHEN status = 'มาเรียน' THEN 1 END) AS count_มาเรียน,
                COUNT(CASE WHEN status = 'ขาดเรียน' THEN 1 END) AS count_ขาดเรียน,
                COUNT(CASE WHEN status = 'ลาเรียน' THEN 1 END) AS count_ลาเรียน,
                COUNT(CASE WHEN status = 'มาสาย' THEN 1 END) AS count_มาสาย
            FROM student_list 
            WHERE active_date = $1`,[date]
        )
        res.json(result.rows[0]);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
// ---------- ค้นหาข้อมูล ----------
app.get('/search/data',async (req,res) =>{
    const query = req.query.query; 

    try {
        const results = await pool.query(
            'SELECT s.id , p.prefix , s.first_name , s.last_name FROM student s JOIN prefix p ON s.prefix_id = p.id WHERE s.id ILIKE $1', 
            [`%${query}%`]
        );
        res.json(results.rows);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('เกิดข้อผิดพลาดในการค้นหา');
    }
})
// ---------- แสดงข้อมูลนักเรียนแต่ละคน ----------
app.get('/search/data/:id' , async (req , res) =>{
    const studentId = req.params.id;
    try{
        const result = await pool.query(
            'SELECT s.id , p.prefix , s.first_name , s.last_name ,  TO_CHAR(s.date_of_birth, \'YYYY-MM-DD\') AS date_of_birth , s.sex , c.curr_name_th , c.curr_name_en , se.section , s.previous_school ,s.address , s.telephone , s.email , s.line_id , s.status FROM student s JOIN prefix p ON s.prefix_id = p.id JOIN curriculum c ON s.curriculum_id = c.id JOIN section se ON s.section_id = se.id  WHERE s.id = $1', 
            [studentId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('ไม่พบข้อมูลนักเรียน');
        }
    }catch(error){
        console.error('Error executing query', error.stack);
        res.status(500).send('เกิดข้อผิดพลาดในการแสดงข้อมูลนักเรียน');
    }
})

// ---------- เพิ่มข้อมูล ----------
app.post('/add-data', async (req , res) =>{
    const { date, students } = req.body;
    const values = students.map(student => `('${student.studentID}', '${date}', '${student.status}')`).join(", ");
    const query = `
        INSERT INTO student_list (student_id, active_date, status) 
        VALUES ${values};
    `;
    pool.query(query, (err , result) =>{
        if(err){
            console.error('Database Error:', err);
            return res.status(500).send('Error in saving data');
        }
        res.status(200).send('Data added successfully');
    })
})
// ---------- ลบข้อมูลนักศึกษา ----------
app.delete('/delete/:id', async (req , res) => {
    const studentId = req.params.id;
    try{
        const result = await pool.query('DELETE FROM student WHERE id = $1', [studentId]);
        if (result.rowCount > 0) {
            res.status(200).send('ลบข้อมูลนักเรียนเรียบร้อยแล้ว');
        } else {
            res.status(404).send('ไม่พบข้อมูลนักเรียน');
        }
    }catch(error){
        console.error('Error deleting student:', error.stack);
        res.status(500).send('เกิดข้อผิดพลาดในการลบข้อมูลนักเรียน');
    }
})
// ---------- แก้ไขข้อมูลนักศึกษา ----------
app.put('/update/:id' , async (req , res) => {
    const studentId = req.params.id;
    const { date, sex, pre_school, address, tel, email, line, status } = req.body;
    try{
        const result = await pool.query('UPDATE student SET date_of_birth = $1, sex = $2 , previous_school = $3 , address = $4 , telephone = $5 , email = $6 , line_id = $7 , status = $8 WHERE id = $9 RETURNING *',
            [date, sex, pre_school, address, tel, email, line, status, studentId]
        )
        if (result.rows.length === 0) {
            return res.status(404).send('ไม่พบนักเรียนที่ต้องการอัปเดต');
        }
        res.json(result.rows[0]);
    }catch(error){
        console.error('Error update student:', error.stack);
        res.status(500).send('เกิดข้อผิดพลาดในการอัพเดพข้อมูลนักเรียน');
    }
})


// ---------- download csv-sec1 ----------
app.get('/sec1/csv', async (req , res) =>{
    try{
        const result = await pool.query('SELECT s.id , p.prefix , s.first_name ,s.last_name FROM student s JOIN prefix p ON s.prefix_id = p.id  WHERE section_id = $1 ORDER BY s.id ASC',['S01']);

        const students = result.rows.map((row,index) => ({
            no: index + 1,
            id: row.id,
            first_name: row.first_name,
            last_name: row.last_name
        }));

        const csvWriter = createObjectCsvWriter({
            path: 'files/sec1.csv',
            header: [
                { id: 'no', title: 'ลำดับ' },
                { id: 'id', title: 'รหัสนักศึกษา' },
                { id: 'first_name', title: 'ชื่อ' },
                { id: 'last_name', title: 'นามสกุล' }
            ]
        });
        await csvWriter.writeRecords(students);
        console.log('CSV file was written successfully');
        res.download(path.join(__dirname, 'files/sec1.csv'));
    }catch(error){
        console.error('Error writing CSV file', error);
        res.status(500).send('Error writing CSV file');
    }
})
// ---------- download csv-sec2 ----------
app.get('/sec2/csv', async (req , res) =>{
    try{
        const result = await pool.query('SELECT s.id , p.prefix , s.first_name ,s.last_name FROM student s JOIN prefix p ON s.prefix_id = p.id  WHERE section_id = $1 ORDER BY s.id ASC',['S02']);

        const students = result.rows.map((row,index) => ({
            no: index + 1,
            id: row.id,
            first_name: row.first_name,
            last_name: row.last_name
        }));

        const csvWriter = createObjectCsvWriter({
            path: 'files/sec2.csv',
            header: [
                { id: 'no', title: 'ลำดับ' },
                { id: 'id', title: 'รหัสนักศึกษา' },
                { id: 'first_name', title: 'ชื่อ' },
                { id: 'last_name', title: 'นามสกุล' }
            ]
        });
        await csvWriter.writeRecords(students);
        console.log('CSV file was written successfully');
        res.download(path.join(__dirname, 'files/sec2.csv'));
    }catch(error){
        console.error('Error writing CSV file', error);
        res.status(500).send('Error writing CSV file');
    }
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});