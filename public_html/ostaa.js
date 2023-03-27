/*
    Name: Prasiddhi Gyawali
    Assignment: PA 8
    Description: This javascript file that takes user action
    from based on the HTML and transforms it into a GET request
    and POST request to display the appropriate chats.
*/

function addUser() {
  // XMLHttpRequest Var
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
      return false;
  }
  // retrieves messages
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
        } else { 
            alert('ERROR'); 
        }
    }
}
  // formats URL for GET request based on input
  //let data = JSON.stringify({'username':u, 'password':p});
  let url = `/add/user/`;
  let u = document.getElementById('username').value;
  let p = document.getElementById('pass').value;

  httpRequest.open('POST', url);
  httpRequest.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  httpRequest.send(JSON.stringify({user:u, pass:p}));
}

function addItem() {
  // XMLHttpRequest Var
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
      return false;
  }
  // POSTS messages
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        //getChat();
        //document.getElementById('messages').innerHTML = httpRequest.responseText;
      } else { 
        alert('ERROR'); 
      }
    }
}
  // formats URL for POST request based on input
  let t = document.getElementById('title').value;
  let d = document.getElementById('desc').value;
  let i = document.getElementById('img').value;
  let p = document.getElementById('price').value;
  let s = document.getElementById('stat').value;
  let u = document.getElementById('sellerUser').value;
  let data = JSON.stringify({'title':t, 'desc':d, 'image':i, 'price':p, 'stat':s});
  let url = '/add/item/' + u;
  httpRequest.open('POST', url);
  httpRequest.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  httpRequest.send(data);
}