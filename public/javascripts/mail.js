const contactForm = document.getElementById("contactForm");
const contactFormButton = document.getElementById("contactFormButton")



contactFormButton.addEventListener("click", () => {
    grecaptcha.ready(function () {
        grecaptcha.execute('6Le9bpQUAAAAABVU0-DW-4QNoSneiSGYNyxX3EHz', {
            action: 'homepage'
        }).then(function (token) {
            console.log(token.length);


            let formValues = Object.values(contactForm).reduce((obj, field) => {
                if (field.name !== "contactFormButton") {
                    obj[field.name] = field.value;
                }
                return obj
            }, {})
            formValues.token = token;
            console.log(formValues);
            fetch(url + 'mail', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formValues)
                }).then(res => res.json())
                .catch((err) => {
                    console.log(err)
                });
        });
    });
});