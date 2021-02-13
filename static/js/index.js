var socket = io();

// 접속 되었을 때 설정 
socket.on('connect', () => {
  var name = prompt('반갑습니다!', '');
  if(!name) {
    name = '익명'
  }
  socket.emit('newUser', name);
})

// 상대편에서 메시지를 받았을 때 처리
socket.on('update', (data) => {
  const messageBox = document.querySelector('#message');
  messageBox.innerHTML += `
    <br />
    ${data.name}: ${data.message}
  `
})


// 메시지 보내기 
function send() {
  const testInput = document.querySelector('#test')
  const messageBox = document.querySelector('#message');
  var message = testInput.value;
  testInput.value = '';

  messageBox.innerHTML += `
    <br />
    나 : ${message}
  `
  socket.emit('message', {type:'message', message: message})
}