document.addEventListener('DOMContentLoaded', function () {

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

      .then(() => load_mailbox('sent'));



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


        element.innerHTML = `<div class="card " >
      <div class="card-body >
        <h5 class="card-title">Subject:${email.subject}</h5>
        <h6 class="card-subtitle  text-muted">From: ${email.sender}</h6>
        <hr>
        <p class="card-text">${email.body}</p>
        <p class="card-text">${email.timestamp}</p>
      
      </div>
      
    </div>
    <br>`;



        let showArchive = true;
        let readStatus = email.read;

        if (mailbox === 'sent') {
          showArchive = false; // Hide the archive button
          readStatus = false; // Mark all sent emails as unread
        }

        if (readStatus) {
          element.querySelector('.card').classList.add('read'); // set background color to grey

        }

        if (showArchive) {
          const archiveButton = document.createElement('button');
          archiveButton.className = "btn btn-primary";
          archiveButton.innerText = email.archived ? "Unarchive" : "Archive";

          // Add event listener to the button
          archiveButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from bubbling up to the email element
            fetch(`/emails/${email.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                archived: !email.archived
              })
            })
              .then(() => load_mailbox('inbox'));
          });

          // Append the button to the email element
          element.querySelector('.card-body').append(archiveButton);
        }


        // view email when clicking an email
        element.addEventListener('click', () => {
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#email-view').style.display = 'block';
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
              document.querySelector('#email-view').innerHTML = '';

              document.querySelector('#email-view').append(element);
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
        document.querySelector('#email-view').style.display = 'none';
        document.querySelector('#emails-view').append(element); // add to emails-view div
      });
    })

} 