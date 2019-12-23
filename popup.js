$(document).ready(function () {
  if (localStorage.getItem("accessToken")) {
    $('#loginDiv').hide();
    $('#logoutBtn').show();
    if (localStorage.getItem("annotationUserName")) {
      $('#userNameForH4Element').html(localStorage.getItem("annotationUserName"));
    }
  } else {
    $('#loginDiv').show();
    $('#logoutBtn').hide();
    $('#userNameForH4Element').html("anonym");

  }
  document.getElementsByTagName("html")[0].style.visibility = "visible";
});

var msgObj = ""

$(function () {
  $("#publicAnnotationsCheck").click(() => {
    if ($("#publicAnnotationsCheck").prop("checked") == true) {
      localStorage.setItem("getPublicAnnotations", true);
    }

    if ($("#publicAnnotationsCheck").prop("checked") == false) {
      localStorage.setItem("getPublicAnnotations", false);
    }

  });

  $('#loginBtn').click(() => {
    const userName = $('#username').val();
    const userPassword = $('#password').val();
    $.ajax({
      url: "https://happy-annotation-server.herokuapp.com/extLogin",
      // url: "http://localhost:3000/extLogin",
      type: 'post',
      dataType: 'json',
      data: {
        "username": userName,
        "password": userPassword
      },
      success: function (dataReturned) {
        if (dataReturned.message === "Incorrect password") {
          alert("Incorrect password");
        } else {
          const accessTokenValue = dataReturned.accessToken;
          localStorage.setItem("accessToken", accessTokenValue);
          const annotationUserName = dataReturned.username;
          localStorage.setItem("annotationUserName", annotationUserName);
          const annotationUserId = dataReturned.userid;
          localStorage.setItem("annotationUserId", annotationUserId);
          const annotationUserEmail = dataReturned.email;
          localStorage.setItem("annotationUserEmail", annotationUserEmail);
          localStorage.setItem("getPublicAnnotations", false);
          $('#userNameForH4Element').html(annotationUserName);
          $('#loginDiv').hide();
          $('#logoutBtn').show();
          alert("Welcome " + annotationUserName + "!");
        }
      }
    });
  });

  $('#getAnnotations').click(() => {
    if (localStorage.getItem("annotationUserEmail")) {
      $.ajax({
        url: "https://happy-annotation-server.herokuapp.com/extGetPosts",
        // url: "http://localhost:3000/extGetPosts",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          if (typeof localStorage.getItem("getPublicAnnotations") === "undefined") {
            localStorage.setItem("getPublicAnnotations", false);
            $("#publicAnnotationsCheck").prop("checked", false);
          }

          if (localStorage.getItem("getPublicAnnotations") == 'false') {
            data = data.filter(post => post.userEmail === localStorage.getItem("annotationUserEmail"));
          }

          chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, { annotations: data, action: "getData" });
            });
          });
        },
        headers: { "Authorization": 'Bearer ' + localStorage.getItem("accessToken") }
      });
    } else {
      alert("To get your annotations, please login first");
      // $.ajax({
      //   url: "https://happy-annotation-server.herokuapp.com/extGetPosts",
      //   type: 'GET',
      //   dataType: 'json',
      //   success: function (data) {
      //     if (typeof localStorage.getItem("getPublicAnnotations") === "undefined") {
      //       $("#publicAnnotationsCheck").prop("checked");
      //       localStorage.setItem("getPublicAnnotations", true);
      //     }

      //     if (localStorage.getItem("getPublicAnnotations") == 'false') {
      //       data = data.filter(post => post.userEmail === localStorage.getItem("annotationUserEmail"));
      //     } else {
      //       data = data.filter(post => post.userEmail === "NA");
      //     }



      //     chrome.tabs.query({}, tabs => {
      //       tabs.forEach(tab => {
      //         chrome.tabs.sendMessage(tab.id, { annotations: data, action: "getData" });
      //       });
      //     });
      //   },
      //   headers: { "Authorization": 'Bearer ' + localStorage.getItem("accessToken") }
      // });
    }
  });

  $('#hideData').click(() => {
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        console.log("test");
        chrome.tabs.sendMessage(tab.id, { action: "hideData" });
      });
    });
  });

  $("#logoutBtn").click(() => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("annotationUserName");
      localStorage.removeItem("annotationUserId");
      localStorage.removeItem("annotationUserEmail");
    } catch (error) {
      localStorage.clear();
    }
    localStorage.setItem("getPublicAnnotations", false);
    $("#publicAnnotationsCheck").prop("checked", false);
    $('#userNameForH4Element').html("anonym");
    $('#loginDiv').show();
    $('#logoutBtn').hide();
  });

  $('#registerBtn').click(() => {
    // Messaging 1
    chrome.runtime.sendMessage({ action: "NewTab" }, function (response) {
      console.log("NewTab message: " + response.message);
    });
  });
});