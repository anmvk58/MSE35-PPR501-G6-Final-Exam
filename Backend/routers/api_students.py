from datetime import date
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from starlette import status

from models import Students
from services.auth_service import get_current_user

router = APIRouter(
    prefix='/students',
    tags=['api-students']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


class CreateStudentRequest(BaseModel):
    student_code: str
    first_name: str
    last_name: str
    email: str
    birth_date: date
    hometown: str
    math_score: float
    literature_score: float
    english_score: float


class UpdateStudentRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    birth_date: date
    hometown: str
    math_score: float
    literature_score: float
    english_score: float


### Endpoints ###
# Define apis below

# Api for create new student
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_student(user: user_dependency, db: db_dependency, create_student_request: CreateStudentRequest):
    # Authen
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Authentication Failed')

    # Author
    if user.get("role") not in ['MANAGER', 'ADMIN']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Authorization Failed, Only for MANAGER roles')

    try:
        create_student_model = Students(
            student_code=create_student_request.student_code,
            first_name=create_student_request.first_name,
            last_name=create_student_request.last_name,
            email=create_student_request.email,
            birth_date=create_student_request.birth_date,
            hometown=create_student_request.hometown,
            math_score=create_student_request.math_score,
            literature_score=create_student_request.literature_score,
            english_score=create_student_request.english_score
        )

        db.add(create_student_model)
        db.commit()

        return {
            'error': '',
            'message': 'Create student successfully !'
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Lỗi server: {str(e)}")


# Api for get all Student
@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_students(user: user_dependency, db: db_dependency):
    # Authen
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Authentication Failed')

    # Author
    if user.get("role") not in ['MANAGER', 'ADMIN']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Authorization Failed, Only for MANAGER roles')

    try:
        student_model = db.query(Students).all()

        return {
            'error': '',
            'message': 'Get students data successfully !',
            'data': student_model
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Lỗi server: {str(e)}")


# Api for get exactly a Student
@router.get("/{student_code}", status_code=status.HTTP_200_OK)
async def get_student_by_code(user: user_dependency, db: db_dependency, student_code: str):
    # Authen
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Authentication Failed')

    # Author
    if user.get("role") not in ['MANAGER', 'ADMIN']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Authorization Failed, Only for MANAGER roles')

    try:
        student_model = db.query(Students).filter(Students.student_code == student_code).first()

        if student_model:
            return {
                'error': '',
                'message': 'Get student data successfully !',
                'data': student_model
            }
        else:
            return {
                'error': '',
                'message': 'No student found',
                'data': None
            }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Lỗi server: {str(e)}")


# Api for modify a Student
@router.put("/{student_code}", status_code=status.HTTP_200_OK)
async def edit_student_by_code(user: user_dependency, db: db_dependency, student_code: str,
                               update_student_request: UpdateStudentRequest):
    # Authen
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Authentication Failed')

    # Author
    if user.get("role") not in ['MANAGER', 'ADMIN']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Authorization Failed, Only for MANAGER roles')

    try:
        student_model: Students = db.query(Students).filter(Students.student_code == student_code).first()
        if student_model is None:
            raise HTTPException(status_code=404, detail='Student not found.')

        student_model.first_name=update_student_request.first_name
        student_model.last_name=update_student_request.last_name
        student_model.email=update_student_request.email
        student_model.birth_date=update_student_request.birth_date
        student_model.hometown=update_student_request.hometown
        student_model.math_score=update_student_request.math_score
        student_model.literature_score=update_student_request.literature_score
        student_model.english_score=update_student_request.english_score

        db.add(student_model)
        db.commit()
        return {
            'error': '',
            'message': f'Student {student_code} update successfully',
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Lỗi server: {str(e)}")


# Api for delete a Student
@router.delete("/{student_code}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student_by_code(user: user_dependency, db: db_dependency, student_code: str):
    # Authen
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Authentication Failed')

    # Author
    if user.get("role") not in ['MANAGER', 'ADMIN']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Authorization Failed, Only for MANAGER roles')

    try:
        student_model: Students = db.query(Students).filter(Students.student_code == student_code).first()
        if student_model is None:
            raise HTTPException(status_code=404, detail='Student not found.')

        db.delete(student_model)
        db.commit()

        return None

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Lỗi server: {str(e)}")