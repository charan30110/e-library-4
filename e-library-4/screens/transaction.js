import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,Alert
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as firebase from "firebase";
import db from "../config.js";


const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: "",
      studentId: "",
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false
    };
  }

  getCameraPermissions = async domState => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    const { domState } = this.state;

    if (domState === "bookId") {
      this.setState({
        bookId: data,
        domState: "normal",
        scanned: true
      });
    } else if (domState === "studentId") {
      this.setState({
        studentId: data,
        domState: "normal",
        scanned: true
      });
    }
  };

  handleTransaction=()=>{
    var transactionMessage 
    db.collection("books").doc(this.state.scannedBookId).get()
      .then((doc)=>{
        console.log(doc.data());
        var book = doc.data()
        if(book.bookAvailability){
          this.initiateBookIssue();
          transactionMessage = "Book Issued";
        }
        else{
          this.initiateBookReturn();
          transactionMessage = "Book Return";
        }
      }) 
    this.setState=({
      transactionMessage:transactionMessage
    })
  }

  initiateBookIssue= async()=>{
    db.collection("transaction").add({
      "studentId":this.state.scannedStudentId,
      "bookId":this.state.scannedBookId,
      "date" : firebase.firestore.timeStamp.now().toDate(),
       transactionType : "Issue",
    })
    db.collection("books").doc(this.state.scannedBookId).update({
      "bookAvailability" : false,
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
      "numberofBookIssued" : firebase.firestore.fieldvalue.increment(1),
    })
    Alert.alert("Book Issued")
    this.setState({
      scannedBookId:"",
      scannedStudentId:""
    })
  }

    initiateBookReturn= async()=>{
    db.collection("transaction").add({
      "studentId":this.state.scannedStudentId,
      "bookId":this.state.scannedBookId,
      "date" : firebase.firestore.timeStamp.now().toDate(),
       transactionType : "Returned",
    })
    db.collection("books").doc(this.state.scannedBookId).update({
      "bookAvailability" : true,
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
      "numberofBookIssued" : firebase.firestore.fieldvalue.increment(-1),
    })
    Alert.alert("Book Returned")
    this.setState({
      scannedBookId:"",
      scannedStudentId:""
    })
  }

  render() {
    const { bookId, studentId, domState, scanned } = this.state;
    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={bgImage} style={styles.bgImage}>
          <View style={styles.upperContainer}>
            <Image source={appIcon} style={styles.appIcon} />
            <Image source={appName} style={styles.appName} />
          </View>
          <View style={styles.lowerContainer}>
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textinput}
                placeholder={"Book Id"}
                placeholderTextColor={"#FFFFFF"}
                value={bookId}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermissions("bookId")}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.textinputContainer, { marginTop: 25 }]}>
              <TextInput
                style={styles.textinput}
                placeholder={"Student Id"}
                placeholderTextColor={"#FFFFFF"}
                value={studentId}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermissions("studentId")}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
             style = {[styles.button,{marginTop:25}]}
             onPress={
               this.handleTransaction()
             }>
             <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>


          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 80
  },
  appName: {
    width: 80,
    height: 80,
    resizeMode: "contain"
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center"
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF"
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "Rajdhani_600SemiBold",
    color: "#FFFFFF"
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  scanbuttonText: {
    fontSize: 24,
    color: "#0A0101",
    fontFamily: "Rajdhani_600SemiBold"
  },
  button:{
    width:"43%",
    height:55,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f4ad20',
    borderRadius:15,
  },
  buttonText:{
    fontSize:24,
    color:'#ffffff',
    fontFamily:'Rajdhani_600SemiBold',
  }
});
