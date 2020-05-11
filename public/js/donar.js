document.getElementById("commentForm").onsubmit = function(e) {
    e.preventDefault()
    const places = document.getElementById('places').value;
    const date = document.getElementById('date').value;
    const pincode = document.getElementById('pincode').value;
    const time = document.getElementById('slot').value;
    const units = document.getElementById('units').value;
    var formData = new FormData(document.getElementById("commentForm"))
    var captchaResponse = formData.get("g-recaptcha-response")
    fetch("/org/donate/" + "/" + encodeURI(places) + "/" + encodeURI(date) + "/" + encodeURI(pincode) + "/" + encodeURI(time) + "/" + "/" + encodeURI(units) + '/' + encodeURI(captchaResponse), {
        method: "POST"
    }).then(() => {
        location.replace(`/org/dashboard`)
    })
}