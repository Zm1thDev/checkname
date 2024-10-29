


// -------------- adddata --------------
function AddData(){
    const studentsform = document.getElementById('students-form');

  studentsform.addEventListener('submit', async (e) =>{
    e.preventDefault();

    const date = document.getElementById('date').value;

    if (!date) {
        alert('กรุณากรอกวันที่');
        return; 
    }

    const rows = document.querySelectorAll('tbody tr');
    const radioData = [];

    let allRadio = true;

    rows.forEach((row) => {
        const studentID = row.cells[1].textContent;
        const status = row.querySelector(`input[name="radio-${studentID}"]:checked`);

        if(status){
            radioData.push({
                studentID: studentID,
                status: status.value
            });
        }else{
            allRadio = false;
        }
    })

    if (!allRadio) {
        alert('กรุณาเลือกสถานะการเข้าเรียนให้ครบทุกคน');
        return; 
    }

    const data = {
        date: date,
        students: radioData
    }

    const confirmSubmit = confirm('ต้องการบันทึกข้อมูลหรือไม่ ?');
    if (!confirmSubmit) {
        return; 
    }
    console.log(data);
    try {
        const response = await fetch('/add-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('บันทึกข้อมูลสำเร็จ');

            studentsform.reset();
            rows.forEach((row) => {
                const studentID = row.cells[1].textContent;
                const radio = row.querySelectorAll(`input[name="radio-${studentID}"]`);
                radio.forEach(radio => radio.checked = false);
            });
        } else {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('การเชื่อมต่อกับเซิร์ฟเวอร์ล้มเหลว');
    }
  },{ once: true })
}

// -------------- active links --------------
function Active(){
    const path = window.location.pathname;
    const links = document.querySelectorAll('.mynav .tablinks');

    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === path) {
            links[i].classList.add('active');
        } else {
            links[i].classList.remove('active');
        }
    }
}
document.addEventListener('DOMContentLoaded', Active);



 // -------------- ค้นหาข้อมูล --------------
 async function Search() {
    const input = document.getElementById('search-input').value; // ดึงค่าจาก input

    if (!input) {
        alert('กรุณาป้อนรหัสนักศึกษา');
        return;
    }
    try {
        console.log('กำลังค้นหา:', input);
        const response = await fetch(`/search/data?query=${encodeURIComponent(input)}`); // ส่งคำค้นหาไปยังเซิร์ฟเวอร์

        if (response.ok) {
            const results = await response.json();
            Results(results);
        } else {
            alert('เกิดข้อผิดพลาดในการค้นหา');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
}

// -------------- แสดงการโชว์ข้อมูล --------------
function Results(results) {
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = ''; 

    if (results.length === 0) {
        alert('ไม่พบข้อมูลที่ค้นหา');
        return;
    }

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.innerHTML = `
            <div class="row mb-2">
                <div class="col">
                    <div class="border border-2 border-secondary-subtle bg-white rounded py-2 px-4 d-flex justify-content-between align-items-center">
                        <div class="re-student d-flex">
                            <span class="pe-4">${item.id}</span>
                            <span class="pe-2">${item.prefix}${item.first_name}</span>
                            <span>${item.last_name}</span>
                        </div>
                        <div>
                            <a href="" class="px-2 py-1 btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="showStudentDetails('${item.id}')">ดูข้อมูล</a>
                        </div>
                    </div>           
                </div>
            </div>
        `;
        resultsDiv.appendChild(resultItem);
    });
    console.log(results);
}
document.getElementById('search-button').addEventListener('click', Search);

// -------------- แสดงการโชว์ข้อมูลนักเรียนแต่ละคน --------------
async function showStudentDetails(studentId) {
    try {
        const response = await fetch(`/search/data/${studentId}`);
        if (response.ok) {
            const student = await response.json();
            document.getElementById('exampleModalLabel').innerText = `ข้อมูลนักศึกษา : ${student.id}`;
            document.querySelector('#exampleModal .modal-body').innerHTML = `
                <img class="mx-auto d-block" src="/image/student.png" alt="" style="width: 40%;">
                <hr>
                <div class="modal-info px-4">
                    <div>
                        <p><span>ชื่อ : </span>${student.prefix}${student.first_name} ${student.last_name}</p>
                        <p><span>เกิดวันที่ : </span>${student.date_of_birth}</p>
                        <p><span>เพศ : </span>${student.sex}</p>
                        <p><span>โรงเรียนเดิม : </span>${student.previous_school}</p>
                    </div>
                    <div>
                        <p><span>สาขาวิชา : </span>${student.curr_name_th}<br>(${student.curr_name_en})</p>
                        <p><span>กลุ่มเรียน : </span>${student.section}</p>
                        <p><span>ที่อยู่ : </span>${student.address}</p>
                    </div>
                    <div>
                        <p><span>เบอร์โทรศัพท์ : </span>${student.telephone}</p>
                        <p><span>อีเมล : </span>${student.email}</p>
                        <p><span>ไอดีไลน์ : </span>${student.line_id}</p>
                        <p><span>สถานะ : </span>${student.status}</p>
                    </div>
                </div>
            `;
            document.querySelector('#exampleModal .modal-footer').innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                    <button type="button" class="btn btn-warning" onclick="updatestudent('${student.id}', '${student.date_of_birth}', '${student.sex}', '${student.previous_school}', '${student.address}', '${student.telephone}', '${student.email}', '${student.line_id}', '${student.status}')">แก้ไข</button>
                    <button type="button" class="btn btn-danger" onclick="deletestudent('${student.id}')">ลบ</button>
            `
            console.log(student)
        } else {
            alert('เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
}

// ---------- ลบข้อมูลนักเรียนแต่ละคน ---------
async function deletestudent(studentId) {
    console.log(`รหัสนักศึกที่จะถูกลบ ${studentId}`);
    if(!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนักเรียนคนนี้ ?")){
        return;
    }
    try{
        const response = await fetch(`/delete/${studentId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('ลบข้อมูลนักเรียนเรียบร้อยแล้ว');
            const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
            modal.hide();
            await Search();
        } else {
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    }catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
}

// ---------- อัพเดพข้อมูลนักเรียนแต่ละคน ---------
async function updatestudent(id,date,sex,pre_school,address,tel,email,line,status) {
    if(!confirm("คุณแน่ใจหรือไม่ว่าต้องการแก้ไขข้อมูลนักเรียนคนนี้ ?")){
        return;
    }
    const newdate = prompt('วันเกิด : ', date)
    const newsex = prompt('เพศ : ', sex)
    const newpre_school = prompt('โรงเรียนเดิม : ',pre_school)
    const newaddress = prompt('ที่อยู่ : ',address)
    const newtel = prompt('เบอร์โทรศัพท์ : ',tel)
    const newemail = prompt('อีเมล : ',email)
    const newline = prompt('ไอดีไลน์ : ',line)
    const newstatus = prompt('สถานะ : ',status)
    
    try{
        const response = await fetch(`/update/${id}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: newdate , 
                                   sex: newsex , 
                                   pre_school: newpre_school ,
                                   address: newaddress , 
                                   tel: newtel , 
                                   email: newemail , 
                                   line:newline ,
                                   status: newstatus
             })
        })
    
        if(response.ok){
            alert('อัปเดตข้อมูลนักเรียนเรียบร้อยแล้ว');
            await showStudentDetails(id);
        }else{
            alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
        }
    }catch(error){
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }

}

async function showstatus() {
    const date = document.getElementById('dash-date').value;
    
    try {
        const response = await fetch(`/dashboard/${date}`);
        const data = await response.json();

        console.log(data)

        document.getElementById('card-มาเรียน').innerHTML = `
        <h5 class="card-title">จำนวน</h5>
        <h1>${data.count_มาเรียน} คน</h1>
        <h5 class="card-title">ต่อวัน</h5>`;

        document.getElementById('card-ขาดเรียน').innerHTML = `
        <h5 class="card-title">จำนวน</h5>
        <h1>${data.count_ขาดเรียน} คน</h1>
        <h5 class="card-title">ต่อวัน</h5>`;

    document.getElementById('card-ลาเรียน').innerHTML = `
        <h5 class="card-title">จำนวน</h5>
        <h1>${data.count_ลาเรียน} คน</h1>
        <h5 class="card-title">ต่อวัน</h5>`;

    document.getElementById('card-มาสาย').innerHTML = `
        <h5 class="card-title">จำนวน</h5>
        <h1>${data.count_มาสาย} คน</h1>
        <h5 class="card-title">ต่อวัน</h5>`;

    } catch (error) {
        console.error('Error fetching status data:', error);
    }
}
