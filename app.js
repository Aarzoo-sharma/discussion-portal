// if window reloads
document.addEventListener("DOMContentLoaded", reloadDisplay);
// setInterval(reloadDisplay,3000);

// to save data in localstorage
document.getElementById("submit").addEventListener("click", saveData);

//  showing response section and hiding question insertion section
document.querySelector("#question-list").addEventListener("click", checkEvent);

//  checking which respose ans is hited by user
document.querySelector("#respAns").addEventListener("click", checkRespEvent);

// adding response to coresponding question (localStorage)
document.getElementById("submitRes").addEventListener("click", addResponse);

// resolving the response (delete question)
document.getElementById("resolve").addEventListener("click", resolvingQuestion);

// showing question insertion section and hidding response section
document.getElementById("newQues").addEventListener("click", quesSection);

// to search elements
document.getElementById("search").addEventListener("input", searchText);
var id, index;

// sorting
function sorting(obj) {
  obj = obj.sort((a, b) => {
    return b.diff - a.diff;
  });
  obj = obj.sort((a, b) => {
    return b.fav - a.fav;
  });
  return obj;
}
// to save new data in localstorage
function saveData() {
  let subject = document.getElementById("subject").value;
  let quesText = document.getElementById("quesText").value;
  id = Date.now();

  if (subject != "" && quesText != "") {
    let newItem = {
      id: id,
      sub: subject,
      diff: 0,
      up: 0,
      down: 0,
      text: quesText,
      fav: false,
      response: "[]",
    };
    let obj = [];

    if (localStorage.getItem("discussion") == null) {
      //checking discussion variable(key) exist in localhost or not
      // if discussion doesn't exist
      obj.push(newItem);
      localStorage.setItem("discussion", JSON.stringify(obj));
    } else {
      // if discussion exist it retrive data and append and overwrite it to localhost
      obj = JSON.parse(localStorage.getItem("discussion"));
      obj.push(newItem);
      obj = sorting(obj);
      localStorage.setItem("discussion", JSON.stringify(obj));
    }

    // here to add
    let parentElement = document.getElementById("question-list");

    //   adding li(list item)
    let newLiElement = document.createElement("li");
    newLiElement.classList.add("list-item");
    parentElement.appendChild(newLiElement);

    // adding span for fav. icon and ups downs
    let newSpan1 = document.createElement("span");
    newSpan1.classList.add("left");
    newLiElement.appendChild(newSpan1);

    // adding h2 to new span1
    let newH2 = document.createElement("h2");
    newH2.innerText = subject;
    newSpan1.appendChild(newH2);

    // adding p to new span1
    let newP = document.createElement("p");
    newP.innerText = quesText;
    newSpan1.appendChild(newP);

    // adding span (unique id) to every element(span1)
    let newSpan = document.createElement("span");
    newSpan.classList.add("hide");
    newSpan.innerText = id;
    newSpan1.appendChild(newSpan);

    // adding span for fav. icon and ups downs
    let newSpan2 = document.createElement("span");
    newSpan2.classList.add("right");
    newLiElement.appendChild(newSpan2);

    // adding fav icon to span2(fav icon)
    let newI = document.createElement("i");
    newI.classList.add("fa-regular");
    newI.classList.add("fa-lg");
    newI.classList.add("fa-star");
    newSpan2.appendChild(newI);

    // adding up button
    newI = document.createElement("i");
    newI.classList.add("fa-solid");
    newI.classList.add("fa-lg");
    newI.classList.add("fa-circle-up");
    newI.innerText = " 0";
    newSpan2.appendChild(newI);

    // adding down button
    newI = document.createElement("i");
    newI.classList.add("fa-solid");
    newI.classList.add("fa-lg");
    newI.classList.add("fa-circle-down");
    newI.innerText = " 0";
    newSpan2.appendChild(newI);

    newI = document.createElement("span");
    newI.classList.add("time");
    newSpan2.appendChild(newI);

    spann = document.createElement("i");
    spann.innerText = "0";
    newI.appendChild(spann);

    spann = document.createElement("i");
    spann.innerText = "sec ago";
    newI.appendChild(spann);
    setTimeout(reloadDisplay, 1000);

    document.getElementById("subject").value = "";
    document.getElementById("quesText").value = "";
    document.getElementById("subject").focus();
  } else {
    alert("please enter subject and question before submitting");
  }
}

// to check which question/ icon is clicked to check question details
function checkEvent(e) {
  e = e.target;
  if (e.classList.contains("fa-star")) {
    //if user click on fav icon
    favQues(e);
    reloadDisplay();
    return;
  } else if (e.classList.contains("fa-circle-up")) {
    //if user click on up vote icon of question-list
    quesDiff(e, true);
    reloadDisplay();
    return;
  } else if (e.classList.contains("fa-circle-down")) {
    //if user click on down vote icon of question-list
    quesDiff(e, false);
    reloadDisplay();
    return;
  }
  while (!e.classList.contains("list-item")) {
    e = e.parentElement;
  }

  document.getElementById("right-container").style.display = "none";
  document.getElementById("right-container-response").style.display = "flex";
  document.getElementById("name").focus();

  // fetching id no to add response if required
  id = e.children[0].children[2].innerText;
  obj = JSON.parse(localStorage.getItem("discussion"));
  index = obj.findIndex((item) => item.id == id);

  // showing selected question in response question tab
  document.getElementById("respQues").innerHTML = e.innerHTML;
  showResponse();
}

// to mark as fav or unfav.
function favQues(e) {
  if (e.classList.contains("fa-regular")) {
    e.classList.remove("fa-regular");
    e.classList.add("fa-solid");
  } else {
    e.classList.add("fa-regular");
    e.classList.remove("fa-solid");
  }
  id = e.parentElement.parentElement.children[0].children[2].innerText;
  obj = JSON.parse(localStorage.getItem("discussion"));
  index = obj.findIndex((item) => item.id == id);
  // if selected question is opend in response section then show changes of fav if user makes
  if (
    obj[index].id ==
    document.getElementById("respQues").children[0].children[2].innerText
  ) {
    if (obj[index].fav) {
      document
        .getElementById("respQues")
        .children[1].children[0].classList.add("fa-regular");
      document
        .getElementById("respQues")
        .children[1].children[0].classList.remove("fa-solid");
    } else {
      document
        .getElementById("respQues")
        .children[1].children[0].classList.remove("fa-regular");
      document
        .getElementById("respQues")
        .children[1].children[0].classList.add("fa-solid");
    }
  }
  obj[index].fav = !obj[index].fav;
  obj = sorting(obj);
  localStorage.setItem("discussion", JSON.stringify(obj));
  reloadDisplay();
}

// up-down marks of questions-list section
function quesDiff(e,  up_down) {
  id = e.parentElement.parentElement.children[0].children[2].innerText;
  obj = JSON.parse(localStorage.getItem("discussion"));
  index = obj.findIndex((item) => item.id == id);
  if (up_down) obj[index].up = obj[index].up + 1;
  else obj[index].down = obj[index].down + 1;

  obj[index].diff=obj[index].up-obj[index].down;

  obj = sorting(obj);
  localStorage.setItem("discussion", JSON.stringify(obj));
  // if selected question is opend in response section then show changes of fav if user makes
  if (obj[index].id == document.getElementById("respQues").children[0].children[2].innerText)
  {
    document.getElementById("respQues").children[1].children[1].innerText =" " + obj[index].up;
    document.getElementById("respQues").children[1].children[2].innerText =" " + obj[index].down;
  }
}

// to check which updown is clicked to check question details
function checkRespEvent(e) {
  if (e.target.classList.contains("fa-circle-up")) {
    //if user click on up vote icon of response ans list
    respDiff(e,true);
    return;
  } else if (e.target.classList.contains("fa-circle-down")) {
    //if user click on up vote icon of response ans list
    respDiff(e,false);
    return;
  } //if user clicked on response ans list item do nothing
  else {
    return;
  }
}

// up-down marks of response ans list
function respDiff(e, up_down) {
  e = e.target;
  let respId = e.parentElement.parentElement.children[0].children[2].innerText;
  let quesId =
    document.getElementById("respQues").children[0].children[2].innerText;

  let obj = JSON.parse(localStorage.getItem("discussion"));
  let index = obj.findIndex((item) => item.id == quesId);
  let obj1 = JSON.parse(obj[index].response);
  let index1 = obj1.findIndex((item1) => item1.id == respId);
  let obj2 = obj1[index1];

  if (up_down==true) {
    obj2.up = obj2.up + 1;
  } else {
    obj2.down = obj2.down + 1;
  }
  
  obj2.diff= obj2.up-obj2.down;
  obj1[index1] = obj2;
  obj1 = sorting(obj1);
  obj[index].response = JSON.stringify(obj1);
  localStorage.setItem("discussion", JSON.stringify(obj));
  showResponse();
}

// showing corresponding responses of question which is clicked
function showResponse() {
  let obj = [];
  document.getElementById("respAns").innerHTML = null;
  obj = JSON.parse(localStorage.getItem("discussion"));
  obj = JSON.parse(obj[index].response);
  obj.forEach(function (obj1) {
    let parentElement = document.getElementById("respAns");

    //   adding li(list item)
    let newLiElement = document.createElement("li");
    newLiElement.classList.add("list-item");
    newLiElement.classList.add("response");
    newLiElement.style.paddingTop = "0";
    parentElement.appendChild(newLiElement);

    // adding span1 element to response ans division
    let newSpan1 = document.createElement("span");
    newSpan1.classList.add("left");
    newLiElement.appendChild(newSpan1);

    // adding h2 to span1
    let newH2 = document.createElement("h2");
    newH2.innerText = obj1.name;
    newSpan1.appendChild(newH2);

    // adding h2 to span
    let newP = document.createElement("p");
    newP.innerText = obj1.response;
    newSpan1.appendChild(newP);

    // adding span (unique id) to every element(span1)
    let newSpan = document.createElement("span");
    newSpan.classList.add("hide");
    newSpan.innerText = obj1.id;
    newSpan1.appendChild(newSpan);

    // adding span2 to li in response ans divisi
    let newSpan2 = document.createElement("span");
    newSpan2.classList.add("right");
    newSpan2.classList.add("response");
    newLiElement.appendChild(newSpan2);

    // adding up button
    let newI = document.createElement("i");
    newI.classList.add("fa-solid");
    newI.classList.add("fa-lg");
    newI.classList.add("fa-circle-up");
    newI.innerText = " " + obj1.up;
    newSpan2.appendChild(newI);

    // adding down button
    newI = document.createElement("i");
    newI.classList.add("fa-solid");
    newI.classList.add("fa-lg");
    newI.classList.add("fa-circle-down");
    newI.innerText = " " + obj1.down;
    newSpan2.appendChild(newI);

    let nowTime = parseInt(Date.now() - obj1.id);
    let nowTimeEng;

    if (parseInt(nowTime / 31556952000) > 960861) {
      nowTime = parseInt(nowTime / 31556952000);
      nowTimeEng = "year ago";
    } else if (parseInt(nowTime / 2629746000) > 62877) {
      nowTime = parseInt(nowTime / 2629746000);
      nowTimeEng = "month ago";
    } else if (parseInt(nowTime / 604800000) > 8) {
      nowTime = parseInt(nowTime / 604800000);
      nowTimeEng = "week ago";
    } else if (parseInt(nowTime / 86400000) > 0) {
      nowTime = parseInt(nowTime / 86400000);
      nowTimeEng = "day ago";
    } else if (parseInt(nowTime / 3600000) > 0) {
      nowTime = parseInt(nowTime / 3600000);
      nowTimeEng = "hour ago";
    } else if (parseInt(nowTime / 60000) > 0) {
      nowTime = parseInt(nowTime / 60000);
      nowTimeEng = "min ago";
    } else {
      nowTime = parseInt(nowTime / 1000);
      nowTimeEng = "sec ago";
    }
    newI = document.createElement("span");
    newI.classList.add("time");
    newSpan2.appendChild(newI);

    spann = document.createElement("i");
    spann.innerText = nowTime;
    newI.appendChild(spann);

    spann = document.createElement("i");
    spann.innerText = nowTimeEng;
    newI.appendChild(spann);
  });
}

// adding new responsed to coresponding question
function addResponse() {
  let pName = document.getElementById("name").value;
  let ansText = document.getElementById("ansText").value;

  if (pName != "" && ansText != "") {
    let obj = [];
    let id = Date.now();
    let newItem = {
      diff: 0,
      up: 0,
      down: 0,
      id: id,
      name: pName,
      response: ansText,
    };

    obj = JSON.parse(localStorage.getItem("discussion"));

    let obj1 = JSON.parse(obj[index].response);

    obj1.push(newItem);
    obj1 = sorting(obj1);
    obj[index].response = JSON.stringify(obj1);

    localStorage.setItem("discussion", JSON.stringify(obj));

    // appending new response to response list
    let parentElement = document.getElementById("respAns");

    //   adding li(list item)
    let newLiElement = document.createElement("li");
    newLiElement.classList.add("list-item");
    newLiElement.style.paddingTop = "0";
    parentElement.appendChild(newLiElement);

    // adding span1 element to response ans division
    let newSpan1 = document.createElement("span");
    newSpan1.classList.add("left");
    newLiElement.appendChild(newSpan1);

    // adding h2 to span1
    let newH2 = document.createElement("h2");
    newH2.innerText = pName;
    newSpan1.appendChild(newH2);

    // adding h2 to span
    let newP = document.createElement("p");
    newP.innerText = ansText;
    newSpan1.appendChild(newP);

    // adding span (unique id) to every element(span1)
    let newSpan = document.createElement("span");
    newSpan.classList.add("hide");
    newSpan.innerText = id;
    newSpan1.appendChild(newSpan);

    // adding span2 to li in response ans divisi
    let newSpan2 = document.createElement("span");
    newSpan2.classList.add("right");
    newSpan2.classList.add("response");
    newLiElement.appendChild(newSpan2);

    // adding up button
    let newI = document.createElement("i");
    newI.classList.add("fa-solid");
    newI.classList.add("fa-lg");
    newI.classList.add("fa-circle-up");
    newI.innerText = " 0";
    newSpan2.appendChild(newI);

    // adding down button
    newI = document.createElement("i");
    newI.classList.add("fa-solid");
    newI.classList.add("fa-lg");
    newI.classList.add("fa-circle-down");
    newI.innerText = " 0";
    newSpan2.appendChild(newI);

    newI = document.createElement("span");
    newI.classList.add("time");
    newSpan2.appendChild(newI);

    spann = document.createElement("i");
    spann.innerText = "0";
    newI.appendChild(spann);

    spann = document.createElement("i");
    spann.innerText = "sec ago";
    newI.appendChild(spann);
    setTimeout(showResponse, 1000);

    document.getElementById("name").value = "";
    document.getElementById("ansText").value = "";
    document.getElementById("name").focus();
  }
}

// delete particular question which is clicked
function resolvingQuestion() {
  let obj = [];
  obj = JSON.parse(localStorage.getItem("discussion"));
  obj.splice(index, 1);
  localStorage.setItem("discussion", JSON.stringify(obj));
  quesSection();
  searchText();
}

// to search text from saved question
function searchText() {
  let search = document.getElementById("search").value;
  let parentElement = document.getElementById("question-list");
  if (search != "") {
    parentElement.innerHTML = null;
    let obj = [];
    obj = JSON.parse(localStorage.getItem("discussion"));

    let found;
    obj.forEach(function (obj1) {
      index = obj1.sub.toLowerCase().indexOf(search.toLowerCase());
      if (index == -1)
        index = obj1.text.toLowerCase().indexOf(search.toLowerCase());
      if (index != -1) {
        found = true;
        // adding li(list item)
        let newLiElement = document.createElement("li");
        newLiElement.classList.add("list-item");
        parentElement.appendChild(newLiElement);

        // adding span for fav. icon and ups downs
        let newSpan1 = document.createElement("span");
        newSpan1.classList.add("left");
        newLiElement.appendChild(newSpan1);

        // adding h2 to new li
        let newH2 = document.createElement("h2");
        newH2.innerText = obj1.sub;
        newSpan1.appendChild(newH2);

        // adding h2 to new li
        let newP = document.createElement("p");
        newP.innerText = obj1.text;
        newSpan1.appendChild(newP);

        // adding unique id to every element
        let newSpan = document.createElement("span");
        newSpan.classList.add("hide");
        newSpan.innerText = obj1.id;
        newSpan1.appendChild(newSpan);

        // highlighting searched element
        let regEx = new RegExp(search, "ig");
        newH2.innerHTML = newH2.innerHTML.replaceAll(
          regEx,
          '<span style="color:black;background:yellow">' +
            search.toUpperCase() +
            "</span>"
        );
        newP.innerHTML = newP.innerHTML.replaceAll(
          regEx,
          '<span style="color:black;background:yellow">' +
            search.toUpperCase() +
            "</span>"
        );

        // adding span for fav. icon and ups downs
        let newSpan2 = document.createElement("span");
        newSpan2.classList.add("right");
        newLiElement.appendChild(newSpan2);

        // adding fav icon to span2
        let newI = document.createElement("i");
        if (obj1.fav) {
          newI.classList.add("fa-solid");
        } else {
          newI.classList.add("fa-regular");
        }
        newI.classList.add("fa-lg");
        newI.classList.add("fa-star");
        newSpan2.appendChild(newI);

        // adding up button
        newI = document.createElement("i");
        newI.classList.add("fa-solid");
        newI.classList.add("fa-lg");
        newI.classList.add("fa-circle-up");
        newI.innerText = " " + obj1.up;
        newSpan2.appendChild(newI);
        
        // adding down button
        newI = document.createElement("i");
        newI.classList.add("fa-solid");
        newI.classList.add("fa-lg");
        newI.classList.add("fa-circle-down");
        newI.innerText = " " + obj1.down;
        newSpan2.appendChild(newI);
        
        // adding span to show time ago in span2
        let nowTime = parseInt(Date.now() - obj1.id);
        let nowTimeEng;

        if (parseInt(nowTime / 31556952000) > 960861) {
          nowTime = parseInt(nowTime / 31556952000);
          nowTimeEng = "year ago";
        } else if (parseInt(nowTime / 2629746000) > 62877) {
          nowTime = parseInt(nowTime / 2629746000);
          nowTimeEng = "month ago";
        } else if (parseInt(nowTime / 604800000) > 8) {
          nowTime = parseInt(nowTime / 604800000);
          nowTimeEng = "week ago";
        } else if (parseInt(nowTime / 86400000) > 0) {
          nowTime = parseInt(nowTime / 86400000);
          nowTimeEng = "day ago";
        } else if (parseInt(nowTime / 3600000) > 0) {
          nowTime = parseInt(nowTime / 3600000);
          nowTimeEng = "hour ago";
        } else if (parseInt(nowTime / 60000) > 0) {
          nowTime = parseInt(nowTime / 60000);
          nowTimeEng = "min ago";
        } else {
          nowTime = parseInt(nowTime / 1000);
          nowTimeEng = "sec ago";
        }
        newI = document.createElement("span");
        newI.classList.add("time");
        newSpan2.appendChild(newI);

        spann = document.createElement("i");
        spann.innerText = nowTime;
        newI.appendChild(spann);

        spann = document.createElement("i");
        spann.innerText = nowTimeEng;
        newI.appendChild(spann);
      }
    });
    if (!found) {
      // here to add
      let newLiElement = document.createElement("li");
      newLiElement.classList.add("list-item");
      parentElement.appendChild(newLiElement);

      // adding h2 to new li
      let newH2 = document.createElement("h2");
      newH2.innerText = "No match found!";
      newLiElement.appendChild(newH2);
    }
  } else {
    reloadDisplay();
  }
}

// to hide response section and display new question section
function quesSection() {
  document.getElementById("right-container").style.display = "flex";
  document.getElementById("right-container-response").style.display = "none";
  document.getElementById("subject").focus();
  document.getElementById("name").value = "";
  document.getElementById("ansText").value = "";
}

// if page reloads
function reloadDisplay() {
  let objs;
  objs = JSON.parse(localStorage.getItem("discussion"));
  objs = sorting(objs);
  document.getElementById("question-list").innerHTML = null;
  objs.forEach(function (obj) {
    // here to add
    let parentElement = document.getElementById("question-list");

    //   adding li(list item)
    let newLiElement = document.createElement("li");
    newLiElement.classList.add("list-item");
    parentElement.appendChild(newLiElement);

    // adding span to li
    let newSpan1 = document.createElement("span");
    newSpan1.classList.add("left");
    newLiElement.appendChild(newSpan1);

    // adding h2 to new span1
    let newH2 = document.createElement("h2");
    newH2.innerText = obj.sub;
    newSpan1.appendChild(newH2);

    // adding h2 to new span1
    let newP = document.createElement("p");
    newP.innerText = obj.text;
    newSpan1.appendChild(newP);

    // adding unique id to every li element
    let newSpan = document.createElement("span");
    newSpan.classList.add("hide");
    newSpan.innerText = obj.id;
    newSpan1.appendChild(newSpan);

    // adding span for fav. icon and ups downs
    let newSpan2 = document.createElement("span");
    newSpan2.classList.add("right");
    newLiElement.appendChild(newSpan2);

    // adding fav icon to span2
    let newI = document.createElement("i");
    if (obj.fav) {
      newI.classList.add("fa-solid");
    } else {
      newI.classList.add("fa-regular");
    }
    newI.classList.add("fa-lg");
    newI.classList.add("fa-star");
    newSpan2.appendChild(newI);

    // adding up button
    newI = document.createElement("i");
    newI.classList.add("fa-solid");
    newI.classList.add("fa-lg");
    newI.classList.add("fa-circle-up");
    newI.innerText = " " + obj.up;
    newSpan2.appendChild(newI);

    // adding down button
    newI = document.createElement("i");
    newI.classList.add("fa-solid");
    newI.classList.add("fa-lg");
    newI.classList.add("fa-circle-down");
    newI.innerText = " " + obj.down;
    newSpan2.appendChild(newI);

    let nowTime = parseInt(Date.now() - obj.id);
    let nowTimeEng;

    if (parseInt(nowTime / 31556952000) > 960861) {
      nowTime = parseInt(nowTime / 31556952000);
      nowTimeEng = "year ago";
    } else if (parseInt(nowTime / 2629746000) > 62877) {
      nowTime = parseInt(nowTime / 2629746000);
      nowTimeEng = "month ago";
    } else if (parseInt(nowTime / 604800000) > 8) {
      nowTime = parseInt(nowTime / 604800000);
      nowTimeEng = "week ago";
    } else if (parseInt(nowTime / 86400000) > 0) {
      nowTime = parseInt(nowTime / 86400000);
      nowTimeEng = "day ago";
    } else if (parseInt(nowTime / 3600000) > 0) {
      nowTime = parseInt(nowTime / 3600000);
      nowTimeEng = "hour ago";
    } else if (parseInt(nowTime / 60000) > 0) {
      nowTime = parseInt(nowTime / 60000);
      nowTimeEng = "min ago";
    } else {
      nowTime = parseInt(nowTime / 1000);
      nowTimeEng = "sec ago";
    }
    newI = document.createElement("span");
    newI.classList.add("time");
    newSpan2.appendChild(newI);

    spann = document.createElement("i");
    spann.innerText = nowTime;
    newI.appendChild(spann);

    spann = document.createElement("i");
    spann.innerText = nowTimeEng;
    newI.appendChild(spann);
  });
}
setInterval(function () {
  let timeElement = document.getElementsByClassName("time");
  for (let i = 0; i < timeElement.length; i++) {
    nowTime = timeElement[i].children[0].innerText;
    nowTime = Number(nowTime);
    nowTimeEng = timeElement[i].children[1].innerText;

    if (nowTimeEng == "year ago") {
      nowTime = nowTime * 31556952000 + 1000;
    } else if (nowTimeEng == "month ago") {
      nowTime = nowTime * 2629746000 + 1000;
    } else if (nowTimeEng == "week ago") {
      nowTime = nowTime * 604800000 + 1000;
    } else if (nowTimeEng == "day ago") {
      nowTime = nowTime * 86400000 + 1000;
    } else if (nowTimeEng == "hour ago") {
      nowTime = nowTime * 3600000 + 1000;
    } else if (nowTimeEng == "min ago") {
      nowTime = nowTime * 60000 + 1000;
    } else {
      nowTime = nowTime * 1000 + 1000;
    }

    if (parseInt(nowTime / 31556952000) > 960861) {
      nowTime = parseInt(nowTime / 31556952000);
      nowTimeEng = "year ago";
    } else if (parseInt(nowTime / 2629746000) > 62877) {
      nowTime = parseInt(nowTime / 2629746000);
      nowTimeEng = "month ago";
    } else if (parseInt(nowTime / 604800000) > 8) {
      nowTime = parseInt(nowTime / 604800000);
      nowTimeEng = "week ago";
    } else if (parseInt(nowTime / 86400000) > 0) {
      nowTime = parseInt(nowTime / 86400000);
      nowTimeEng = "day ago";
    } else if (parseInt(nowTime / 3600000) > 0) {
      nowTime = parseInt(nowTime / 3600000);
      nowTimeEng = "hour ago";
    } else if (parseInt(nowTime / 60000) > 0) {
      nowTime = parseInt(nowTime / 60000);
      nowTimeEng = "min ago";
    } else {
      nowTime = parseInt(nowTime / 1000);
      nowTimeEng = "sec ago";
    }

    timeElement[i].children[0].innerText = nowTime;
    timeElement[i].children[1].innerText = nowTimeEng;
  }
}, 1000);
