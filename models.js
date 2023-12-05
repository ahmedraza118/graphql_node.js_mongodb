import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
});

const teacherSchema = new mongoose.Schema({
  name: String,
  subject: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);

export { Student, Teacher };
