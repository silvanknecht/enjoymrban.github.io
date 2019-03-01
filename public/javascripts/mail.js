const contactForm = document.getElementById("contactForm");
const contactFormButton = document.getElementById("contactFormButton");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactMessage = document.getElementById("contactMessage");


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

//contactFormButton.addEventListener("click", () => {
function sendForm() {
    let formValues = Object.values(contactForm).reduce((obj, field) => {
        if (field.name !== "contactFormButton" && field.name !== "g-recaptcha-response") {
            obj[field.name] = field.value;
        }
        return obj;
    }, {});
    formValues.token = document.querySelector('#g-recaptcha-response').value;
    fetch(url + 'mail', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        }).then(res => {
            return res.json();
        }).then(body => {
            // TODO: body is never empty if no error => {"sucess": true, "message": captcha correct}
            if (!body.error) {
                formFeedback(true);
                contactName.value = '';
                contactEmail.value = '';
                contactMessage.value = '';

            } else {
                console.log(body.error);
                formFeedback(false);
            }


        })
        .catch((error) => {
            console.log(error);
        });
}