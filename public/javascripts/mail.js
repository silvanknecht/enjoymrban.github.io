const contactForm = document.getElementById("contactForm");
const contactFormButton = document.getElementById("contactFormButton");


function notValid() {
    document.querySelector('button').className = "formFail";
    let elm = document.querySelector('button');
    let newone = elm.cloneNode(true);
    elm.parentNode.replaceChild(newone, elm);
}

contactFormButton.addEventListener("click", () => {
    let formValues = Object.values(contactForm).reduce((obj, field) => {
        if (field.name !== "contactFormButton" && field.name !== "g-recaptcha-response") {
            obj[field.name] = field.value;
        }
        return obj
    }, {})
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
            if (body) {
                console.log(body);
                notValid();

            } else {
                document.querySelector('button').className = "formSuccess";
            }


        })
        .catch((error) => {
            console.log(error)
        });
});