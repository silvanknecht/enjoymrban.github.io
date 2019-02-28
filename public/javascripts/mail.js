const contactForm = document.getElementById("contactForm");
const contactFormButton = document.getElementById("contactFormButton");


contactFormButton.addEventListener("click", () => {
    let formValues = Object.values(contactForm).reduce((obj, field) => {
        if (field.name !== "contactFormButton" && field.name !=="g-recaptcha-response") {
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
            console.log(body[0]);
        })
        .catch((error) => {
            console.log(error)
        });
});