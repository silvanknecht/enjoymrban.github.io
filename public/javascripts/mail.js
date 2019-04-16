const contactFormButton = document.getElementById("contactFormButton");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactMessage = document.getElementById("contactMessage");
const modal = document.getElementById('captchaModal');
// const modalClose = document.getElementsByClassName("close")[0];

function formFeedback(isValid) {
    let classToSet;
    switch (isValid) {
        case true:
            classToSet = "formSuccess";
            break;
        case false:
            classToSet = "formFail";
    }
    document.querySelector('button').className = classToSet;
    let elm = document.querySelector('button');
    let newone = elm.cloneNode(true);
    elm.parentNode.replaceChild(newone, elm);
}



// When the user clicks on the button, open the modal
function openCaptchaModal() {
    if (!contactForm.checkValidity || contactForm.checkValidity()) {
        modal.style.display = "block";
    }
    // when not filled in correctly trigger HTML5 validation report
    contactForm.reportValidity();

}

// when the user clicks on <modalClose> (x), close the modal
// modalClose.onclick = function () {
//     modal.style.display = "none";
// }

// when the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// when the user solves the captcha send the form-data to the server
function recaptcha_callback(token) {
    sendForm(token);
}

// function to send the form-data to the server
function sendForm(token) {

    // collecting all the data in the form
    let formValues = Object.values(contactForm).reduce((obj, field) => {
        if (field.name !== "contactFormButton" && field.name !== "g-recaptcha-response") {
            obj[field.name] = field.value;
        }
        return obj;
    }, {});

    // add the token to the form-data
    formValues.token = token

    fetch(url + 'mail', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        }).then(res => {
            return res.json();
        }).then(body => {
            // body is never empty if no error => {"success": true, "message": captcha correct}
            if (!body.error) {

                // if the backend validation was sucessful reset the form
                if (body.success === true) {
                    formFeedback(true);
                    contactName.value = '';
                    contactEmail.value = '';
                    contactMessage.value = '';
                    modal.style.display = "none";
                    grecaptcha.reset();
                } else {
                    // TODO: if the captcha was not excepted userfeedback, maybe open captcha modal again with instructions for the user
                    console.log(body.message);
                    formFeedback(false);
                }

            } else {
                // TODO: if the background validation fails inform the user, which of the fields was filled out incorrectely
                console.log(body.error);
                formFeedback(false);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}