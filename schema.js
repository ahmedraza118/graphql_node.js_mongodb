import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLList
  } from 'graphql';
  
import { Student, Teacher } from './models.js';

const StudentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLString },
    grade: { type: GraphQLString },
    teachers: {
      type: new GraphQLList(TeacherType),  // Assuming you have a TeacherType defined
      resolve(parent, args) {
        // Logic to fetch teachers associated with the student
        return Teacher.find({ students: parent.id });
      }
    }
  }),
});

const TeacherType = new GraphQLObjectType({
  name: 'Teacher',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    subject: { type: GraphQLString },
    students: {
      type: new GraphQLList(StudentType),  // Assuming you have a StudentType defined
      resolve(parent, args) {
        // Logic to fetch students associated with the teacher
        return Student.find({ teachers: parent.id });
      }
    }
  }),
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    student: {
      type: StudentType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Student.findById(args.id).populate('teachers').exec();
      },
    },
    students: {
      type: new GraphQLList(StudentType),
      resolve() {
        return Student.find({});
      },
    },
    teacher: {
      type: TeacherType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Teacher.findById(args.id).populate('students').exec();
      },
    },
    teachers: {
      type: new GraphQLList(TeacherType),
      resolve() {
        return Teacher.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addStudent: {
      type: StudentType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLString },
        grade: { type: GraphQLString },
      },
      resolve(parent, args) {
        const student = new Student(args);
        return student.save();
      },
    },
    addTeacher: {
      type: TeacherType,
      args: {
        name: { type: GraphQLString },
        subject: { type: GraphQLString },
      },
      resolve(parent, args) {
        const teacher = new Teacher(args);
        return teacher.save();
      },
    },
    addStudentUnderTeacher: {
      type: TeacherType,
      args: {
        teacherId: { type: GraphQLString },
        studentId: { type: GraphQLString },
      },
      resolve(parent, args) {
        // Logic to associate a student with a teacher
        return Teacher.findByIdAndUpdate(
          args.teacherId,
          { $addToSet: { students: args.studentId } },
          { new: true }
        );
      },
    },

    addTeacherUnderStudent: {
      type: StudentType,
      args: {
        studentId: { type: GraphQLString },
        teacherId: { type: GraphQLString },
      },
      resolve(parent, args) {
        // Logic to associate a teacher with a student
        return Student.findByIdAndUpdate(
          args.studentId,
          { $addToSet: { teachers: args.teacherId } },
          { new: true }
        );
      },
    },

  },
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
  });
  
  export default schema;
