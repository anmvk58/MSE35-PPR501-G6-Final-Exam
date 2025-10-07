from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from models import StudentCreate, StudentUpdate, StudentResponse
from database import db

# Khởi tạo FastAPI app
app = FastAPI(
    title="Student Management API",
    description="API quản lý sinh viên với FastAPI và Pandas",
    version="1.0.0"
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên chỉ định cụ thể domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    """Endpoint gốc"""
    return {
        "message": "Student Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/students", response_model=List[StudentResponse])
def get_all_students(
    skip: int = Query(0, ge=0, description="Số record bỏ qua"),
    limit: int = Query(100, ge=1, le=1000, description="Số record tối đa"),
    search: Optional[str] = Query(None, description="Từ khóa tìm kiếm")
):
    """
    Lấy danh sách tất cả sinh viên
    - **skip**: Số record bỏ qua (pagination)
    - **limit**: Số record tối đa trả về
    - **search**: Tìm kiếm theo mã SV, họ tên, email, quê quán
    """
    if search:
        return db.search_students(search)
    return db.get_all_students(skip=skip, limit=limit)

@app.get("/api/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int):
    """
    Lấy thông tin chi tiết một sinh viên theo ID
    """
    student = db.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Không tìm thấy sinh viên")
    return student

@app.get("/api/students/ma-so/{ma_so_sv}", response_model=StudentResponse)
def get_student_by_ma_so(ma_so_sv: str):
    """
    Lấy thông tin chi tiết một sinh viên theo mã số SV
    """
    student = db.get_student_by_ma_so(ma_so_sv)
    if not student:
        raise HTTPException(status_code=404, detail="Không tìm thấy sinh viên")
    return student

@app.post("/api/students", response_model=StudentResponse, status_code=201)
def create_student(student: StudentCreate):
    """
    Tạo mới một sinh viên
    """
    # Kiểm tra mã số sinh viên đã tồn tại chưa
    existing = db.get_student_by_ma_so(student.ma_so_sv)
    if existing:
        raise HTTPException(
            status_code=400, 
            detail=f"Mã số sinh viên {student.ma_so_sv} đã tồn tại"
        )
    
    return db.create_student(student)

@app.put("/api/students/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, student_update: StudentUpdate):
    """
    Cập nhật thông tin sinh viên
    """
    # Kiểm tra nếu cập nhật mã số SV thì không được trùng
    if student_update.ma_so_sv:
        existing = db.get_student_by_ma_so(student_update.ma_so_sv)
        if existing and existing.id != student_id:
            raise HTTPException(
                status_code=400,
                detail=f"Mã số sinh viên {student_update.ma_so_sv} đã tồn tại"
            )
    
    updated_student = db.update_student(student_id, student_update)
    if not updated_student:
        raise HTTPException(status_code=404, detail="Không tìm thấy sinh viên")
    return updated_student

@app.delete("/api/students/{student_id}")
def delete_student(student_id: int):
    """
    Xóa sinh viên
    """
    success = db.delete_student(student_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy sinh viên")
    return {"message": "Xóa sinh viên thành công", "student_id": student_id}

@app.get("/api/statistics")
def get_statistics():
    """
    Lấy thống kê tổng quan
    """
    return db.get_statistics()

@app.post("/api/students/batch", response_model=List[StudentResponse])
def create_batch_students(students: List[StudentCreate]):
    """
    Tạo nhiều sinh viên cùng lúc
    """
    created_students = []
    errors = []
    
    for idx, student in enumerate(students):
        try:
            # Kiểm tra mã số sinh viên
            existing = db.get_student_by_ma_so(student.ma_so_sv)
            if existing:
                errors.append({
                    "index": idx,
                    "ma_so_sv": student.ma_so_sv,
                    "error": "Mã số sinh viên đã tồn tại"
                })
                continue
            
            created = db.create_student(student)
            created_students.append(created)
        except Exception as e:
            errors.append({
                "index": idx,
                "ma_so_sv": student.ma_so_sv,
                "error": str(e)
            })
    
    if errors:
        return {
            "created": created_students,
            "errors": errors,
            "message": f"Tạo thành công {len(created_students)}/{len(students)} sinh viên"
        }
    
    return created_students

# Chạy app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)