import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const firebaseConfig = {
  authDomain: "practice-bba4f.firebaseapp.com",
  projectId: "practice-bba4f",
  storageBucket: "practice-bba4f.firebasestorage.app",
  messagingSenderId: "897550923089",
  appId: "1:897550923089:web:ab00f5867dbc128508cf70",
  measurementId: "G-5WTLD6JG4W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
logEvent(analytics, 'notification_received');

let subbtn = document.getElementById("submit")
if (subbtn) {

  subbtn.addEventListener("click", () => {



    let email = document.getElementById("semail").value.trim()
    let password = document.getElementById("spass").value.trim()



    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
        sendEmailVerification(user);
        email = ""
        password = ""
        Swal.fire({
          title: "Signup successful",
          icon: "success",
          draggable: false
        });
        window.location.href = "./log.html";

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        email = ""
        password = ""
        Swal.fire({
          title: "Something went wrong",
          icon: "error",
          draggable: false
        });
        console.log(errorCode, errorMessage)
      });
  })
}

let lbtn = document.getElementById("loginbtn")
if (lbtn) {

  lbtn.addEventListener('click', () => {
    let email = document.getElementById("lemail").value.trim()
    let password = document.getElementById("lpass").value.trim()


    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Swal.fire({
          title: " Login success",
          icon: "success",
          draggable: false
        });
        email = ""
        password = ""
        const user = userCredential.user;
        console.log(`${user.email} login success`)
        location.href = '/dashboard.html'
      })
      .catch((error) => {
        Swal.fire({
          title: "Something went Wrong",
          icon: "error",
          draggable: false
        });
        email = ""
        password = ""
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  })
}



let add = document.getElementById("add-data")
add.addEventListener('click', () => {

  let modal = document.getElementById("modal")
  add.disabled = true
  let show = modal.innerHTML += (`
  <div style = "padding: 30px" >
        <form>
          <div class="mb-3">
            <label for="recipient-name" class="col-form-label">Item Name:</label>
            <input type="text" class="form-control" id="iname">
          </div>
          <div class="mb-3">
            <label for="message-text" class="col-form-label">Item description:</label>
            <input type="text" class="form-control" id="ides">
          </div>
          <div class="mb-3">
            <label for="message-text" class="col-form-label">item price:</label>
            <input type="text" class="form-control" id="iprice">
          </div>
        </form>
            <button id = "adddata" style="color:white ; background-color: blue; border-radius: 20px; height: 50px; type = "submit">Add data</button>
  </div>
      `)


  let addbtn = document.getElementById("adddata")
  addbtn.addEventListener('click', async () => {

    add.disabled = false
    let name = document.getElementById("iname").value
    let des = document.getElementById("ides").value
    let price = document.getElementById("iprice").value
    if (name == "" || des == "" || price == "") {
      Swal.fire({
        title: "Please fill the data",
        text: "",
        icon: "error"
      });
    } else {


      try {
        const docRef = await addDoc(collection(db, "items"), {
          name,
          des,
          price,
        });
        modal.innerHTML = ""

        Swal.fire({
          title: "Done",
          text: "Data has been sent to the server",
          icon: "success"
        });
        console.log("Document written with ID: ", docRef.id);

        readdata()
      }
      catch (e) {
        console.error("Error adding document: ", e);
      }
    }


  })

})
let pdata = document.getElementById("readdata")
let readdata = async () => {
  pdata.innerHTML = ""
  const querySnapshot = await getDocs(collection(db, "items"));
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    pdata.innerHTML += ` <br> <br>
             <center>

             <h2> Items Fetched </h2>

             <h6>
      <li>
        
        <br>
        <b>Name: </b> ${doc.data().name}<br>
        <b>description: </b> ${doc.data().des}<br>
        <b>Price: </b> ${doc.data().price}<br>
        
        
      </li> </center>
      </h6>`

  });
}

readdata()

let lout = document.getElementById("logout")
lout.addEventListener('click', () => {
  location.href = "/log.html"
})


