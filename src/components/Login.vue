<template>
  <div class="login-container">

      <div class="login-box">
        <img src="../pictures/uic.png" alt="" />
        <div>
        <h1>WELCOME USER</h1>
          <div class="inputs">        
          <label for="username">Username</label>
          <InputText class="input-text" id="username" v-model="id" placeholder="ID e.g. '1234'" />
          </div>
          <div class="inputs">
          <label for="password">Password</label>
          <Password class="password" v-model="password" inputId="password" placeholder="Password" toggleMask :feedback="false" @keyup.enter="validate"/>
          </div>
          <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        </div>

        <Button class="login-button" id="login-b" type="button" label="Log in" icon="pi pi-sign-in" @click="validate" /> 
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import router from '../router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { users } from "../db/dummy_data.js";  


const id = ref('');
const password = ref('');
const errorMessage = ref('');


const validate = () => {
if (id.value === '' || password.value === '') {
  // Replace useToast with an alternative from Vue
  errorMessage.value = 'Provide username or password!';
} else {
  const userList = localStorage.getItem('user');
  const user = JSON.parse(userList);
  const userData = user?.filter(user => user.id === id.value);
  const isAuthenticated = userData.find((user) => user.id === id.value && user.password === password.value);
  if (isAuthenticated) {
    // Replace useToast with an alternative from Vue
    //errorMessage.value = 'Login successful!';
    alert('Login successful!');
    router.push("/home");
  } else {
    // Replace useToast with an alternative from Vue
    errorMessage.value = 'Invalid username or password!';
    //alert('Invalid credentials!');
  }
}
};



</script>



<style scoped>

.login-container {
display: flex;
position:relative;
justify-content: center;
align-items: center;
height: 100vh;
background-image: url('../assets/UIC.jpg');
background-position: center;
background-repeat: no-repeat;
background-size: cover;
}

.login-box {
display: flex;
height: max-content;
position:relative;
flex-direction: column;
align-items: center;
justify-content: center;
background-color:#FF6EC7;
padding: 50px;
border: 2px solid #333; /* Adjust border color */
border-radius: 10px;
box-shadow: 0px 0px 10px 0px #aaa;
}

.login-box img{
position:absolute;
width: 100px;
border-radius:50%;
z-index:99;
top: -50px;
margin-bottom: 20px; 
}
.login-box div h1{
margin:0;
margin-bottom: 40px;
  color:white;
}
.inputs{
 display:flex;
 align-items:center;
 flex-direction:column;
 gap:6px;
 margin-bottom:5px;
}
.inputs label{
font-weight:bold;

}
.input-text {
width: 90%
}

.password {
width:max-content;

}

.login-button {
width: 150px;
font-weight: bold;
margin-top:15px;
}
.login-button .pi {
font-size: 16px; /* Adjust icon size */
margin-right: 5px; /* Add margin between icon and text */
}
.error-message {
  color: red; /* Set text color to white */
  text-shadow: 0 0 1px black; /* Apply red text shadow */
  padding: 5px; /* Add padding for better readability */
}


</style>
