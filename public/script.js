const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

//get username from URL
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})
console.log(username)

const socket = io()

//join chatroom
socket.emit('joinRoom', { username })

//message from server
socket.on('message', (message) => {
  console.log(message)
  outputMessage(message)

  //scrolldown
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//message submission
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  //text input
  const msg = e.target.elements.msg.value

  //emiting message to the server
  socket.emit('chatMessage', msg)

  //clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

//outputting message to dom
let outputMessage = (message) => {
  const messageContainer = document.createElement('div')
  messageContainer.classList.add('message')
  messageContainer.innerHTML = `<p class='meta'>${message.username}: <span>${message.time}</span></p>
   <p id='text'>
      ${message.text}
   </p>`
  document.querySelector('.chat-messages').appendChild(messageContainer)
}
