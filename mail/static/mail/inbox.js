document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  //send email
  document.querySelector('#compose-form').addEventListener('submit', (event) => {
    event.preventDefault();
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
   
    .then( () => load_mailbox('sent'));






    
    
   
  });

}

function load_mailbox(mailbox) {

  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    emails.forEach(email => {
      const element = document.createElement('div');
    //  element.style.backgroundColor = email.read ? 'lightgrey' : 'white';
    // style=" ${email.read ? 'background-color:lightgrey;': 'background-color:white;'}"
      
      element.innerHTML = `<div class="card " style=" ${email.read ? 'background-color:lightgrey;': 'background-color:white;'}">
      <div class="card-body >
        <h5 class="card-title">Subject:${email.subject}</h5>
        <h6 class="card-subtitle  text-muted">From: ${email.sender}</h6>
        <hr>
        <p class="card-text">${email.body}</p>
        <p class="card-text">${email.timestamp}</p>
      </div>
      
    </div>
    <br>
`;
 
    // view email when clicking an email
    element.addEventListener('click', () => {
      fetch(`/emails/${email.id}`)
      .then(response => response.json())
      .then(email => {


        const element = document.createElement('div');

        element.innerHTML = `<div class="card">
        <div class="card-body">
          <h5 class="card-title">Subject: ${email.subject}</h5>
          <h6 class="card-subtitle mb-2 text-muted">From: ${email.sender}</h6>
          <h6 class="card-subtitle mb-2 text-muted">To: ${email.recipients}</h6>
          <p class="card-text">${email.body}</p>
          <p class="card-text">Sent: ${email.timestamp}</p>
        </div>
      </div>`;
      document.querySelector('#emails-view').innerHTML = '';

      document.querySelector('#emails-view').append(element);
      });
    });

    // mark as read when clicking an email    
    element.addEventListener('click', () => {
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })
    })
    document.querySelector('#emails-view').append(element); // add to emails-view div
    });
  })
  
}