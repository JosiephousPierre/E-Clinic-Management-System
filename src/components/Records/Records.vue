<template>
  <div class="bgImg">
    <div class="container">
      <h1>Records</h1>
      <p>This is the Records page of your application.</p>
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Search records" />
      </div>
      <DataTable
        :value="filteredRecords"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        tableStyle="min-width: 80rem;"
      >
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="Consultation_Id"
          header="Consultation ID"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="student_Id"
          header="Student ID"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="student_Lname"
          header="Last Name"
          sortable
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="student_Fname"
          header="First Name"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="course"
          header="Course"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="illness"
          header="Symptom"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="medicine"
          header="Medicine"
        ></Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="date"
          header="Date"
        >
          <template #body="consultation">{{
            consultation.data.date ? formatDate(consultation.data.date) : ""
          }}</template>
        </Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="time_In"
          header="Time In"
        >
          <template #body="consultation">{{
            consultation.data.time_In
              ? formatTime(consultation.data.time_In)
              : ""
          }}</template>
        </Column>
        <Column
          headerStyle="background-color: #FF6EC7; color:white"
          field="check_Out"
          header="Check-Out"
        >
          <template #body="consultation">{{
            consultation.data.check_Out
              ? formatTime(consultation.data.check_Out)
              : ""
          }}</template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref, computed, onMounted } from "vue";
import axiosClient from "../../utils/axiosClient";
import { formatDate, formatTime } from "../../helpers/formatter";

const searchQuery = ref("");

/** For fetching records */
const records = ref([]);
const isLoading = ref(false);
const fetchRecords = async () => {
  isLoading.value = true;
  axiosClient
    .get("/consult/")
    .then(({ data }) => {
      records.value = data;
      console.log(records.value);
    })
    .catch((error) => {
      console.error("Error fetching records:", error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
onMounted(fetchRecords);

const filteredRecords = computed(() => {
  return records.value.filter((record) => {
    const fullName =
      record.student_Fname.toLowerCase() +
      " " +
      record.student_Lname.toLowerCase();
    return fullName.includes(searchQuery.value.toLowerCase());
  });
});
</script>

<style scoped>
.bgImg {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: top;
  height: 100vh;
  background-image: url("../assets/UIC.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 20px;
}
.container {
  width: 95%;
  height: max-content;
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.5);
  padding: 10px 30px 20px 10px;
  border-radius: 5px;
  margin-top: 20px;
}
.records {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}

.search-container {
  margin-bottom: 20px;
}

input[type="text"] {
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.p-datatable {
  margin-top: 20px;
}
</style>
