export const isObjectInArray = (array, obj) => {
  for (let i = 0; i < array.length; i++) {
    if (JSON.stringify(array[i]) === JSON.stringify(obj)) {
      return true;
    }
  }
  return false;
};

export const isStudentInConsultationList = (array, obj) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].student_Id === obj.student_Id) {
      return true;
    }
  }
  return false;
};
